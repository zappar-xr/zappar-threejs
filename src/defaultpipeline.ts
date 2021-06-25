import * as Zappar from "@zappar/zappar";
import { Event } from "@zappar/zappar/lib/event";

let defaultPipeline: Zappar.Pipeline | undefined;

/**
 * Emitted when the frame is updated.
 */
export const onFrameUpdate = new Event();

/**
 * @returns - The default Pipeline used by the library. This function constructs a new Pipeline during its first invocation.
 */
export function getDefaultPipeline(): Zappar.Pipeline {
  if (!defaultPipeline) {
    defaultPipeline = new Zappar.Pipeline();
    defaultPipeline.onFrameUpdate.bind(() => onFrameUpdate.emit());
  }
  return defaultPipeline;
}

/**
 * Attaches content to a known image as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class ImageTracker extends Zappar.ImageTracker {
  /**
   * Constructs a new ImageTracker.
   * @param targetFile - The .zpt target file from the source image you'd like to track.
   * @param pipeline - The pipeline that this tracker will operate within.
   * @see https://docs.zap.works/universal-ar/zapworks-cli/
   */
  public constructor(targetFile?: string | ArrayBuffer, pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline(), targetFile);
  }
}

/**
 * Detects barcodes in the images from the camera.
 */
export class BarcodeFinder extends Zappar.BarcodeFinder {
  /**
   * Constructs a new BarcodeFinder.
   * @param pipeline - The pipeline that this tracker will operate within.
   */
  public constructor(pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline());
  }
}

/**
 * Attaches content to a face as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/face-tracking/
 */
export class FaceTracker extends Zappar.FaceTracker {
  /**
   * Constructs a new FaceTracker.
   * @param _pipeline - The pipeline that this tracker will operate within.
   */
  public constructor(pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline());
  }
}

/**
 * Attaches content to a point on a surface in front of the user as it moves around in the camera view.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/instant-world-tracking/
 */
export class InstantWorldTracker extends Zappar.InstantWorldTracker {
  /**
   * Constructs a new InstantWorldTracker.
   * @param _pipeline - The pipeline that this tracker will operate within.
   */
  public constructor(pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline());
  }
}

/**
 * Creates a source of frames from a device camera.
 * @see https://docs.zap.works/universal-ar/javascript/pipelines-and-camera-processing/
 */
export class CameraSource extends Zappar.CameraSource {
  /**
   * Constructs a new CameraSource.
   * @param _pipeline - The pipeline that this source will operate within.
   * @param deviceId - The camera device ID which will be used as the source.
   * @see https://docs.zap.works/universal-ar/javascript/pipelines-and-camera-processing/
   */
  public constructor(deviceId: string, pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline(), deviceId);
  }
}

/**
 * Creates a source of frames from a HTML <video> or <img> element.
 * @see https://docs.zap.works/universal-ar/javascript/pipelines-and-camera-processing/
 */
export class HTMLElementSource extends Zappar.HTMLElementSource {
  /**
   * Constructs a new HTMLElementSource.
   * @param element -  The HTML source element.
   * @param pipeline - The pipeline that this tracker will operate within.
   */
  public constructor(element: HTMLVideoElement | HTMLImageElement, pipeline?: Zappar.Pipeline) {
    super(pipeline || getDefaultPipeline(), element);
  }
}

/**
 * Sets the WebGL context used for the processing and upload of camera textures.
 *
 * This function affects the library's default Pipeline only. If you're using a custom Pipeline you should call `glContextSet(...)` on it yourself.
 *
 * @param gl - The WebGL context.
 */
export function glContextSet(gl: WebGLRenderingContext): void {
  getDefaultPipeline().glContextSet(gl);
}

/**
 * Informs the pipeline that the GL context is lost and should not be used.
 *
 * This function affects the library's default Pipeline only. If you're using a custom Pipeline you should call `glContextLost()` on it yourself.
 */
export function glContextLost(): void {
  getDefaultPipeline().glContextLost();
}
