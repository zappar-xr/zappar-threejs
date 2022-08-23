/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-nocheck

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import cameraPlaneTexture from "../../assets/planes/camera.jpg";
import scenePlaneTexture from "../../assets/planes/scene.jpg";
import targetPlaneTexture from "../../assets/planes/target.jpg";

import faceImageSource from "../../assets/jest/camera-sources/face-target.jpg";
import targetImageImageSource from "../../assets/jest/camera-sources/image-target.jpg";

// eslint-disable-next-line import/no-webpack-loader-syntax
// eslint-disable-next-line import/no-unresolved
const sourceUrl = require("file-loader!../../assets/jest/camera-sources/instant-tracking.uar").default;

ZapparThree.setLogLevel(ZapparThree.LogLevel.LOG_LEVEL_VERBOSE);

const textureLoader = new THREE.TextureLoader();

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

export const setCameraSource = (type) => {
  // type : "image" | "instant" | "face"
  // eslint-disable-next-line default-case
  switch (type) {
    case "image":
    case "face":
      img.src = type === "face" ? faceImageSource : targetImageImageSource;
      img.onload = () => {
        camera.start();
      };
      break;

    case "instant":
      const sequenceSource = new ZapparThree.SequenceSource(camera.pipeline);

      fetch(sourceUrl).then(async (resp) => {
        sequenceSource.load(await resp.arrayBuffer());

        sequenceSource.start();
      });
      break;
  }
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

// Adapted from: https://github.com/fheyen/dynamic-time-warping-2

export class DynamicTimeWarping {
  constructor(ts1, ts2, distanceFunction) {
    this.ser1 = ts1;

    this.ser2 = ts2;

    this.distFunc = distanceFunction;

    this.distance = null;

    this.matrix = null;

    this.path = null;
  }

  getDistance() {
    if (this.distance !== null) {
      return this.distance;
    }

    this.matrix = [];

    for (let i = 0; i < this.ser1.length; i++) {
      this.matrix[i] = [];

      for (let j = 0; j < this.ser2.length; j++) {
        let cost = Infinity;
        if (i > 0) {
          cost = Math.min(cost, this.matrix[i - 1][j]);
          if (j > 0) {
            cost = Math.min(cost, this.matrix[i - 1][j - 1]);

            cost = Math.min(cost, this.matrix[i][j - 1]);
          }
        } else if (j > 0) {
          cost = Math.min(cost, this.matrix[i][j - 1]);
        } else {
          cost = 0;
        }

        this.matrix[i][j] = cost + this.distFunc(this.ser1[i], this.ser2[j]);
      }
    }

    this.distance = this.matrix[this.ser1.length - 1][this.ser2.length - 1];

    return this.distance;
  }
}
