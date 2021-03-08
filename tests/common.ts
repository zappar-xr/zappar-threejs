import * as THREE from "three";
import * as ZapparThree from "../src";

ZapparThree.setLogLevel(ZapparThree.LogLevel.LOG_LEVEL_VERBOSE);

if (ZapparThree.browserIncompatible()) {
    ZapparThree.browserIncompatibleUI();
    throw new Error("Browser incompatible");
}

const canvasHolder = document.querySelector("#canvas-holder") || document.createElement("div");

export const renderer = new THREE.WebGLRenderer();
canvasHolder.appendChild(renderer.domElement);

renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
window.addEventListener("resize", () => {
    renderer.setSize(canvasHolder.clientWidth, canvasHolder.clientHeight);
})

ZapparThree.glContextSet(renderer.getContext());

export const camera = new ZapparThree.Camera();

ZapparThree.permissionRequestUI().then(granted => {
    if (granted) camera.start();
    else ZapparThree.permissionDeniedUI();
})

const cameraSelect = document.querySelector("#cameraSelect") as HTMLSelectElement || document.createElement("select");
cameraSelect.addEventListener("change", () => camera.start(cameraSelect.value === "userFacing"));

const mirrorSelect = document.querySelector("#mirrorSelect") as HTMLSelectElement || document.createElement("select");
mirrorSelect.addEventListener("change", () => {
    switch(mirrorSelect.value) {
        case "css":
            camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
            camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
            break;
        case "poses":
            camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
            camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
            break;
        case "nomirror":
            camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
            camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
            break;
    }
});

const poseSelect = document.querySelector("#poseSelect") as HTMLSelectElement || document.createElement("select");
poseSelect.addEventListener("change", () => {
    switch(poseSelect.value) {
        case "default":
            camera.poseMode = ZapparThree.CameraPoseMode.Default;
            break;
        case "attitude":
            camera.poseMode = ZapparThree.CameraPoseMode.Attitude;
            break;
        case "anchor":
            camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;
            break;
    }
});
