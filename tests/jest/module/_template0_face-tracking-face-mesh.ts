/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, targetPlane, scenePlane, setCameraSource } from "./common";

setCameraSource("face");

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const faceMesh = new ZapparThree.FaceMeshLoader().load();
const textureLoader = new THREE.TextureLoader();

const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

const faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const faceMeshMesh = new THREE.Mesh(faceBufferGeometry, material);

trackerGroup.add(faceMeshMesh);

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
  faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);
  camera.updateFrame(renderer);
  renderer.render(scene, camera);
}
animate();
