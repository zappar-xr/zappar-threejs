/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, setCameraSource } from "./common";

setCameraSource("face");

const envMap = new ZapparThree.CameraEnvironmentMap();
scene.environment = envMap.environmentMap;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshStandardMaterial({ metalness: 1.0, roughness: 0.0 }));

sphere.position.set(0, 0, -5);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);
  envMap.update(renderer, camera);
  renderer.render(scene, camera);
}
animate();
