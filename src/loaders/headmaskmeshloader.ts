/* eslint-disable class-methods-use-this */
import { THREE } from "../three";
import { HeadMaskMesh } from "../mesh/headmaskmesh";

/**
 * Loader for HeadMaskMesh objects.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class HeadMaskMeshLoader extends THREE.Loader {
  /**
   * Loads a HeadMaskMesh.
   * @param onLoad - Callback which returns the HeadMaskMesh once it's loaded.
   * @param onError - Callback which is called if there's an error loading the mesh.
   * @returns The HeadMaskMesh.
   */
  public load(onLoad?: () => void, onProgress?: () => void, onError?: () => void): HeadMaskMesh {
    return new HeadMaskMesh(onLoad, onError);
  }

  /**
   * @ignore
   */
  public parse(): void {}
}
