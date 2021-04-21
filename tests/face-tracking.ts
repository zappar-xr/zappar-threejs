/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../src";
import { FaceAnchorGroup } from "../src";
import { renderer, camera } from "./common"

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const faceMesh = new ZapparThree.FaceMeshLoader().load();
const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
scene.add(camera);

const axis = new THREE.AxesHelper(2);
scene.add(axis);

const trackerGroup = new FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

const faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);
const faceTexture = textureLoader.load(require("file-loader!./faceMeshTemplate.png").default);
faceTexture.flipY = false;
const faceMeshMesh = new THREE.Mesh(faceBufferGeometry, new THREE.MeshStandardMaterial({
    map: faceTexture, transparent: true, opacity:0.7
}));
trackerGroup.add(faceMeshMesh);

const targetPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial( { map: textureLoader.load(require('file-loader!./target.jpg').default) } )
);
trackerGroup.add(targetPlane);

const scenePlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial( { map: textureLoader.load(require('file-loader!./scene.jpg').default) } )
);
scenePlane.position.set(0, -0.5, -5);
scene.add(scenePlane);

const cameraPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial( { map: textureLoader.load(require('file-loader!./camera.jpg').default) } )
);
cameraPlane.position.set(0, 0, -5);
camera.add(cameraPlane);

const light = new THREE.DirectionalLight("white", 0.5);
light.position.set(0, 2, 0);
light.lookAt(0, 0, 0);
scene.add(light);
const light2 = new THREE.AmbientLight("white", 0.5);
scene.add(light2);

const light3 = new THREE.DirectionalLight("white", 0.1);
light3.position.set(-1, -1, -1);
light3.lookAt(0, 0, 0);
scene.add(light3);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

scene.background = camera.backgroundTexture;

faceTracker.onNewAnchor.bind(anchor => { camera.poseAnchorOrigin = anchor });

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
