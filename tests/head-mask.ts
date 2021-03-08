/* eslint-disable @typescript-eslint/no-var-requires */
import * as THREE from "three";
import * as ZapparThree from "../src";
import { DefaultLoaderUI, FaceAnchorGroup } from "../src";
import { renderer, camera } from "./common";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const faceTracker = new ZapparThree.FaceTrackerLoader().load();
const headMaskMesh = new ZapparThree.HeadMaskMeshLoader().load();
const loader = new DefaultLoaderUI({    style:{
        container:     { backgroundColor: 'rgba(0, 0, 0, 0.5)', transition: 'opacity 1s', transitionTimingFunction: "ease-in-out" },
        title:         { color: 'red', fontSize: "30", fontWeight: 'bold', webkitTextStroke: '1px white' },
        progressValue: { backgroundColor: "yellow" },
        progress:      { backgroundColor: "red" },
        inner:         { transform: "rotate(10deg)", }
    }, onLoad: ()=> console.log('Finished Loading!')});

const scene = new THREE.Scene();
scene.add(camera);

const trackerGroup = new FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

trackerGroup.add(headMaskMesh);

const textureLoader = new THREE.TextureLoader();

const gltfUrl = require("file-loader!./masked_helmet.glb").default;
const gltfLoader = new GLTFLoader();
gltfLoader.load(gltfUrl, (gltf) => {

    // Position the loaded content to overlay user's face
    gltf.scene.position.set(0.3, -1.3, 0);
    gltf.scene.scale.set(1.1, 1.1, 1.1);

    // One of the helmet's children is a 'mask' object that we want
    // to use to hide the elements of the helmet where the user's face
    // should appear. To achieve this, we loop through the meshes in the
    // model, and set the 'colorWrite' material property for the mask to false
    // This, in combination with its render order in the mesh, should achieve
    // the effect we desire
    for (const child of gltf.scene.getObjectByName('Helmet_Mask')?.children as THREE.Mesh[]) {
        (child.material as THREE.Material).visible = false;
    }

    // Add the scene to the tracker group
    trackerGroup.add(gltf.scene);

}, undefined, () => {
    console.log("An error ocurred loading the GLTF model");
});


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
    headMaskMesh.updateFromFaceAnchorGroup(trackerGroup);

    if (camera.poseMode === ZapparThree.CameraPoseMode.AnchorOrigin) {
        scenePlane.position.set(0, -0.5, 0);
    } else {
        scenePlane.position.set(0, -0.5, -5);
    }
    renderer.render(scene, camera);
}
animate();
