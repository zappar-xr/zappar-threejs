import { THREE }  from "./three";
import { FaceTracker } from "./defaultpipeline";

export class FaceTrackerLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager) {
        super(manager);
    }

    load(customModel?: string, onLoad?: (i: FaceTracker) => void, onProgress?: () => void, onError?: (message?: unknown) =>  void) : FaceTracker {
        const trk = new FaceTracker();
        const p = customModel ? trk.loadModel(customModel) : trk.loadDefaultModel();
        p.then(() => {
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
