/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import { MeshStandardMaterial, SphereGeometry } from "three";
import * as ZapparThree from "../../src";
import { camera, renderer, targetPlane, scenePlane, scene, cameraPlane } from "./common";

const trackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, new ZapparThree.InstantWorldTracker());
scene.add(trackerGroup);

camera.poseAnchorOrigin = trackerGroup.instantTracker.anchor;

const envMap = new ZapparThree.CameraEnvironmentMap();
scene.environment = envMap.environmentMap;

// We don't need these debug planes for this test and they get in the way, so remove them
scene.remove(scenePlane);
camera.remove(cameraPlane);

const sphere = new THREE.Mesh(new SphereGeometry(1, 16, 12), new MeshStandardMaterial({ metalness: 1.0, roughness: 0.0 }));

trackerGroup.add(sphere);

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
  envMap.update(renderer, camera);

  renderer.render(scene, camera);
}
animate();
