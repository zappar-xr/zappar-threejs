/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, targetPlane, scenePlane, setCameraSource } from "./common";

setCameraSource("face");

const faceTracker = new ZapparThree.FaceTrackerLoader().load();

const mask = new ZapparThree.HeadMaskMeshLoader().load();
const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);

scene.add(trackerGroup);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

trackerGroup.add(cube);
trackerGroup.add(mask);
trackerGroup.add(targetPlane);

faceTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});
faceTracker.onVisible.bind(() => {
  setTimeout(() => {
    console.log("Anchor is visible");
  }, 1000);
});
function animate() {
  requestAnimationFrame(animate);
  mask.updateFromFaceAnchorGroup(trackerGroup);
  camera.updateFrame(renderer);
  renderer.render(scene, camera);
}
animate();
