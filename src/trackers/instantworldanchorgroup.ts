import { InstantWorldTracker } from "@zappar/zappar";
import { InstantWorldTrackerTransformOrigin } from "@zappar/zappar/lib/instantworldtracker";
import { THREE } from "../three";
import { Camera, CameraMirrorMode } from "../camera";

/**
 * A THREE.Group which attaches content to a point on a surface in front of the user as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/instant-world-tracking/
 */
export class InstantWorldAnchorGroup extends THREE.Group {
  /**
   * Constructs a new InstantWorldAnchorGroup.
   * @param camera - A ZapparThree.Camera.
   * @param instantTracker - The instant world tracker which will be used.
   */
  public constructor(private camera: Camera, public readonly instantTracker: InstantWorldTracker) {
    super();

    // We'll be updating this Group's matrix ourselves from the Zappar library
    this.matrixAutoUpdate = false;
  }

  /**
   * Sets the point in the user's environment that the anchor tracks from.
   *
   * The parameters passed in to this function correspond to the X, Y and Z coordinates (in camera space) of the point to track.
   * Choosing a position with X and Y coordinates of zero, and a negative Z coordinate,
   * will select a point on a surface directly in front of the center of the screen.
   *
   * @param orientation -  The orientation of the point in space.
   */
  public setAnchorPoseFromCameraOffset(x: number, y: number, z: number, orientation?: InstantWorldTrackerTransformOrigin): void {
    this.instantTracker.setAnchorPoseFromCameraOffset(x, y, z, orientation);
  }

  public updateMatrixWorld(force?: boolean): void {
    this.matrix.fromArray(this.instantTracker.anchor.pose(this.camera.rawPose, this.camera.currentMirrorMode === CameraMirrorMode.Poses));
    this.matrix.decompose(this.position, this.quaternion, this.scale);
    super.updateMatrixWorld(force);
  }
}
