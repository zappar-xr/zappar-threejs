import * as THREE from "three";
import * as ZapparThree from "../../src";
import { CameraTexture } from "../../src/cameraTexture";

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
ZapparThree.glContextSet(renderer.getContext());
const backgroundTexture = new CameraTexture();
const camera = new ZapparThree.Camera({ backgroundTexture });

const scene = new THREE.Scene();
scene.background = camera.backgroundTexture;

ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

function render() {
  requestAnimationFrame(render);
  camera.updateFrame(renderer);

  renderer.render(scene, camera);
}

requestAnimationFrame(render);
