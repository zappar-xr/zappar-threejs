/* eslint-disable no-underscore-dangle */
import { ImageTarget } from "@zappar/zappar/lib/imagetracker";
import { THREE } from "../three";

/**
 * A THREE.BufferGeometry that fits to the target image.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class TargetImagePreviewBufferGeometry extends THREE.BufferGeometry {
  private hasSetIndices = false;

  private hasSetUVs = false;

  private vertices: Float32Array | undefined;

  private recalculateNormals = true;

  /**
   * Constructs a new TargetImagePreviewBufferGeometry.
   * @param imageTarget - The image target which will be used.
   */
  public constructor(private imageTarget: ImageTarget) {
    super();

    if (this.imageTarget.preview.vertices.length === 0) {
      throw new Error("No vertices found in the image target.");
    }

    const vertexCount = this.imageTarget.preview.vertices.length / 3;

    this.vertices = new Float32Array(vertexCount * 3);
    this.vertices.set(this.imageTarget.preview.vertices);
    this.setAttribute("position", new THREE.BufferAttribute(this.vertices, 3));
    this.setAttribute("normal", new THREE.Float32BufferAttribute(vertexCount * 3, 3));

    this._updateUVs();
    this._updateIndices();

    this.computeBoundingSphere();
    this.computeVertexNormals();

    this.attributes.position.needsUpdate = true;
    this.attributes.normal.needsUpdate = true;
    if (this.attributes.uv) this.attributes.uv.needsUpdate = true;
  }

  /**
   * @ignore
   */
  private _updateIndices() {
    if (this.hasSetIndices) return;
    if (this.imageTarget?.preview.indices.length > 0) {
      this.setIndex(new THREE.Uint16BufferAttribute(this.imageTarget.preview.indices, 1));
      this.hasSetIndices = true;
    }
  }

  /**
   * @ignore
   */
  private _updateUVs() {
    if (this.hasSetUVs) return;
    if (this.imageTarget.preview.uvs.length > 0) {
      this.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(this.imageTarget.preview.uvs), 2));
      this.hasSetUVs = true;
    }
  }

  /**
   * @ignore
   */
  public get calculateNormals(): boolean {
    return this.recalculateNormals;
  }
}
