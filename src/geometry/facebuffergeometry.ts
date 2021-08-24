/* eslint-disable no-underscore-dangle */
import { FaceMesh, FaceAnchor } from "@zappar/zappar";
import { THREE } from "../three";
import { FaceAnchorGroup } from "../trackers/faceanchorgroup";
import { FaceMeshLoader } from "../loaders/facemeshloader";

let faceMeshSingleton: FaceMesh | undefined;

/**
 * A THREE.BufferGeometry that fits to the user's face and deforms as the user's expression changes.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class FaceBufferGeometry extends THREE.BufferGeometry {
  private _faceMesh: FaceMesh;

  private hasSetIndices = false;

  private hasSetUVs = false;

  private vertices: Float32Array | undefined;

  private verticesAttribute: THREE.BufferAttribute | undefined;

  private normals: Float32Array | undefined;

  private normalsAttribute: THREE.BufferAttribute | undefined;

  private recalculateNormals = true;

  /**
   * Constructs a new FaceBufferGeometry.
   * @param faceMesh - The face mesh which will be used. If not specified, the default face mesh will be loaded.
   */
  public constructor(faceMesh?: FaceMesh) {
    super();

    this.setIndex([]);
    this.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
    this.setAttribute("normal", new THREE.Float32BufferAttribute([], 3));
    this.setAttribute("uv", new THREE.Float32BufferAttribute([], 2));

    if (!faceMesh) {
      if (!faceMeshSingleton) {
        faceMeshSingleton = new FaceMeshLoader().load();
      }
      // eslint-disable-next-line no-param-reassign
      faceMesh = faceMeshSingleton;
    }
    this._faceMesh = faceMesh;
  }

  private _updateIndices() {
    if (this.hasSetIndices) return;
    if (this._faceMesh.indices.length === 0) return;
    this.setIndex(new THREE.Uint16BufferAttribute(this._faceMesh.indices, 1));
    this.hasSetIndices = true;
  }

  private _updateUVs() {
    if (this.hasSetUVs) return;
    if (this._faceMesh.uvs.length === 0) return;
    this.setAttribute("uv", new THREE.BufferAttribute(this._faceMesh.uvs, 2));
    this.hasSetUVs = true;
  }

  /**
   * @ignore
   */
  public get calculateNormals(): boolean {
    return this.recalculateNormals;
  }

  /**
   * @ignore
   */
  public set calculateNormals(b: boolean) {
    this.recalculateNormals = b;
    if (!this.recalculateNormals) {
      if (typeof (this as any).removeAttribute === "function") {
        (this as any).removeAttribute("normal");
      }
      delete this.normals;
    }
  }

  /**
   * Updates the geometry to the most recent identity and expression output from a face anchor group.
   * @param f - The face anchor group which will be used to update the geometry.
   */
  public updateFromFaceAnchorGroup(f: FaceAnchorGroup): void {
    if (this._faceMesh.vertices.length === 0) return;
    if (!f.currentAnchor) return;
    this.updateFromFaceAnchor(f.currentAnchor);
  }

  /**
   * Updates the geometry to the most recent identity and expression output from a face anchor.
   * @param f - The face anchor which will be used to update the geometry.
   */
  public updateFromFaceAnchor(f: FaceAnchor): void {
    this.updateFromIdentityExpression(f.identity, f.expression);
  }

  /**
   * Updates the geometry to the provided identity and expression coefficients.
   * @param identity  - The identity coefficients.
   * @param expression - The expression coefficients.
   */
  public updateFromIdentityExpression(identity: Float32Array, expression: Float32Array): void {
    if (this._faceMesh.vertices.length === 0) return;
    this._updateIndices();
    this._updateUVs();
    this._faceMesh.updateFromIdentityExpression(identity, expression);
    if (!this.vertices) {
      this.vertices = new Float32Array(this._faceMesh.vertices.length);
      this.verticesAttribute = new THREE.BufferAttribute(this.vertices, 3);
      this.setAttribute("position", this.verticesAttribute);
    }
    this.vertices.set(this._faceMesh.vertices);
    if (this.verticesAttribute) this.verticesAttribute.needsUpdate = true;

    this.computeBoundingSphere();

    if (!this.calculateNormals) return;

    if (!this.normals) {
      this.normals = new Float32Array(this._faceMesh.normals.length);
      this.normalsAttribute = new THREE.BufferAttribute(this.normals, 3);
      this.setAttribute("normal", this.normalsAttribute);
    }
    this.normals.set(this._faceMesh.normals);
    if (this.normalsAttribute) this.normalsAttribute.needsUpdate = true;
  }
}
