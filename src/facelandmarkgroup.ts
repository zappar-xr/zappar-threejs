import * as THREE from "three";
import { FaceTracker, FaceAnchor, FaceLandmarkName, FaceLandmark } from "@zappar/zappar";
import { Camera, CameraMirrorMode } from "./camera";
import { mat4 } from "gl-matrix";

export class FaceLandmarkGroup extends THREE.Group {

    public currentAnchor: FaceAnchor | undefined;
    public landmark: FaceLandmark;
    private _pose = mat4.create();

    constructor(private _camera: Camera, public readonly faceTracker: FaceTracker, landmark: FaceLandmarkName) {
        super();
        this.landmark = new FaceLandmark(landmark);
        // We'll be updating this Group's matrix ourselves from the Zappar library
        this.matrixAutoUpdate = false;
    }

    updateMatrixWorld(force?: boolean) : void {
        if (!this.currentAnchor || !this.faceTracker.visible.has(this.currentAnchor)) {
            // No current anchor, or current anchor isn't visible
            this.currentAnchor = this.faceTracker.visible.values().next().value;
        }
        if (this.currentAnchor) {
            this.landmark.updateFromFaceAnchor(this.currentAnchor, this._camera.currentMirrorMode === CameraMirrorMode.Poses);
            mat4.multiply(this._pose, this.currentAnchor.pose(this._camera.rawPose, this._camera.currentMirrorMode === CameraMirrorMode.Poses) as mat4, this.landmark.pose as mat4);
            this.matrix.fromArray(this._pose);
        }
        super.updateMatrixWorld(force);
    }

    public dispose() : void {
        this.landmark.destroy();
    }
}
