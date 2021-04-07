import { THREE }  from "./three";
import { InstantWorldTracker } from "@zappar/zappar";
import { Camera, CameraMirrorMode } from "./camera";
import { InstantWorldTrackerTransformOrigin } from "@zappar/zappar/lib/instantworldtracker";

export class InstantWorldAnchorGroup extends THREE.Group {

    constructor(private _camera: Camera, public readonly instantTracker: InstantWorldTracker) {
        super();

        // We'll be updating this Group's matrix ourselves from the Zappar library
        this.matrixAutoUpdate = false;
    }

    setAnchorPoseFromCameraOffset(x: number, y: number, z: number, orientation?: InstantWorldTrackerTransformOrigin) : void {
        this.instantTracker.setAnchorPoseFromCameraOffset(x, y, z, orientation);
    }

    updateMatrixWorld(force?: boolean) : void {
        this.matrix.fromArray(this.instantTracker.anchor.pose(this._camera.rawPose, this._camera.currentMirrorMode === CameraMirrorMode.Poses));
        super.updateMatrixWorld(force);
    }
}
