import { THREE }  from "./three";
import { ImageTracker } from "./defaultpipeline";

export class ImageTrackerLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager) {
        super(manager);
    }

    load(zpt : string, onLoad?: (i: ImageTracker) => void, onProgress?: () => void, onError?: (message?: unknown) =>  void) : ImageTracker {
        const trk = new ImageTracker();

        trk.loadTarget(zpt).then(() => {
            onLoad?.(trk);
        }).catch(_ => {
            onError?.(_);
        })

        return trk;
    }

    parse() : void  {
        return
    }
}
