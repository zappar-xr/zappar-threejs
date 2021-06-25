/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import faceTextureImage from "../../assets/textures/faceMeshTemplate.png";

import { renderer, camera, scene, targetPlane, scenePlane, setCameraSource } from "./common";

setCameraSource("face");

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const faceMesh = new ZapparThree.FaceMeshLoader().loadFullHeadSimplified();
const textureLoader = new THREE.TextureLoader();

const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

const faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);
const faceTexture = textureLoader.load(faceTextureImage);

faceTexture.flipY = false;
const faceMeshMesh = new THREE.Mesh(
  faceBufferGeometry,
  new THREE.MeshStandardMaterial({
    map: faceTexture,
  })
);

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
