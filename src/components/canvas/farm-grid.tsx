'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/stores/scene-store';
import * as THREE from 'three';

/**
 * 简易 Simplex-like 噪声函数（用于农田波形）
 */
function noise2D(x: number, y: number): number {
  const dot = x * 12.9898 + y * 78.233;
  const sin1 = Math.sin(dot) * 43758.5453;
  const sin2 = Math.sin(dot * 1.7 + 1.3) * 23421.631;
  return (sin1 - Math.floor(sin1)) * 0.5 + (sin2 - Math.floor(sin2)) * 0.3;
}

/**
 * 农田参数化网格 — Scene 2
 *
 * 40×60 单元格网格，Y 轴按 Simplex Noise 起伏
 * 随滚动进度生长，绿色数据光柱标注作物节点
 */
export const FarmGrid: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);
  const agriProgress = useSceneStore((s) => s.sceneProgress.agriculture);

  const rows = 40;
  const cols = 60;
  const cellSize = 0.15;
  const instanceCount = rows * cols;

  // 颜色
  const colorGray = useMemo(() => new THREE.Color('#3A3A3A'), []);
  const colorGreen = useMemo(() => new THREE.Color('#00AA6C'), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // 预计算每个 cell 的基础高度（噪声）
  const heightMap = useMemo(() => {
    const map = new Float32Array(instanceCount);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const nx = col / cols - 0.5;
        const nz = row / rows - 0.5;
        map[idx] = noise2D(nx * 5, nz * 5) * 0.5;
      }
    }
    return map;
  }, []);

  // 创建矩阵数组
  const matrices = useMemo(() => {
    const result: THREE.Matrix4[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const m = new THREE.Matrix4();
        result.push(m);
      }
    }
    return result;
  }, []);

  // 材质
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.2,
      vertexColors: false,
    });
  }, []);

  // 几何体
  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(cellSize, 0.05, cellSize);
  }, []);

  // 动画更新
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const growthProgress = Math.max(0, Math.min(1, (globalProgress - 0.15) / 0.4));
    const showScene = globalProgress > 0.1 && globalProgress < 0.65;

    mesh.visible = showScene;

    if (!showScene) return;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const baseHeight = heightMap[idx];
        const growHeight = baseHeight * growthProgress;

        const x = (col - cols / 2) * cellSize;
        const z = (row - rows / 2) * cellSize;
        const y = growHeight;

        const matrix = matrices[idx];
        matrix.compose(
          new THREE.Vector3(x, y, z),
          new THREE.Quaternion(),
          new THREE.Vector3(1, growthProgress * 1.2, 1)
        );

        mesh.setMatrixAt(idx, matrix);

        // 颜色：从灰色过渡到绿色
        const noiseVal = heightMap[idx];
        const greenThreshold = 0.5 + noiseVal * 0.5; // > 0 的部分
        const greenAmount = growthProgress * Math.max(0, greenThreshold);
        tempColor.copy(colorGray).lerp(colorGreen, greenAmount);
        mesh.setColorAt(idx, tempColor);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // 整体缓慢旋转
    mesh.rotation.y += 0.002;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instanceCount]}
      visible={false}
      position={[0, -1.5, -3]}
    />
  );
};
