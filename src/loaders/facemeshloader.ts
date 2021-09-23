/* eslint-disable class-methods-use-this */
import { FaceMesh } from "@zappar/zappar";
import { THREE } from "../three";

/**
 * The features which may be filled with polygons.
 * @property fillMouth - If true, fills this face feature with polygons.
 * @property fillEyeLeft - If true, fills this face feature with polygons.
 * @property fillEyeRight - If true, fills this face feature with polygons.
 * @property fillNeck - If true, fills this face feature with polygons.
 */
export interface FaceMeshLoaderOptions {
  customModel?: string;
  fillMouth?: boolean;
  fillEyeLeft?: boolean;
  fillEyeRight?: boolean;
  fillNeck?: boolean;
}

/**
 * Loader for adaptive face mesh data.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class FaceMeshLoader extends THREE.Loader {
  /**
   * Loads the data for a face mesh.
   * @param options - A URL or ArrayBuffer of the source mesh data or defines if some face features should be filled with polygons.
   * @param onLoad - Callback which returns the FaceMesh once it's loaded.
   * @param onError - Callback which is called if there's an error loading the mesh.
   * @returns The FaceMesh.
   */
  public load(
    options?: string | FaceMeshLoaderOptions,
    onLoad?: (i: FaceMesh) => void,
    onProgress?: () => void,
    onError?: (message?: unknown) => void
  ): FaceMesh {
    const trk = new FaceMesh();
    let p: Promise<void>;
    const itemFilename = `__zappar_threejs_face_mesh_${JSON.stringify(options || "default")}`;

    this.manager.itemStart(itemFilename);

    if (options) {
      if (typeof options === "string") p = trk.load(options);
      else if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
      else p = trk.loadDefaultFace(options.fillMouth, options.fillEyeLeft, options.fillEyeRight);
    } else {
      p = trk.loadDefaultFace();
    }

    p.then(() => {
      onLoad?.(trk);
      this.manager.itemEnd(itemFilename);
    }).catch((_) => {
      onError?.(_);
      this.manager.itemError(itemFilename);
      this.manager.itemEnd(itemFilename);
    });

    return trk;
  }

  /**
   * Loads the default face mesh.
   * @param options - Defines if some face features should be filled with polygons.
   * @param onLoad - Callback which returns the FaceMesh once it's loaded.
   * @param onError - Callback which is called if there's an error loading the mesh.
   * @returns The FaceMesh.
   */
  public loadFace(
    options?: FaceMeshLoaderOptions,
    onLoad?: (i: FaceMesh) => void,
    onProgress?: () => void,
    onError?: (message?: unknown) => void
  ): FaceMesh {
    const trk = new FaceMesh();
    let p: Promise<void>;
    const itemFilename = `__zappar_threejs_face_mesh_face_${JSON.stringify(options || "default")}`;
    if (options) {
      if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
      else p = trk.loadDefaultFace(options.fillMouth, options.fillEyeLeft, options.fillEyeRight);
    } else {
      p = trk.loadDefaultFace();
    }

    p.then(() => {
      onLoad?.(trk);
      this.manager.itemEnd(itemFilename);
    }).catch((_) => {
      onError?.(_);
      this.manager.itemError(itemFilename);
      this.manager.itemEnd(itemFilename);
    });

    return trk;
  }

  /**
   * Loads the full head simplified mesh which covers the whole of the user's head, including some neck.
   * It's ideal for drawing into the depth buffer in order to mask out the back of 3D models placed on the user's head.
   * @param options - Defines if some face features should be filled with polygons.
   * @param onLoad - Callback which returns the FaceMesh once it's loaded.
   * @param onError - Callback which is called if there's an error loading the mesh.
   * @returns The FaceMesh.
   */
  public loadFullHeadSimplified(
    options?: FaceMeshLoaderOptions,
    onLoad?: (i: FaceMesh) => void,
    onProgress?: () => void,
    onError?: (message?: unknown) => void
  ): FaceMesh {
    const trk = new FaceMesh();
    let p: Promise<void>;
    const itemFilename = `__zappar_threejs_face_mesh_full_head_${JSON.stringify(options || "default")}`;
    if (options) {
      if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
      else p = trk.loadDefaultFullHeadSimplified(options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
    } else {
      p = trk.loadDefaultFullHeadSimplified();
    }

    p.then(() => {
      onLoad?.(trk);
      this.manager.itemEnd(itemFilename);
    }).catch((_) => {
      onError?.(_);
      this.manager.itemError(itemFilename);
      this.manager.itemEnd(itemFilename);
    });

    return trk;
  }

  /**
   * @ignore
   */
  public parse(): void {}
}
