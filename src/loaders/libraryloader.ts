/* eslint-disable class-methods-use-this */
import { loadedPromise } from "..";
import { THREE } from "../three";

const itemFilename = "__zappar_threejs_library";

/**
 * Loader for library itself.
 * This library uses some additional resources (e.g web workers and WebAssembly) - this loader resolves once the library has fully loaded these resources.
 * If you're using the LoadingManager included in this library you don't need to explicitly use this yourself as one is automatically created.
 */
export class LibraryLoader extends THREE.Loader {
  /**
   * Resolves once the library is loaded and ready to process data.
   * @param onLoad - Callback which runs once the library is fully loaded.
   * @param onError - Callback which is called if there's an error loading library.
   */
  public load(onLoad?: () => void, onProgress?: () => void, onError?: () => void): void {
    this.manager.itemStart(itemFilename);
    loadedPromise()
      .then(() => {
        onLoad?.();
        this.manager.itemEnd(itemFilename);
      })
      .catch((err) => {
        onError?.();
        this.manager.itemError(itemFilename);
        this.manager.itemEnd(itemFilename);
      });
  }

  /**
   * @ignore
   */
  public parse(): void {}
}
