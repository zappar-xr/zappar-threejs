/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../src";
import { FaceAnchorGroup } from "../src";
import { renderer } from "./common"

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const faceMesh = new ZapparThree.FaceMeshLoader().load();
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();



const imgUrl = require("file-loader!./assets/face.png").default;
const img = document.createElement("img");
img.src = imgUrl;

export const camera = new ZapparThree.Camera({rearCameraSource: img});
img.onload = () => {
  camera.start(true);
}

scene.add(camera);



const trackerGroup = new FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

const faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);
const faceTexture = textureLoader.load(require("file-loader!./faceMeshTemplate.png").default);
faceTexture.flipY = false;
const faceMeshMesh = new THREE.Mesh(faceBufferGeometry, new THREE.MeshStandardMaterial({
    map: faceTexture, transparent: true, opacity:0.7
}));
trackerGroup.add(faceMeshMesh);


const light = new THREE.DirectionalLight("white", 0.5);
light.position.set(0, 2, 0);
light.lookAt(0, 0, 0);
scene.add(light);

scene.background = camera.backgroundTexture;

faceTracker.onNewAnchor.bind(anchor => { camera.poseAnchorOrigin = anchor });

function animate() {
    requestAnimationFrame(animate);
    camera.updateFrame(renderer);
    faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);

    renderer.render(scene, camera);
}
animate();
