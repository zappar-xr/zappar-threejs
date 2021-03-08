import * as Zappar from "@zappar/zappar";
import { Event } from "@zappar/zappar/lib/event";

let defaultPipeline : Zappar.Pipeline | undefined;

export const onFrameUpdate = new Event();

export function getDefaultPipeline() : Zappar.Pipeline {
    if (!defaultPipeline) {
        defaultPipeline = new Zappar.Pipeline();
        defaultPipeline.onFrameUpdate.bind(() => onFrameUpdate.emit());
    }
    return defaultPipeline;
}

export class ImageTracker extends Zappar.ImageTracker {
    constructor(targetFile?: string | ArrayBuffer, pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline(), targetFile);
    }
}

export class BarcodeFinder extends Zappar.BarcodeFinder {
    constructor(pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline());
    }
}

export class FaceTracker extends Zappar.FaceTracker {
    constructor(pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline());
    }
}

export class InstantWorldTracker extends Zappar.InstantWorldTracker {
    constructor(pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline());
    }
}

export class CameraSource extends Zappar.CameraSource {
    constructor(deviceId: string, pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline(), deviceId);
    }
}

export class HTMLElementSource extends Zappar.HTMLElementSource {
    constructor(elm: HTMLVideoElement | HTMLImageElement, pipeline?: Zappar.Pipeline) {
        super(pipeline || getDefaultPipeline(), elm);
    }
}

export function glContextSet(gl: WebGLRenderingContext) : void {
    getDefaultPipeline().glContextSet(gl);
}

export function glContextLost() : void {
    getDefaultPipeline().glContextLost();
}