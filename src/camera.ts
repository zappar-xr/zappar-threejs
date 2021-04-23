import { THREE }  from "./three";
import * as Zappar from "@zappar/zappar";
import { InstantWorldAnchor } from "@zappar/zappar/lib/instantworldtracker";
import { getDefaultPipeline, CameraSource } from "./defaultpipeline";

export enum CameraPoseMode {
    Default,
    Attitude,
    AnchorOrigin
}

export enum CameraMirrorMode {
    None,
    Poses,
    CSS
}

type Source = HTMLImageElement | HTMLVideoElement | string;

type SourceOptions = {
    rearCameraSource? : Source,
    userCameraSource? : Source,
};

type Options = Zappar.Pipeline | (Partial<{
    pipeline: Zappar.Pipeline,
    zNear : number,
    zFar : number
}> & SourceOptions)


export class Camera extends THREE.Camera {

    public pipeline: Zappar.Pipeline;
    public backgroundTexture = new THREE.Texture();
    public rawPose: Float32Array;
    public poseMode = CameraPoseMode.Default;
    public poseAnchorOrigin: Zappar.ImageAnchor | Zappar.FaceAnchor | InstantWorldAnchor | undefined;
    public rearCameraMirrorMode: CameraMirrorMode = CameraMirrorMode.None;
    public userCameraMirrorMode: CameraMirrorMode = CameraMirrorMode.Poses;
    private _currentMirrorMode: CameraMirrorMode = CameraMirrorMode.None;
    public isPerspectiveCamera = true;

    public rearCameraSource: CameraSource | Zappar.HTMLElementSource;
    public userCameraSource: CameraSource | Zappar.HTMLElementSource;


    private _cameraRunningRear: boolean | null = null;
    private _hasSetCSSScaleX = false;
    private _emptyScene = new THREE.Scene();
    private _emptyTarget = new THREE.WebGLRenderTarget(2, 2);

    private zFar;
    private zNear;

    constructor(opts?: Options) {
        super();

        this.pipeline = opts instanceof Zappar.Pipeline? opts : opts?.pipeline || getDefaultPipeline();
        this.rawPose = this.pipeline.cameraPoseDefault();

        if( opts && !(opts instanceof Zappar.Pipeline)) {
            this.zNear = opts.zNear ? opts.zNear : 0.1;
            this.zFar = opts.zFar ? opts.zFar : 100;

            this.rearCameraSource = this._cameraSourceFromOpts(opts.rearCameraSource);
            this.userCameraSource = this._cameraSourceFromOpts(opts.userCameraSource, true);
        } else {
            this.rearCameraSource =  new CameraSource(Zappar.cameraDefaultDeviceID(), this.pipeline);
            this.userCameraSource =  new CameraSource(Zappar.cameraDefaultDeviceID(true), this.pipeline);
        }


        this.matrixAutoUpdate = false;
        document.addEventListener("visibilitychange", () => {
            document.visibilityState == "visible" ? this._resume() : this._pause();
        });

        const immediate = new THREE.ImmediateRenderObject(new THREE.MeshBasicMaterial());
        this._emptyScene.add(immediate);
    }

    private _cameraSourceFromOpts(cameraSource?: Source, frontFacing = false) : CameraSource | Zappar.HTMLElementSource {
        return cameraSource instanceof Element ?
            new Zappar.HTMLElementSource(this.pipeline, cameraSource) :
            new CameraSource(cameraSource || Zappar.cameraDefaultDeviceID(frontFacing), this.pipeline);
    }


    private _pause() {
        this.userCameraSource.pause();
        this.rearCameraSource.pause();
    }

    private _resume() {
        if (this._cameraRunningRear === null) return;
        this._cameraRunningRear ? this.rearCameraSource.start() : this.userCameraSource.start();
    }

    start(userFacing?: boolean) : void {
        userFacing ? this.userCameraSource.start() : this.rearCameraSource.start();
        this._cameraRunningRear = !userFacing;
    }

    setPoseModeAnchorOrigin(a: Zappar.ImageAnchor | Zappar.FaceAnchor) : void {
        this.poseAnchorOrigin = a;
        this.poseMode = CameraPoseMode.AnchorOrigin;
    }

    public get currentMirrorMode() : CameraMirrorMode{
        return this._currentMirrorMode;
    }

    updateFrame(renderer: THREE.WebGLRenderer) : void {

        const target = renderer.getRenderTarget();
        renderer.setRenderTarget(this._emptyTarget);

        renderer.render(this._emptyScene, this);

        // ThreeJS manages its GL state for optimal performance
        // Reset it here so it's predictable for processGL
        renderer.state.reset();

        this.pipeline.processGL();

        // Return to ThreeJS's standard state since processGL will have altered some state
        renderer.state.reset();

        renderer.setRenderTarget(target);

        // Update to using the latest tracking frame data
        this.pipeline.frameUpdate();

        this._currentMirrorMode = this.pipeline.cameraFrameUserFacing() ? this.userCameraMirrorMode : this.rearCameraMirrorMode;

        if (this._currentMirrorMode !== CameraMirrorMode.CSS && this._hasSetCSSScaleX) {
            renderer.domElement.style.transform = "";
            this._hasSetCSSScaleX = false;
        } else if (this._currentMirrorMode === CameraMirrorMode.CSS && !this._hasSetCSSScaleX) {
            renderer.domElement.style.transform = "scaleX(-1)";
            this._hasSetCSSScaleX = true;
        }

        // Get the projection matrix for the camera from the Zappar library
        const model = this.pipeline.cameraModel();
        const projection = Zappar.projectionMatrixFromCameraModel(model, renderer.domElement.width, renderer.domElement.height, this.zNear, this.zFar);
        this.projectionMatrix.fromArray(projection);

        if(typeof (this.projectionMatrixInverse as any).invert === 'function'){
            (this.projectionMatrixInverse.copy(this.projectionMatrix) as any).invert();
        } else {
           this.projectionMatrixInverse.getInverse(this.projectionMatrix);
        }


        // Get the pose of the camera from the Zappar library
        switch (this.poseMode) {
            case CameraPoseMode.Default:
                this.rawPose = this.pipeline.cameraPoseDefault();
                break;
            case CameraPoseMode.Attitude:
                this.rawPose = this.pipeline.cameraPoseWithAttitude(this._currentMirrorMode === CameraMirrorMode.Poses);
                break;
            case CameraPoseMode.AnchorOrigin:
                this.rawPose = this.poseAnchorOrigin ? this._getOriginPose() : this.pipeline.cameraPoseDefault();
                break;
        }

        this._updateBackgroundTexture(renderer);
    }

    updateMatrixWorld(force?: boolean) : void {
        this.matrix.fromArray(this.rawPose);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
        super.updateMatrixWorld(force);
    }

    private _getOriginPose(): Float32Array {
        if (!this.poseAnchorOrigin) return this.pipeline.cameraPoseDefault();
        return this.pipeline.cameraPoseWithOrigin(this.poseAnchorOrigin.poseCameraRelative(this._currentMirrorMode === CameraMirrorMode.Poses));
    }

    private _updateBackgroundTexture(r: THREE.WebGLRenderer) {
        this.pipeline.cameraFrameUploadGL();
        const texture = this.pipeline.cameraFrameTextureGL();
        if (!texture) return;

        // Update the underlying WebGL texture of the ThreeJS texture object
        // to the one provided by the Zappar library
        const properties = r.properties.get(this.backgroundTexture);
        properties.__webglTexture = texture;
        properties.__webglInit = true;

        // The Zappar library provides a 4x4 UV matrix to display the camera
        // texture on a fullscreen quad with 0,0 -> 1,1 UV coordinates
        const view = new THREE.Matrix4();
        view.fromArray(this.pipeline.cameraFrameTextureMatrix(r.domElement.width, r.domElement.height, this._currentMirrorMode === CameraMirrorMode.Poses));

        // ThreeJS's Texture object uses a 3x3 matrix, so convert from our 4x4 matrix
        const textureMatrix3 = new THREE.Matrix3();
        textureMatrix3.setFromMatrix4(view);
        textureMatrix3.elements[6] = view.elements[12];
        textureMatrix3.elements[7] = view.elements[13];
        textureMatrix3.elements[8] = 1;

        // The typings for ThreeJS's Texture object does not include the matrix properties
        // so we have a custom type here
        type BackgroundTexture = THREE.Texture & { matrixAutoUpdate : boolean, matrix : THREE.Matrix3 };
        (this.backgroundTexture as BackgroundTexture).matrixAutoUpdate = false;
        (this.backgroundTexture as BackgroundTexture).matrix = textureMatrix3;
    }

    public dispose() : void {
        this.rearCameraSource.destroy();
        this.userCameraSource.destroy();
    }
}

