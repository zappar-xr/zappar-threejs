/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as ZapparThree from "../../src";

import { renderer, camera, targetPlane, scenePlane, scene } from "./common";

import maskedHelmet from "../assets/models/masked_helmet.glb";

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const headMaskMesh = new ZapparThree.HeadMaskMeshLoader().load();

const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

trackerGroup.add(headMaskMesh);

const gltfLoader = new GLTFLoader();

gltfLoader.load(
  maskedHelmet,
  (gltf) => {
    //! This is outdated, <TODO> replace with head mask mesh
    gltf.scene.position.set(0.3, -1.3, 0);
    gltf.scene.scale.set(1.1, 1.1, 1.1);
    // eslint-disable-next-line no-restricted-syntax
    for (const child of gltf.scene.getObjectByName("Helmet_Mask")?.children as THREE.Mesh[]) {
      (child.material as THREE.Material).visible = false;
    }
    trackerGroup.add(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

trackerGroup.add(targetPlane);

faceTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});

function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);
  headMaskMesh.updateFromFaceAnchorGroup(trackerGroup);

  if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
    scenePlane.position.set(0, -0.5, 0);
  } else {
    scenePlane.position.set(0, -0.5, -5);
  }
  renderer.render(scene, camera);
}
animate();
