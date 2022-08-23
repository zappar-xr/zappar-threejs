/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, scenePlane, cameraPlane, setCameraSource } from "./common";
import targetImage from "../../assets/jest/zpt/preview_target.zpt";

setCameraSource("image");
camera.remove(cameraPlane);
scene.remove(scenePlane);

const imageTracker = new ZapparThree.ImageTracker();

imageTracker.loadTarget(targetImage).then(() => {
  const [target] = imageTracker.targets;
  const mesh = new ZapparThree.TargetImagePreviewMesh(target);
  imageTrackerGroup.add(mesh);
});

const imageTrackerGroup = new ZapparThree.ImageAnchorGroup(camera, imageTracker);
scene.add(imageTrackerGroup);

imageTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});

imageTracker.onVisible.bind(() => {
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
