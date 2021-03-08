import * as THREE from "three";
import { HeadMaskMesh } from "./headmaskmesh";

export class HeadMaskMeshLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager) {
        super(manager);
    }

    load(onLoad?: () => void, onProgress?: () => void, onError?: () =>  void) : HeadMaskMesh {
        return new HeadMaskMesh(onLoad, onError);
    }

    parse() : void {
        return;
    }
}
