import { THREE }  from "./three";
import { FaceMesh, FaceAnchor } from "@zappar/zappar";
import { FaceAnchorGroup } from "./faceanchorgroup";
import { FaceMeshLoader } from "./facemeshloader";

let faceMeshSingleton: FaceMesh | undefined;

export class FaceBufferGeometry extends THREE.BufferGeometry {


    private _faceMesh: FaceMesh;
    private _hasSetIndices = false;
    private _hasSetUVs = false;

    private _vertices: Float32Array | undefined;
    private _verticesAttribute: THREE.BufferAttribute | undefined;

    private _normals: Float32Array | undefined;
    private _normalsAttribute: THREE.BufferAttribute | undefined;
    private _calculateNormals = true;

    constructor(faceMesh?: FaceMesh) {
        super();

        if (!faceMesh) {
            if (!faceMeshSingleton) {
                faceMeshSingleton = (new FaceMeshLoader()).load();
            }
            faceMesh = faceMeshSingleton;
        }
        this._faceMesh = faceMesh;
    }

    private _updateIndices() {
        if (this._hasSetIndices) return;
        if (this._faceMesh.indices.length === 0) return;
        this.setIndex(new THREE.Uint16BufferAttribute(this._faceMesh.indices, 1));
        this._hasSetIndices = true;
    }

    private _updateUVs() {
        if (this._hasSetUVs) return;
        if (this._faceMesh.uvs.length === 0) return;
        this.setAttribute("uv", new THREE.BufferAttribute(this._faceMesh.uvs, 2));
        this._hasSetUVs = true;
    }

    public get calculateNormals(): boolean {
        return this._calculateNormals;
    }

    public set calculateNormals(b: boolean) {
        this._calculateNormals = b;
        if (!this._calculateNormals) {
            if(typeof (this as any).removeAttribute === "function"){
                (this as any).removeAttribute("normal");
            }
            delete this._normals;
        }
    }

    updateFromFaceAnchorGroup(f: FaceAnchorGroup) : void {
        if (this._faceMesh.vertices.length === 0) return;
        if (!f.currentAnchor) return;
        this.updateFromFaceAnchor(f.currentAnchor);
    }

    updateFromFaceAnchor(f: FaceAnchor) : void {
        this.updateFromIdentityExpression(f.identity, f.expression);
    }

    updateFromIdentityExpression(identity: Float32Array, expression: Float32Array) : void {
        if (this._faceMesh.vertices.length === 0) return;
        this._updateIndices();
        this._updateUVs();
        this._faceMesh.updateFromIdentityExpression(identity, expression);
        if (!this._vertices) {
            this._vertices = new Float32Array(this._faceMesh.vertices.length);
            this._verticesAttribute = new THREE.BufferAttribute(this._vertices, 3);
            this.setAttribute("position", this._verticesAttribute);
        }
        this._vertices.set(this._faceMesh.vertices);
        if (this._verticesAttribute) this._verticesAttribute.needsUpdate = true;

        this.computeBoundingSphere();

        if (!this.calculateNormals) return;

        if (!this._normals) {
            this._normals = new Float32Array(this._faceMesh.normals.length);
            this._normalsAttribute = new THREE.BufferAttribute(this._normals, 3);
            this.setAttribute("normal", this._normalsAttribute);
        }
        this._normals.set(this._faceMesh.normals);
        if (this._normalsAttribute) this._normalsAttribute.needsUpdate = true;
    }
}
