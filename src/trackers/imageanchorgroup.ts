import { ImageTracker, ImageAnchor } from "@zappar/zappar";
import { THREE } from "../three";
import { Camera, CameraMirrorMode } from "../camera";

/**
 * A THREE.Group that attaches content to a known image as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class ImageAnchorGroup extends THREE.Group {
  /**
   * @ignore
   */
  public isReady = false;

  public currentAnchor: ImageAnchor | undefined;

  /**
   * Constructs a new ImageAnchorGroup.
   * @param camera - A ZapparThree.Camera.
   * @param imageTracker - The image tracker which will be used.
   * @param anchorId - Specify this to limit the group to tracking an anchor with the provided ID.
   */
  public constructor(private camera: Camera, public readonly imageTracker: ImageTracker, public anchorId?: string) {
    super();

    // We'll be updating this Group's matrix ourselves from the Zappar library
    this.matrixAutoUpdate = false;
  }

  public updateMatrixWorld(force?: boolean): void {
    if (!this.currentAnchor || !this.imageTracker.visible.has(this.currentAnchor)) {
      // No current anchor, or current anchor isn't visible
      if (this.anchorId) {
        this.currentAnchor = this.imageTracker.anchors.get(this.anchorId);
      } else {
        this.currentAnchor = this.imageTracker.visible.values().next().value;
      }
    }
    if (this.currentAnchor) {
      this.matrix.fromArray(this.currentAnchor.pose(this.camera.rawPose, this.camera.currentMirrorMode === CameraMirrorMode.Poses));
      this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    super.updateMatrixWorld(force);
  }
}
