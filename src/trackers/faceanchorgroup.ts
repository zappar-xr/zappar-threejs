import { FaceTracker, FaceAnchor } from "@zappar/zappar";
import { THREE } from "../three";
import { Camera, CameraMirrorMode } from "../camera";

/**
 * A THREE.Group which attaches content to a face as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class FaceAnchorGroup extends THREE.Group {
  /**
   * @ignore
   */
  public isReady = false;

  /**
   * A point in 3D space (including orientation) in a fixed location relative to a tracked object or environment.
   */
  public currentAnchor: FaceAnchor | undefined;

  /**
   * Constructs a new FaceAnchorGroup.
   * @param camera - A ZapparThree.Camera.
   * @param faceTracker - The face tracker which will be used.
   * @param anchorId - Specify this to limit the group to tracking an anchor with the provided ID.
   */
  public constructor(private camera: Camera, public readonly faceTracker: FaceTracker, public anchorId?: string) {
    super();
    // We'll be updating this Group's matrix ourselves from the Zappar library
    this.matrixAutoUpdate = false;
  }

  public updateMatrixWorld(force?: boolean): void {
    if (!this.currentAnchor || !this.faceTracker.visible.has(this.currentAnchor)) {
      // No current anchor, or current anchor isn't visible
      if (this.anchorId) {
        this.currentAnchor = this.faceTracker.anchors.get(this.anchorId);
      } else {
        this.currentAnchor = this.faceTracker.visible.values().next().value;
      }
    }
    if (this.currentAnchor) {
      this.matrix.fromArray(this.currentAnchor.pose(this.camera.rawPose, this.camera.currentMirrorMode === CameraMirrorMode.Poses));
      this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    super.updateMatrixWorld(force);
  }
}
