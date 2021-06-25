/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import cameraPlaneTexture from "../../assets/planes/camera.jpg";
import scenePlaneTexture from "../../assets/planes/scene.jpg";
import targetPlaneTexture from "../../assets/planes/target.jpg";

import faceImageSource from "../../assets/jest/camera-sources/face-target.jpg";
import targetImageImageSource from "../../assets/jest/camera-sources/image-target.jpg";

ZapparThree.setLogLevel(ZapparThree.LogLevel.LOG_LEVEL_VERBOSE);

const textureLoader = new THREE.TextureLoader();

// @ts-ignore
const getTexturedPlane = (src) =>
  new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 0.25), new THREE.MeshBasicMaterial({ map: textureLoader.load(src), transparent: true, opacity: 0.75 }));

export const targetPlane = getTexturedPlane(targetPlaneTexture);
export const scenePlane = getTexturedPlane(scenePlaneTexture);
export const cameraPlane = getTexturedPlane(cameraPlaneTexture);

scenePlane.position.set(0, -0.5, -5);
cameraPlane.position.set(0, 0, -5);

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error("Browser incompatible");
}
export const renderer = new THREE.WebGLRenderer();

const canvasHolder = document.querySelector("#canvas-holder") || document.createElement("div");
canvasHolder.appendChild(renderer.domElement);

ZapparThree.glContextSet(renderer.getContext());

renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);

window.addEventListener("resize", () => {
  renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
});

const img = document.createElement("img");
export const camera = new ZapparThree.Camera({
  rearCameraSource: img,
});
// @ts-ignore
export const setCameraSource = (type) => {
  img.src = type === "face" ? faceImageSource : targetImageImageSource;
};

img.onload = () => {
  camera.start();
};

camera.add(cameraPlane);

export const scene = new THREE.Scene();

scene.background = camera.backgroundTexture;
scene.add(camera, scenePlane);

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
};

setupLights();

function animate() {
  requestAnimationFrame(animate);
  if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
    scenePlane.position.set(0, -0.5, 0);
  } else {
    scenePlane.position.set(0, -0.5, -5);
  }
}
animate();
