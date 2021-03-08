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

function frame() {
    camera.updateFrame(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
}