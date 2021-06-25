/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../../src";
import { renderer, camera, scene, targetPlane, scenePlane } from "./common";

import faceTextureImage from "../assets/textures/faceMeshTemplate.png";

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const faceMesh = new ZapparThree.FaceMeshLoader().load();
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
    transparent: true,
    opacity: 0.7,
  })
);

trackerGroup.add(faceMeshMesh);
trackerGroup.add(targetPlane);

faceTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});

function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);
  faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);

  if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
    scenePlane.position.set(0, -0.5, 0);
  } else {
    scenePlane.position.set(0, -0.5, -5);
  }
  renderer.render(scene, camera);
}
animate();
