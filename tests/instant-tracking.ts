/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import { InstantWorldAnchorGroup, CameraPoseMode, InstantWorldTracker} from "../src";
import { camera, renderer } from "./common";

const scene = new THREE.Scene();
scene.add(camera);
const textureLoader = new THREE.TextureLoader();

const trackerGroup = new InstantWorldAnchorGroup(camera, new InstantWorldTracker());
scene.add(trackerGroup);
camera.poseAnchorOrigin = trackerGroup.instantTracker.anchor;

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

scene.background = camera.backgroundTexture;

let hasPlaced = false;
renderer.domElement.addEventListener("click", () => { hasPlaced = true });

function animate() {
    requestAnimationFrame( animate );
    if (!hasPlaced) {
        trackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
    }
    camera.updateFrame(renderer);
    
    if (camera.poseMode === CameraPoseMode.AnchorOrigin) {
        scenePlane.position.set(0, -0.5, 0);
    } else {
        scenePlane.position.set(0, -0.5, -5);
    }

    renderer.render(scene, camera);
}
animate();
