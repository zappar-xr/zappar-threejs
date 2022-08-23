import { VERSION } from "./version";

console.log(`Zappar for ThreeJS v${VERSION}`);

export { Camera, CameraPoseMode, CameraMirrorMode } from "./camera";
export { ImageAnchorGroup } from "./trackers/imageanchorgroup";
export { ImageTrackerLoader } from "./loaders/imagetrackerloader";
export { InstantWorldAnchorGroup } from "./trackers/instantworldanchorgroup";
export { FaceAnchorGroup } from "./trackers/faceanchorgroup";
export { FaceLandmarkGroup } from "./trackers/facelandmarkgroup";
export { FaceTrackerLoader } from "./loaders/facetrackerloader";
export { FaceBufferGeometry } from "./geometry/facebuffergeometry";
export { FaceMeshLoader } from "./loaders/facemeshloader";
export { HeadMaskMesh } from "./mesh/headmaskmesh";
export { HeadMaskMeshLoader } from "./loaders/headmaskmeshloader";
export { LibraryLoader } from "./loaders/libraryloader";
export { LoadingManager, LoaderStyle, DefaultLoaderUI } from "./loaders/loadingmanager";
export { CameraEnvironmentMap } from "./cameraenvironmentmap";
export { TargetImagePreviewBufferGeometry } from "./geometry/targetimagepreviewbuffergeometry";
export { TargetImagePreviewMesh } from "./mesh/targetimagepreviewmesh";
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
  getDefaultPipeline,
} from "./defaultpipeline";

export {
  ImageAnchor,
  BarcodeFinderFound,
  BarcodeFormat,
  FaceAnchor,
  FaceMesh,
  FaceLandmark,
  FaceLandmarkName,
  Pipeline,
  LogLevel,
  setLogLevel,
  permissionDenied,
  permissionGranted,
  permissionRequest,
  permissionDeniedUI,
  permissionRequestUI,
  browserIncompatible,
  browserIncompatibleUI,
  loaded,
  loadedPromise,
  SequenceSource,
} from "@zappar/zappar";
