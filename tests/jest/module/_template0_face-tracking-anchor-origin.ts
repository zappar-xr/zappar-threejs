/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, targetPlane, scenePlane, setCameraSource } from "./common";

setCameraSource("face");
camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;

const faceTracker = new ZapparThree.FaceTrackerLoader().load();

const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

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
  camera.updateFrame(renderer);
  renderer.render(scene, camera);
}
animate();
