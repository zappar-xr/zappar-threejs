import { THREE }  from "./three";
import { FaceTracker, FaceAnchor } from "@zappar/zappar";
import { Camera, CameraMirrorMode } from "./camera";

export class FaceAnchorGroup extends THREE.Group {
    public isReady = false;

    public currentAnchor: FaceAnchor | undefined;

    constructor(private _camera: Camera, public readonly faceTracker: FaceTracker, public anchorId?: string) {
        super();
        // We'll be updating this Group's matrix ourselves from the Zappar library
        this.matrixAutoUpdate = false;
    }

    updateMatrixWorld(force?: boolean) : void {
        if (!this.currentAnchor || !this.faceTracker.visible.has(this.currentAnchor)) {
            // No current anchor, or current anchor isn't visible
            if (this.anchorId) {
                this.currentAnchor = this.faceTracker.anchors.get(this.anchorId);
            } else {
                this.currentAnchor = this.faceTracker.visible.values().next().value;
            }
        }
        if (this.currentAnchor) {
            this.matrix.fromArray(this.currentAnchor.pose(this._camera.rawPose, this._camera.currentMirrorMode === CameraMirrorMode.Poses));
        }
        super.updateMatrixWorld(force);
    }
}
