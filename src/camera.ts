import * as Zappar from "@zappar/zappar";
import { InstantWorldAnchor } from "@zappar/zappar/lib/instantworldtracker";
import { THREE } from "./three";
import { getDefaultPipeline, CameraSource } from "./defaultpipeline";
import { CameraTexture } from "./cameraTexture";

/**
 * The pose modes that determine how the camera moves around in the scene.
 */
export enum CameraPoseMode {
  /**
   * The camera sits, stationary, at the origin of world space, and points down the negative Z axis.
   * In this mode, tracked anchors move in world space as the user moves the device or tracked objects in the real world.
   */
  Default,

  /**
   * The camera sits at the origin of world space, but rotates as the user rotates the physical device.
   *
   * When the Zappar library initializes, the negative Z axis of world space points forward in front of the user.
   *
   * In this mode, tracked anchors move in world space as the user moves the device or tracked objects in the real world.
   */
  Attitude,

  /**
   * In this case the camera moves and rotates in world space around the anchor at the origin.
   */
  AnchorOrigin,
}

/**
 * The mirror modes that may be used.
 */
export enum CameraMirrorMode {
  /**
   * No mirroring.
   */
  None,

  /**
   * This mode mirrors the background camera texture and ensures content still appears correctly tracked.
   * In this mode your content itself isn't flipped, so any text in your tracked content doesn't appear mirrored.
   * This is the default mode for the user-facing camera.
   */
  Poses,

  /**
   * In this mode, the Zappar camera applies a scaleX(-1) CSS transform to your whole canvas.
   * This way both the camera and your content appear mirrored.
   */
  CSS,
}

/**
 * The source of frames.
 */
type Source = HTMLImageElement | HTMLVideoElement | string;

/**
 * The directions that the camera can face.
 */
enum CameraDirection {
  /** The camera is not running.
   * This is the default mode for the camera.
   */
  None,

  /** In this mode, the camera is always facing the user. */
  User,

  /** In this mode, the camera is always facing away from the user. */
  Rear,
}

/**
 * Rear and user camera source options.
 * @property rearCameraSource? - The camera source which will be used for the rear camera.
 * @property userCameraSource? - The camera source which will be used for the user camera.
 */
type SourceOptions = {
  rearCameraSource?: Source;
  userCameraSource?: Source;
};

/**
 * Options to modify the camera behavior.
 * @param pipeline - The pipeline that this tracker will operate within.
 * @property pipeline? - The pipeline that this tracker will operate within.
 * @property zNear? - The near clipping plane.
 * @property zFar? - The far clipping plane.
 * @property backgroundTexture? - An instance of CameraTexture to use. This should usually be left blank.
 */
export type Options =
  | Zappar.Pipeline
  | (Partial<{
      pipeline: Zappar.Pipeline;
      zNear: number;
      zFar: number;
      backgroundTexture: CameraTexture;
    }> &
      SourceOptions);

/**
 * Creates a camera that you can use instead of a perspective camera.
 *
 * The camera provides a {@link Camera.backgroundTexture} property containing the camera feed.
 *
 * The ZapparThree library needs to use your WebGL context in order to process camera frames.
 * You can set it when your page loads using {@link glContextSet}.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/camera-setup/
 */
export class Camera extends THREE.Camera {
  public pipeline: Zappar.Pipeline;

  /**
   * The camera feed texture.
   *
   * You can use this texture however you wish but the easiest way to show the camera feed behind your content is to set it as your scene's background.
   */

  public backgroundTexture: CameraTexture;

  /**
   * A 4x4 column-major transformation matrix where the camera sits.
   */
  public rawPose: Float32Array;

  /**
   * The pose mode that determines how the camera moves in the scene.
   */
  public poseMode = CameraPoseMode.Default;

  /**
   * The transformation with the (camera-relative) origin specified by the anchor.
   */
  public poseAnchorOrigin: Zappar.ImageAnchor | Zappar.FaceAnchor | InstantWorldAnchor | undefined;

  /**
   * The mirror mode that is used for the rear camera.
   */
  public rearCameraMirrorMode: CameraMirrorMode = CameraMirrorMode.None;

  /**
   * The mirror mode that is used for the user camera.
   */
  public userCameraMirrorMode: CameraMirrorMode = CameraMirrorMode.Poses;

  private _currentMirrorMode: CameraMirrorMode = CameraMirrorMode.None;

  /**
   * @ignore
   * Needed for raycasters to work.
   */
  public isPerspectiveCamera = true;

  /**
   * The camera source which is used for the rear camera.
   */
  public rearCameraSource: CameraSource | Zappar.HTMLElementSource;

  /**
   * The camera source which is used for the user camera.
   */
  public userCameraSource: CameraSource | Zappar.HTMLElementSource;

  private cameraDirection: CameraDirection = CameraDirection.None;

  private hasSetCSSScaleX = false;

  private zFar;

  private zNear;

  private renderWidth = 0;

  private renderHeight = 0;

  /**
   * Constructs a new Camera.
   * @param pipeline - The pipeline that this tracker will operate within.
   * @property pipeline - The pipeline that this tracker will operate within.
   * @property zNear - The near clipping plane.
   * @property zFar - The far clipping plane.
   * @property rearCameraSource? - The camera source which will be used for the rear camera.
   * @property userCameraSource? - The camera source which will be used for the user camera.
   */
  public constructor(opts?: Options) {
    super();

    this.pipeline = opts instanceof Zappar.Pipeline ? opts : opts?.pipeline || getDefaultPipeline();
    this.rawPose = this.pipeline.cameraPoseDefault();

    if (opts && !(opts instanceof Zappar.Pipeline)) {
      this.zNear = opts.zNear ? opts.zNear : 0.1;
      this.zFar = opts.zFar ? opts.zFar : 100;
      this.rearCameraSource = this.cameraSourceFromOpts(opts.rearCameraSource);
      this.userCameraSource = this.cameraSourceFromOpts(opts.userCameraSource, true);
      this.backgroundTexture = opts.backgroundTexture ? opts.backgroundTexture : new CameraTexture();
    } else {
      this.rearCameraSource = new CameraSource(Zappar.cameraDefaultDeviceID(), this.pipeline);
      this.userCameraSource = new CameraSource(Zappar.cameraDefaultDeviceID(true), this.pipeline);
      this.backgroundTexture = new CameraTexture();
    }

    this.matrixAutoUpdate = false;
    document.addEventListener("visibilitychange", () => {
      document.visibilityState === "visible" ? this.resume() : this.pause();
    });
  }

  /**
   * Constructs a new CameraSource or HTMLElementSource based on parameters passed in.
   * @param cameraSource - HTML element or camera device ID which will be used as a source
   * @returns CameraSource if cameraSource param is undefined or string, otherwise HTMLElementSource.
   */
  private cameraSourceFromOpts(cameraSource?: Source, frontFacing = false): CameraSource | Zappar.HTMLElementSource {
    return cameraSource instanceof Element
      ? new Zappar.HTMLElementSource(this.pipeline, cameraSource)
      : new CameraSource(cameraSource || Zappar.cameraDefaultDeviceID(frontFacing), this.pipeline);
  }

  /**
   * Pauses the camera source.
   */
  private pause() {
    this.userCameraSource.pause();
    this.rearCameraSource.pause();
  }

  /**
   * Starts the camera source.
   *
   * Starting a given source pauses any other sources within the same pipeline.
   */
  private resume() {
    switch (this.cameraDirection) {
      case CameraDirection.User:
        this.userCameraSource.start();
        break;
      case CameraDirection.Rear:
        this.rearCameraSource.start();
        break;
      default:
        // do not start any camera
        break;
    }
  }

  /**
   * Starts the camera source.
   * @param userFacing - If true, starts the user facing camera. (i.e selfie).
   */
  public start(userFacing?: boolean): void {
    this.cameraDirection = userFacing ? CameraDirection.User : CameraDirection.Rear;
    this.resume();
  }

  /**
   * Stops the camera source.
   */
  public stop(): void {
    this.cameraDirection = CameraDirection.None;
    this.pause();
  }

  /**
   * Sets the pose mode to 'Anchor Origin'.
   *
   * In this case the camera moves and rotates in world space around the anchor at the origin.
   * @param anchor - The anchor that defines the origin.
   */
  public setPoseModeAnchorOrigin(anchor: Zappar.Anchor): void {
    this.poseAnchorOrigin = anchor;
    this.poseMode = CameraPoseMode.AnchorOrigin;
  }

  /**
   * Gets the current mirror mode.
   */
  public get currentMirrorMode(): CameraMirrorMode {
    // eslint-disable-next-line no-underscore-dangle
    return this._currentMirrorMode;
  }

  /**
   * Processes camera frames and updates `backgroundTexture`.
   * Call this function on your pipeline once an animation frame (e.g. during your `requestAnimationFrame` function).
   * @param renderer - The Three.js WebGL renderer.
   */
  public updateFrame(renderer: THREE.WebGLRenderer): void {
    this.pipeline.processGL();

    // Update to using the latest tracking frame data
    this.pipeline.frameUpdate();

    // eslint-disable-next-line no-underscore-dangle
    this._currentMirrorMode = this.pipeline.cameraFrameUserFacing() ? this.userCameraMirrorMode : this.rearCameraMirrorMode;

    const { domElement } = renderer;

    if (this.currentMirrorMode !== CameraMirrorMode.CSS && this.hasSetCSSScaleX) {
      domElement.style.transform = "";
      this.hasSetCSSScaleX = false;
    } else if (this.currentMirrorMode === CameraMirrorMode.CSS && !this.hasSetCSSScaleX) {
      domElement.style.transform = "scaleX(-1)";
      this.hasSetCSSScaleX = true;
    }

    this.renderWidth = renderer.domElement.width;
    this.renderHeight = renderer.domElement.height;

    // eslint-disable-next-line no-underscore-dangle
    this._updateProjectionMatrix();

    // Get the pose of the camera from the Zappar library
    switch (this.poseMode) {
      case CameraPoseMode.Default:
        this.rawPose = this.pipeline.cameraPoseDefault();
        break;
      case CameraPoseMode.Attitude:
        this.rawPose = this.pipeline.cameraPoseWithAttitude(this.currentMirrorMode === CameraMirrorMode.Poses);
        break;
      case CameraPoseMode.AnchorOrigin:
        this.rawPose = this.poseAnchorOrigin ? this.getOriginPose() : this.pipeline.cameraPoseDefault();
        break;
      default:
        this.rawPose = this.pipeline.cameraPoseDefault();
        break;
    }
    this.matrixWorldNeedsUpdate = true;
    this.backgroundTexture.MirrorMode = this.currentMirrorMode;
    this.backgroundTexture.updateFromPipeline(renderer, this.pipeline);
  }

  // eslint-disable-next-line no-underscore-dangle
  public _updateProjectionMatrix() {
    // Get the projection matrix for the camera from the Zappar library
    const model = this.pipeline.cameraModel();
    const projection = Zappar.projectionMatrixFromCameraModel(model, this.renderWidth, this.renderHeight, this.zNear, this.zFar);
    this.projectionMatrix.fromArray(projection);

    if (typeof (this.projectionMatrixInverse as any).invert === "function") {
      (this.projectionMatrixInverse.copy(this.projectionMatrix) as any).invert();
    } else {
      this.projectionMatrixInverse.getInverse(this.projectionMatrix);
    }
  }

  public updateMatrixWorld(force?: boolean): void {
    this.matrix.fromArray(this.rawPose);
    this.matrix.decompose(this.position, this.quaternion, this.scale);
    super.updateMatrixWorld(force);
  }

  private getOriginPose(): Float32Array {
    if (!this.poseAnchorOrigin) return this.pipeline.cameraPoseDefault();
    return this.pipeline.cameraPoseWithOrigin(this.poseAnchorOrigin.poseCameraRelative(this.currentMirrorMode === CameraMirrorMode.Poses));
  }

  /**
   * Destroys the camera sources.
   */
  public dispose(): void {
    this.rearCameraSource.destroy();
    this.userCameraSource.destroy();
  }
}
