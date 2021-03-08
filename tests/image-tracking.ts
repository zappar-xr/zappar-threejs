/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import { ImageTrackerLoader, ImageAnchorGroup, CameraPoseMode } from "../src";
import { camera, renderer } from "./common";
import { LoadingManager, LoaderStyle } from '../src/loadingmanager';




const Manager = new LoadingManager({
    style:{
        container:     { backgroundColor: 'rgba(0, 0, 0, 0.5)', transition: 'opacity 1s', transitionTimingFunction: "ease-in-out" },
        title:         { color: 'red', fontSize: "30", fontWeight: 'bold', webkitTextStroke: '1px white' },
        progressValue: { backgroundColor: "yellow" },
        progress:      { backgroundColor: "red" },
        inner:         { transform: "rotate(10deg)", }
    }, onLoad: ()=> console.log('Finished Loading!')
});


const scene = new THREE.Scene();
scene.add(camera);
const targetFile = require('file-loader!./restflyer.jpg.zpt').default;

const textureLoader = new THREE.TextureLoader(Manager);

const imageTracker = new ImageTrackerLoader(Manager).load(targetFile);
const trackerGroup = new ImageAnchorGroup(camera, imageTracker);
scene.add(trackerGroup);

const targetPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(require('file-loader!./target.jpg').default) })
);

trackerGroup.add(targetPlane);

const scenePlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(require('file-loader!./scene.jpg').default) })
);
scenePlane.position.set(0, -0.5, -5);
scene.add(scenePlane);

const cameraPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(require('file-loader!./camera.jpg').default) })
);


cameraPlane.position.set(0, 0, -5);
camera.add(cameraPlane);

imageTracker.onNewAnchor.bind(anchor => { camera.poseAnchorOrigin = anchor });

imageTracker.onVisible.bind(() => {
    console.log("VISIBLE!");
    trackerGroup.visible = true;
});

imageTracker.onNotVisible.bind(() => {
    console.log("NOTVISIBLE!");
    trackerGroup.visible = false;
})

scene.background = camera.backgroundTexture;

function animate() {
    requestAnimationFrame(animate);
    camera.updateFrame(renderer);

    if (camera.poseMode === CameraPoseMode.AnchorOrigin) {
        scenePlane.position.set(0, -0.5, 0);
    } else {
        scenePlane.position.set(0, -0.5, -5);
    }

    renderer.render(scene, camera);
}
animate();
