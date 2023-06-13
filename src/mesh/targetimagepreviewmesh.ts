import { ImageTarget } from "@zappar/zappar/lib/imagetracker";
import { TargetImagePreviewBufferGeometry } from "..";
import { THREE } from "../three";

/**
 * A THREE.Mesh that fits the target image.
 * If a material is not specified, it will use a default THREE.MeshBasicMaterial with a map of the target image.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class TargetImagePreviewMesh extends THREE.Mesh {
  public constructor(target: ImageTarget, material?: THREE.Material) {
    if (!material) {
      const map = new THREE.TextureLoader().load(target.image!.src);
      map.colorSpace = THREE.SRGBColorSpace;
      // eslint-disable-next-line no-param-reassign
      material = new THREE.MeshBasicMaterial({
        map,
      });
    }
    super(new TargetImagePreviewBufferGeometry(target), material);
  }
}
