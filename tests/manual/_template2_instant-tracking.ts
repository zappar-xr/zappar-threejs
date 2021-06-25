/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../../src";
import { camera, renderer, targetPlane, scenePlane, scene } from "./common";

const trackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, new ZapparThree.InstantWorldTracker());
scene.add(trackerGroup);

camera.poseAnchorOrigin = trackerGroup.instantTracker.anchor;

trackerGroup.add(targetPlane);

let hasPlaced = false;

renderer.domElement.addEventListener("click", () => {
  hasPlaced = true;
});

function animate() {
  requestAnimationFrame(animate);
  if (!hasPlaced) {
    trackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  }
  camera.updateFrame(renderer);

  if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
    scenePlane.position.set(0, -0.5, 0);
  } else {
    scenePlane.position.set(0, -0.5, -5);
  }

  renderer.render(scene, camera);
}
animate();
