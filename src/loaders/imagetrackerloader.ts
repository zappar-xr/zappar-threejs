/* eslint-disable class-methods-use-this */
import { THREE } from "../three";
import { ImageTracker } from "../defaultpipeline";

/**
 * Loader for image trackers.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class ImageTrackerLoader extends THREE.Loader {
  /**
   * Loads an image tracker.
   * @param zpt - A URL to, or ArrayBuffer of, an image target file.
   * @param onLoad - Callback which returns the imageTracker once it's loaded.
   * @param onError - Callback which is called if there's an error loading the target file.
   * @returns The ImageTracker.
   * @see https://docs.zap.works/universal-ar/zapworks-cli/
   */
  public load(zpt: string, onLoad?: (i: ImageTracker) => void, onProgress?: () => void, onError?: (message?: unknown) => void): ImageTracker {
    const trk = new ImageTracker();
    trk
      .loadTarget(zpt)
      .then(() => {
        onLoad?.(trk);
        this.manager.itemEnd(zpt);
      })
      .catch((_) => {
        onError?.(_);
        this.manager.itemError(zpt);
        this.manager.itemEnd(zpt);
      });

    return trk;
  }

  /**
   * @ignore
   */
  public parse(): void {}
}
