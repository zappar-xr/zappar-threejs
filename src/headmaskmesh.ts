import * as THREE from "three";
import * as Zappar from "@zappar/zappar";
import { FaceBufferGeometry } from "./facebuffergeometry";
import { MeshBasicMaterial } from "three";
import { FaceAnchorGroup } from "./faceanchorgroup";

export class HeadMaskMesh extends THREE.Mesh {

    private _faceMesh = new Zappar.FaceMesh();
    private _faceBufferGeometry = new FaceBufferGeometry(this._faceMesh);

    constructor(public onLoad?: () => void, public onError?: () => void) {
        super();
        this.geometry = this._faceBufferGeometry;
        this.material = new MeshBasicMaterial({
            colorWrite: false
        });
        this._faceMesh.loadDefaultFullHeadSimplified(true, true, true, true).then(() => this.onLoad?.()).catch(() => this.onError?.())
        this.renderOrder = Number.MIN_SAFE_INTEGER;
    }

    updateFromFaceAnchorGroup(f: FaceAnchorGroup) : void {
        this._faceBufferGeometry.updateFromFaceAnchorGroup(f);
    }

    updateFromFaceAnchor(f: Zappar.FaceAnchor) : void {
        this._faceBufferGeometry.updateFromFaceAnchor(f);
    }

    updateFromIdentityExpression(identity: Float32Array, expression: Float32Array) : void  {
        this._faceBufferGeometry.updateFromIdentityExpression(identity, expression);
    }

    public dispose() : void {
        this._faceMesh.destroy();
        this._faceBufferGeometry.dispose();
    }

}
