/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Pipeline } from "@zappar/zappar";
import { Event1 } from "@zappar/zappar/lib/event";
import { zcout } from "@zappar/zappar-cv/lib/loglevel";
import { CameraMirrorMode } from "./camera";
import { THREE } from "./three";

type _Texture = {
  matrixAutoUpdate?: boolean;
  matrix?: THREE.Matrix3;
} & THREE.Texture;

const vertexShaderSource = `
      precision highp float;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `;

// https://github.com/mrdoob/three.js/pull/23782/commits/c5e8b4d5ce491cfc63b84a5b8be6bf9d2143e452
const fragmentShaderSource = `
      precision highp float;
      uniform sampler2D u_texture;
      varying vec2 vUv;
      void main() {
        vec4 texColor = texture2D(u_texture, vUv);
        texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
        gl_FragColor = texColor;
      }
    `;

/**
 * Creates a texture to be used internally by `ZapparThree.Camera`.
 */
export class CameraTexture extends THREE.Texture {
  private viewMatrix: THREE.Matrix4;

  private textureMatrix3: THREE.Matrix3;

  public MirrorMode: CameraMirrorMode = CameraMirrorMode.None;

  public onTextureUpdated = new Event1<{
    texture: THREE.Texture;
    renderer: THREE.WebGLRenderer;
  }>();

  public constructor() {
    super();

    // Initialize the matrices
    this.viewMatrix = new THREE.Matrix4();
    this.textureMatrix3 = new THREE.Matrix3();
  }

  /**
   * Override three.js update function since we update the camera texture ourselves.
   */
  protected update() {} // eslint-disable-line class-methods-use-this

  /**
   * Processes camera frames and updates the texture.
   * @param renderer - The Three.js WebGL renderer.
   * @param pipeline - A ZapparThree Pipeline.
   */
  public updateFromPipeline(renderer: THREE.WebGLRenderer, pipeline: Pipeline) {
    pipeline.cameraFrameUploadGL();
    const texture = pipeline.cameraFrameTextureGL();
    if (!texture) return;

    // Update the underlying WebGL texture of the ThreeJS texture object
    // to the one provided by the Zappar library
    const properties = renderer.properties.get(this);

    // eslint-disable-next-line no-underscore-dangle
    properties.__webglTexture = texture;
    // eslint-disable-next-line no-underscore-dangle
    properties.__webglInit = true;

    // The Zappar library provides a 4x4 UV matrix to display the camera
    // texture on a fullscreen quad with 0,0 -> 1,1 UV coordinates
    this.viewMatrix.fromArray(
      pipeline.cameraFrameTextureMatrix(renderer.domElement.width, renderer.domElement.height, this.MirrorMode === CameraMirrorMode.Poses)
    );

    // ThreeJS's Texture object uses a 3x3 matrix, so convert from our 4x4 matrix
    this.textureMatrix3.setFromMatrix4(this.viewMatrix);
    // eslint-disable-next-line prefer-destructuring
    this.textureMatrix3.elements[6] = this.viewMatrix.elements[12];
    // eslint-disable-next-line prefer-destructuring
    this.textureMatrix3.elements[7] = this.viewMatrix.elements[13];
    this.textureMatrix3.elements[8] = 1;

    (this as _Texture).matrixAutoUpdate = false;
    (this as _Texture).matrix = this.textureMatrix3;

    this.onTextureUpdated.emit({ texture: this, renderer });
  }

  public dispose() {
    super.dispose();
  }
}

/**
 * A helper class used to decode the camera texture.
 */
export class InlineDecoder {
  /**
   * A THREE scene to hold shader object.
   */
  private shaderScene = new THREE.Scene();

  private shaderRenderTarget = new THREE.WebGLRenderTarget(1024, 1024);

  private shaderMaterial: THREE.ShaderMaterial;

  private shaderCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  private intermediateRenderTarget = new THREE.WebGLRenderTarget(1024, 1024);

  /**
   * Get the texture of the render target.
   * @public
   * @returns THREE.Texture The texture of the render target.
   */
  public get texture() {
    return this.shaderRenderTarget.texture;
  }

  public constructor(cameraTexture: CameraTexture) {
    zcout("Inline decoder initialized");
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: { value: null },
      },
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
    });

    const shaderPlane = new THREE.PlaneGeometry(2, 2);
    const shaderQuad = new THREE.Mesh(shaderPlane, this.shaderMaterial);
    this.shaderScene.add(shaderQuad);

    this.shaderRenderTarget.texture.generateMipmaps = false;
    this.shaderRenderTarget.texture.minFilter = THREE.LinearFilter;
    this.shaderRenderTarget.texture.magFilter = THREE.LinearFilter;

    shaderQuad.position.z = -1;

    this.shaderMaterial.uniforms.u_texture.value = cameraTexture;

    cameraTexture.onTextureUpdated.bind(({ texture, renderer }) => {
      this.update(renderer, texture as CameraTexture);
    });
  }

  /**
   * Updates the shader uniform with a new texture and renders the shader scene to the target texture.
   */
  private update(renderer: THREE.WebGLRenderer, cameraTexture: CameraTexture) {
    // check the color space every frame as the user could have changed it at any time
    let decoderRequired = true;
    if ((THREE as any).SRGBColorSpace && (renderer as any).outputColorSpace) {
      decoderRequired = (renderer as any).outputColorSpace === (THREE as any).SRGBColorSpace;
    } else if ((THREE as any).sRGBEncoding && (renderer as any).outputEncoding) {
      decoderRequired = (renderer as any).outputEncoding === (THREE as any).sRGBEncoding;
    }

    if (!decoderRequired) return;

    // save the current render target so we can restore it later
    const previousRenderTarget = renderer.getRenderTarget();

    // update the uniform for the shader
    this.shaderMaterial.uniforms.u_texture.value = cameraTexture;

    // render the shader scene to the intermediate render target
    renderer.setRenderTarget(this.intermediateRenderTarget);
    renderer.render(this.shaderScene, this.shaderCamera);

    // copy the resulting texture to the final render target
    this.shaderRenderTarget.texture = this.intermediateRenderTarget.texture;

    // restore the previous render target
    renderer.setRenderTarget(previousRenderTarget);

    // update the texture matrix
    (this.texture as _Texture).matrixAutoUpdate = false;
    (this.texture as _Texture).matrix = cameraTexture.matrix;

    // This is to avoid the user having to pass in a renderer to the constructor of the camera.
    const properties = renderer.properties.get(cameraTexture);
    const renderTargetProperties = renderer.properties.get(this.texture);
    // steal webgl texture and swap it

    properties.__webglTexture = renderTargetProperties.__webglTexture;
    properties.__webglInit = true;
  }

  /**
   * Releases the resources held by this object.
   * @public
   */
  public dispose() {
    this.shaderRenderTarget.dispose();
  }
}
