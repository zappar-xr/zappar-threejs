/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// <!-- build-remove-start -->
import * as THREE from "three";
import * as ZapparThree from "../../../src";
// <!-- build-remove-end -->

import { renderer, camera, scene, targetPlane, setCameraSource, DynamicTimeWarping } from "./common";

setCameraSource("instant");

const instantTracker = new ZapparThree.InstantWorldTracker();

const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);
scene.add(instantTrackerGroup);

const div = document.createElement("div");
div.id = "divergence";
document.body.appendChild(div);
div.style.position = "absolute";
div.style.margin = "5%";
div.style.fontSize = "30px";
div.style.color = "white";

instantTrackerGroup.add(targetPlane);

let lastFrameNumber = -1;
const sequenceNframes = 82;
let placed = false;

const expectedPositions = [
  [0, 0, 0],
  [2.7755575615628914e-16, -5.098616233626659e-32, -5],
  [2.5493081168133294e-32, 1.3877787807814457e-16, -5],
  [1.3877787807814457e-16, -2.5493081168133294e-32, -5],
  [5.551115123125783e-16, 1.3877787807814457e-16, -5],
  [-1.147188681953357e-31, -6.245004513516506e-16, -5],
  [6.938893903907228e-16, -8.326672684688674e-16, -5],
  [-1.3877787807814457e-16, 2.5493081168133294e-32, -5],
  [-0.07315465807914734, -0.0648149773478508, -4.481046199798584],
  [-0.1079152449965477, -0.10199600458145142, -4.190606594085693],
  [-0.20676591992378235, -0.1848130226135254, -3.9214415550231934],
  [-0.18331322073936462, -0.276140421628952, -3.6840872764587402],
  [-0.1512204110622406, -0.34136858582496643, -3.639871120452881],
  [-0.04494917020201683, -0.35627251863479614, -3.7045059204101562],
  [0.11419010162353516, -0.290389746427536, -3.800117015838623],
  [0.3138386011123657, -0.20542559027671814, -3.9745805263519287],
  [0.43799763917922974, -0.14612802863121033, -4.0585832595825195],
  [0.5331807732582092, -0.08259475976228714, -4.214951038360596],
  [0.6409440636634827, 0.038727179169654846, -4.410844326019287],
  [0.6887714266777039, 0.12843482196331024, -4.521223068237305],
  [0.6665030121803284, 0.3091454803943634, -4.699882507324219],
  [0.5316368341445923, 0.4218069314956665, -4.8494873046875],
  [0.43345361948013306, 0.49188005924224854, -4.970870494842529],
  [0.2789938747882843, 0.5550458431243896, -5.103307247161865],
  [0.06795097887516022, 0.6206362247467041, -5.27578067779541],
  [-0.0381614975631237, 0.6309038996696472, -5.335268497467041],
  [-0.20007403194904327, 0.6115666627883911, -5.403157711029053],
  [-0.326590359210968, 0.5900570154190063, -5.416672229766846],
  [-0.47506654262542725, 0.5549622178077698, -5.411159992218018],
  [-0.5650548934936523, 0.5284743309020996, -5.396586894989014],
  [-0.6868678331375122, 0.46006494760513306, -5.337930679321289],
  [-0.7379018068313599, 0.3987787961959839, -5.259645462036133],
  [-0.7576534152030945, 0.33226197957992554, -5.134923458099365],
  [-0.7503934502601624, 0.2660394310951233, -4.985245227813721],
  [-0.7171227931976318, 0.23446573317050934, -4.873715877532959],
  [-0.6461877822875977, 0.1931307017803192, -4.688632488250732],
  [-0.5787392258644104, 0.14602439105510712, -4.511929988861084],
  [-0.5246667861938477, 0.09122402966022491, -4.360803127288818],
  [-0.49183160066604614, 0.032060060650110245, -4.236567497253418],
  [-0.46287715435028076, -0.03321532905101776, -4.1218342781066895],
  [-0.4368167817592621, -0.07986254245042801, -4.0720672607421875],
  [-0.3914324939250946, -0.13168969750404358, -4.012200355529785],
].map((pos) => new THREE.Vector3(...pos));

// @ts-ignore
const positions = [];

function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);

  if (!placed) {
    instantTracker.setAnchorPoseFromCameraOffset(0, 0, -5);
  }
  const frameNumber = camera.pipeline.frameNumber();

  if (lastFrameNumber !== frameNumber) {
    const sequenceFinished = frameNumber >= sequenceNframes;

    if (frameNumber > 10) {
      placed = true;
    }

    if (frameNumber % 2 === 0) {
      positions.push(instantTrackerGroup.position.clone());
      // @ts-ignore
      const distanceFunc = (vec1, vec2) => vec1.distanceTo(vec2);
      // @ts-ignore
      const dtw = new DynamicTimeWarping(expectedPositions, positions, distanceFunc);
      const dist = dtw.getDistance();
      div.innerHTML = dist.toString();
    }

    if (sequenceFinished) {
      // @ts-ignore
      // console.log(JSON.stringify(positions.map((position) => position.toArray()))); //
      console.log("sequence finished");
    }

    lastFrameNumber = frameNumber;
  }

  renderer.render(scene, camera);
}
animate();
