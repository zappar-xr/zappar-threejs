import * as THREE from "three";
import { FaceMesh } from "@zappar/zappar";

export interface FaceMeshLoaderOptions {
    customModel?: string;
    fillMouth?: boolean;
    fillEyeLeft?: boolean;
    fillEyeRight?: boolean;
    fillNeck?: boolean;
}

export class FaceMeshLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager) {
        super(manager);
    }

    load(options?: string | FaceMeshLoaderOptions, onLoad?: (i: FaceMesh) => void, onProgress?: () => void, onError?: (message?: unknown) =>  void) : FaceMesh {
        const trk = new FaceMesh();
        let p : Promise<void>;
        if (options) {
            if (typeof options === "string") p = trk.load(options);
            else {
                if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
                else p = trk.loadDefaultFace(options.fillMouth, options.fillEyeLeft, options.fillEyeRight);
            }
        } else {
            p = trk.loadDefaultFace();
        }

        p.then(() => {
            onLoad?.(trk);
        }).catch(_ => {
            onError?.(_);
        });

        return trk;
    }

    loadFace(options?: FaceMeshLoaderOptions, onLoad?: (i: FaceMesh) => void, onProgress?: () => void, onError?: (message?: unknown) =>  void) : FaceMesh {
        const trk = new FaceMesh();
        let p : Promise<void>;
        if (options) {
            if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
            else p = trk.loadDefaultFace(options.fillMouth, options.fillEyeLeft, options.fillEyeRight);
        } else {
            p = trk.loadDefaultFace();
        }

        p.then(() => {
            onLoad?.(trk);
        }).catch(_ => {
            onError?.(_);
        });

        return trk;
    }

    loadFullHeadSimplified(options?: FaceMeshLoaderOptions, onLoad?: (i: FaceMesh) => void, onProgress?: () => void, onError?: (message?: unknown) =>  void) : FaceMesh {
        const trk = new FaceMesh();
        let p : Promise<void>;
        if (options) {
            if (options.customModel) p = trk.load(options.customModel, options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
            else p = trk.loadDefaultFullHeadSimplified(options.fillMouth, options.fillEyeLeft, options.fillEyeRight, options.fillNeck);
        } else {
            p = trk.loadDefaultFullHeadSimplified();
        }

        p.then(() => {
            onLoad?.(trk);
        }).catch(_ => {
            onError?.(_);
        });

        return trk;
    }

    parse() : void  {
        return
    }
}
