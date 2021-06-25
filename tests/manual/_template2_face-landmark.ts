/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../../src";
import { renderer, camera, scene, targetPlane, scenePlane } from "./common";

targetPlane.scale.set(0.2, 0.2, 0.2);

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const trackerGroup = new ZapparThree.FaceLandmarkGroup(camera, faceTracker, ZapparThree.FaceLandmarkName.CHIN);

scene.add(trackerGroup);
trackerGroup.add(targetPlane);

faceTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});

function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);

  if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
    scenePlane.position.set(0, -0.5, 0);
  } else {
    scenePlane.position.set(0, -0.5, -5);
  }
  renderer.render(scene, camera);
}
animate();
