import { VERSION } from './version';

console.log(`Zappar for ThreeJS v${VERSION}`);

export { Camera, CameraPoseMode, CameraMirrorMode } from "./camera";
export { ImageAnchorGroup } from "./imageanchorgroup"
export { ImageTrackerLoader } from "./imagetrackerloader"
export { InstantWorldAnchorGroup } from "./instantworldanchorgroup"
export { FaceAnchorGroup } from "./faceanchorgroup"
export { FaceLandmarkGroup } from "./facelandmarkgroup"
export { FaceTrackerLoader } from "./facetrackerloader"
export { FaceBufferGeometry } from "./facebuffergeometry"
export { FaceMeshLoader } from "./facemeshloader"
export { HeadMaskMesh } from "./headmaskmesh"
export { HeadMaskMeshLoader } from "./headmaskmeshloader"
export { LoadingManager, LoaderStyle, DefaultLoaderUI } from './loadingmanager';
export {
    ImageTracker,
    InstantWorldTracker,
    BarcodeFinder,
    FaceTracker,
    CameraSource,
    HTMLElementSource,
    onFrameUpdate,
    glContextSet,
    glContextLost,
    getDefaultPipeline
} from "./defaultpipeline"

export {
    ImageAnchor,
    BarcodeFinderFound, BarcodeFormat,
    FaceAnchor,
    FaceMesh,
    FaceLandmark,
    FaceLandmarkName,
    Pipeline,
    LogLevel, setLogLevel,
    permissionDenied, permissionGranted, permissionRequest, permissionDeniedUI, permissionRequestUI,
    browserIncompatible, browserIncompatibleUI
} from "@zappar/zappar"
