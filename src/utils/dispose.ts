import * as THREE from 'three';

/**
 * Dispose 单个材质及其内部纹理
 */
function disposeMaterial(material: THREE.Material | null): void {
  if (!material) return;

  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && value instanceof THREE.Texture) {
      value.dispose();
    }
  }
  material.dispose();
}

/**
 * 递归 Dispose 一个 Object3D 及其所有子节点的 GPU 资源
 */
export function disposeTree(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(child.material);
      }
    }

    if (child instanceof THREE.InstancedMesh) {
      child.geometry?.dispose();
      disposeMaterial(child.material);
    }

    if (child instanceof THREE.Points) {
      child.geometry?.dispose();
      disposeMaterial(child.material);
    }
  });

  obj.parent?.remove(obj);
}

/**
 * 主动清理 GPU 资源
 */
export function purgeGPUResources(renderer: THREE.WebGLRenderer): void {
  renderer.renderLists.dispose();
  renderer.info.reset();
}
