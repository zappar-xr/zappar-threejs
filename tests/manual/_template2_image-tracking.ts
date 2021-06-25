/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../../src";
import { camera, renderer, scene, targetPlane, scenePlane } from "./common";
import targetFile from "../assets/zpt/restflyer.zpt";

const imageTracker = new ZapparThree.ImageTrackerLoader().load(targetFile);
const trackerGroup = new ZapparThree.ImageAnchorGroup(camera, imageTracker);
scene.add(trackerGroup);

trackerGroup.add(targetPlane);

imageTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});

imageTracker.onVisible.bind(() => {
  console.log("VISIBLE!");
  trackerGroup.visible = true;
});

imageTracker.onNotVisible.bind(() => {
  console.log("NOTVISIBLE!");
  trackerGroup.visible = false;
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
