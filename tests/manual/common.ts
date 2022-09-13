import * as THREE from "three";
import * as ZapparThree from "../../src";

import cameraPlaneTexture from "../assets/planes/camera.jpg";
import scenePlaneTexture from "../assets/planes/scene.jpg";
import targetPlaneTexture from "../assets/planes/target.jpg";

let sequenceSource: ZapparThree.SequenceSource | undefined;

const textureLoader = new THREE.TextureLoader();

ZapparThree.setLogLevel(ZapparThree.LogLevel.LOG_LEVEL_VERBOSE);

export const targetPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshBasicMaterial({ map: textureLoader.load(targetPlaneTexture) }));
export const scenePlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshBasicMaterial({ map: textureLoader.load(scenePlaneTexture) }));
export const cameraPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshBasicMaterial({ map: textureLoader.load(cameraPlaneTexture) }));

// targetPlane.scale.set(0.1, 0.1, 0.1);
scenePlane.position.set(0, -0.5, -5);
cameraPlane.position.set(0, 0, -5);

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Browser incompatible");
}

const canvasHolder = document.querySelector("#canvas-holder") || document.createElement("div");

export const renderer = new THREE.WebGLRenderer();
canvasHolder.appendChild(renderer.domElement);

renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
window.addEventListener("resize", () => {
  renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
});

ZapparThree.glContextSet(renderer.getContext());

export const camera = new ZapparThree.Camera();
camera.add(cameraPlane);

ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

const axis = new THREE.AxesHelper(2);

export const scene = new THREE.Scene();
scene.background = camera.backgroundTexture;

scene.add(camera);
scene.add(axis);
scene.add(scenePlane);

const setupDomButtons = () => {
  const cameraSelect = (document.querySelector("#cameraSelect") as HTMLSelectElement) || document.createElement("select");
  cameraSelect.addEventListener("change", () => camera.start(cameraSelect.value === "userFacing"));

  const mirrorSelect = (document.querySelector("#mirrorSelect") as HTMLSelectElement) || document.createElement("select");
  mirrorSelect.addEventListener("change", () => {
    switch (mirrorSelect.value) {
      case "css":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
        break;
      case "poses":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
        break;
      case "nomirror":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        break;
      default:
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        break;
    }
  });

  const poseSelect = (document.querySelector("#poseSelect") as HTMLSelectElement) || document.createElement("select");
  poseSelect.addEventListener("change", () => {
    switch (poseSelect.value) {
      case "default":
        camera.poseMode = ZapparThree.CameraPoseMode.Default;
        break;
      case "attitude":
        camera.poseMode = ZapparThree.CameraPoseMode.Attitude;
        break;
      case "anchor":
        camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;
        break;
      default:
        camera.poseMode = ZapparThree.CameraPoseMode.Default;
        break;
    }
  });
};

const setupLights = () => {
  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.set(0, 2, 0);
  light.lookAt(0, 0, 0);
  scene.add(light);
  const light2 = new THREE.AmbientLight("white", 0.5);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight("white", 0.1);
  light3.position.set(-1, -1, -1);
  light3.lookAt(0, 0, 0);
  scene.add(light3);

  const helper = new THREE.DirectionalLightHelper(light);
  scene.add(helper);
};
const recordSequence = document.querySelector<HTMLButtonElement>("#recordSequence") || document.createElement("button");
recordSequence.addEventListener("click", () => {
  camera.pipeline.sequenceRecordStart(6 * 25);
  recordSequence.disabled = true;
  setTimeout(() => {
    camera.pipeline.sequenceRecordStop();
    const data = camera.pipeline.sequenceRecordData();
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "sequence.uar";
    a.href = url;
    a.click();
    recordSequence.disabled = false;
  }, 5000);
});

const playSequence = document.querySelector<HTMLButtonElement>("#playSequence") || document.createElement("button");
playSequence.addEventListener("click", () => {
  const upload = document.createElement("input");
  upload.type = "file";
  upload.addEventListener("change", async () => {
    if (!sequenceSource) sequenceSource = new ZapparThree.SequenceSource(camera.pipeline);
    const f = upload.files?.[0];
    if (!f) return;
    sequenceSource.load(await f.arrayBuffer());
    sequenceSource.start();
  });
  upload.click();
});

setupDomButtons();
setupLights();
