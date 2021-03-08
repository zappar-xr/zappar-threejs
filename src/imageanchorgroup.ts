import * as THREE from "three";
import { ImageTracker, ImageAnchor } from "@zappar/zappar";
import { Camera, CameraMirrorMode } from "./camera";

export class ImageAnchorGroup extends THREE.Group {
    public isReady = false;

    public currentAnchor: ImageAnchor | undefined;

    constructor(private _camera: Camera, public readonly imageTracker: ImageTracker, public anchorId?: string) {
        super();

        // We'll be updating this Group's matrix ourselves from the Zappar library
        this.matrixAutoUpdate = false;
    }

    updateMatrixWorld(force?: boolean) : void {
        if (!this.currentAnchor || !this.imageTracker.visible.has(this.currentAnchor)) {
            // No current anchor, or current anchor isn't visible
            if (this.anchorId) {
                this.currentAnchor = this.imageTracker.anchors.get(this.anchorId);
            } else {
                this.currentAnchor = this.imageTracker.visible.values().next().value;
            }
        }
        if (this.currentAnchor) this.matrix.fromArray(this.currentAnchor.pose(this._camera.rawPose, this._camera.currentMirrorMode === CameraMirrorMode.Poses));
        super.updateMatrixWorld(force);
    }
}
