import { FaceTracker, FaceAnchor, FaceLandmarkName, FaceLandmark } from "@zappar/zappar";
import { mat4 } from "gl-matrix";
import { THREE } from "../three";
import { Camera, CameraMirrorMode } from "../camera";

/**
 * A THREE.Group which attaches content to a known point (landmark) on a face as it moves around in the camera view.
 * Landmarks will remain accurate, even as the user's expression changes.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class FaceLandmarkGroup extends THREE.Group {
  public currentAnchor: FaceAnchor | undefined;

  public landmark: FaceLandmark;

  private pose = mat4.create();

  /**
   * Constructs a new FaceLandmarkGroup.
   * @param camera - A ZapparThree.Camera.
   * @param faceTracker - The face tracker which will be used.
   * @param landmark - The landmark to which the group will be anchored.
   */
  public constructor(private camera: Camera, public readonly faceTracker: FaceTracker, landmark: FaceLandmarkName) {
    super();
    this.landmark = new FaceLandmark(landmark);
    // We'll be updating this Group's matrix ourselves from the Zappar library
    this.matrixAutoUpdate = false;
  }

  public updateMatrixWorld(force?: boolean): void {
    if (!this.currentAnchor || !this.faceTracker.visible.has(this.currentAnchor)) {
      // No current anchor, or current anchor isn't visible
      this.currentAnchor = this.faceTracker.visible.values().next().value;
    }
    if (this.currentAnchor) {
      this.landmark.updateFromFaceAnchor(this.currentAnchor, this.camera.currentMirrorMode === CameraMirrorMode.Poses);
      mat4.multiply(
        this.pose,
        this.currentAnchor.pose(this.camera.rawPose, this.camera.currentMirrorMode === CameraMirrorMode.Poses) as mat4,
        this.landmark.pose as mat4
      );
      this.matrix.fromArray(this.pose);
      this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    super.updateMatrixWorld(force);
  }

  /**
   * Destroys the face landmark.
   */
  public dispose(): void {
    this.landmark.destroy();
  }
}
