import { Pipeline } from "@zappar/zappar";
import { CameraMirrorMode } from "./camera";
import { THREE } from "./three";

/**
 * Creates a texture to be used internally by `ZapparThree.Camera`.
 */
export class CameraTexture extends THREE.Texture {
  public MirrorMode: CameraMirrorMode = CameraMirrorMode.None;

  public isVideoTexture = true;

  /**
   * Override three.js update function since we update the camera texture ourselves.
   */
  public update() {} // eslint-disable-line class-methods-use-this

  /**
   * Processes camera frames and updates the texture.
   * @param renderer - The Three.js WebGL renderer.
   * @param pipeline - A ZapparThree Pipeline.
   */
  public updateFromPipeline(renderer: THREE.WebGLRenderer, pipeline: Pipeline) {
    this.encoding = renderer.outputEncoding;

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
    const view = new THREE.Matrix4();
    view.fromArray(pipeline.cameraFrameTextureMatrix(renderer.domElement.width, renderer.domElement.height, this.MirrorMode === CameraMirrorMode.Poses));

    // ThreeJS's Texture object uses a 3x3 matrix, so convert from our 4x4 matrix
    const textureMatrix3 = new THREE.Matrix3();
    textureMatrix3.setFromMatrix4(view);
    // eslint-disable-next-line prefer-destructuring
    textureMatrix3.elements[6] = view.elements[12];
    // eslint-disable-next-line prefer-destructuring
    textureMatrix3.elements[7] = view.elements[13];
    textureMatrix3.elements[8] = 1;

    // The typings for ThreeJS's Texture object does not include the matrix properties
    // so we have a custom type here
    (this as THREE.Texture & { matrixAutoUpdate: boolean; matrix: THREE.Matrix3 }).matrixAutoUpdate = false;
    (this as THREE.Texture & { matrixAutoUpdate: boolean; matrix: THREE.Matrix3 }).matrix = textureMatrix3;
  }
}
