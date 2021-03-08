import * as ZapparThree from "../../lib";
import * as THREE from "three";

ZapparThree.setLogLevel(ZapparThree.LogLevel.LOG_LEVEL_VERBOSE);

if (ZapparThree.browserIncompatible()) {
    ZapparThree.browserIncompatibleUI();
    throw new Error("Browser incompatible");
}

const canvasHolder = document.querySelector("#canvas-holder") || document.createElement("div");

const renderer = new THREE.WebGLRenderer();
canvasHolder.appendChild(renderer.domElement);

renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
window.addEventListener("resize", () => {
    renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
})


ZapparThree.glContextSet(renderer.getContext());

let camera = new ZapparThree.Camera();


let imgUrl = require("file-loader!./face.png").default;
let img = document.createElement("img");
img.src = imgUrl;

img.onload = function() {
    let source = new ZapparThree.HTMLElementSource(img);
    source.start();
    frame();
}

const scene = new THREE.Scene();
scene.add(camera);

scene.background = camera.backgroundTexture;

let faceTracker = new ZapparThree.FaceTracker();
faceTracker.loadDefaultModel();

let trackerGroup = new ZapparThree.FaceAnchorGroup(camera, faceTracker);
scene.add(trackerGroup);

let textureLoader = new THREE.TextureLoader();

const targetPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 0.25),
    new THREE.MeshBasicMaterial( { map: textureLoader.load(require('file-loader!./target.jpg').default) } )
);
trackerGroup.add(targetPlane);

function frame() {
    camera.updateFrame(renderer);
    renderer.render(scene, camera);
    if (faceTracker.anchors.size >= 1) {
        console.log(`Found ${faceTracker.anchors.size} face(s)`);
        return;
    }
    requestAnimationFrame(frame);
}