import { ImageTarget } from "@zappar/zappar/lib/imagetracker";
import { TargetImagePreviewBufferGeometry } from "..";
import { THREE } from "../three";

/**
 * A THREE.Mesh that fits the target image.
 * If a material is not specified, it will use a default THREE.MeshBasicMaterial with a map of the target image.
 * @see https://docs.zap.works/universal-ar/web-libraries/threejs/image-tracking/
 */
export class TargetImagePreviewMesh extends THREE.Mesh {
  public constructor(
    target: ImageTarget,
    material: THREE.Material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(target.image!.src),
    })
  ) {
    super(new TargetImagePreviewBufferGeometry(target), material);
  }
}
