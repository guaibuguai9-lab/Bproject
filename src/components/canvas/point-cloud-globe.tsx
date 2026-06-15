'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/stores/scene-store';
import * as THREE from 'three';

/**
 * 点云地球 — Scene 3 核心视觉
 *
 * 8,000 个点构成地球形状，纯点云重建
 * 90+ 国家节点光环标记
 */
export const PointCloudGlobe: React.FC = () => {
  const globeRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.InstancedMesh>(null);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);
  const qualityTier = useSceneStore((s) => s.qualityTier);

  // 自适应国家节点数量
  const countryCount = useMemo(() => {
    const counts: Record<string, number> = {
      ultra: 90, high: 72, medium: 45, low: 20, static: 0,
    };
    return counts[qualityTier] ?? 45;
  }, [qualityTier]);

  // 地球点云
  const globePointCount = 8000;
  const globePositions = useMemo(() => {
    const pos = new Float32Array(globePointCount * 3);
    const radius = 2.5;
    for (let i = 0; i < globePointCount; i++) {
      // Fibonacci 球面分布
      const phi = Math.acos(1 - 2 * (i + 0.5) / globePointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  // 地球点材质
  const globeMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(26, 115, 232, 0.9)'); // 品牌蓝
    gradient.addColorStop(0.5, 'rgba(26, 115, 232, 0.3)');
    gradient.addColorStop(1, 'rgba(26, 115, 232, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.05,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85,
      color: '#1A73E8',
    });
  }, []);

  // 国家节点光环几何体
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(0.12, 0.02, 8, 16), []);

  // 国家节点材质
  const ringMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1A73E8',
      roughness: 0.3,
      metalness: 0.8,
      emissive: '#1A73E8',
      emissiveIntensity: 0.5,
    });
  }, []);

  // 预计算国家节点位置
  const countryMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const radius = 2.6; // 略高于地球表面
    for (let i = 0; i < countryCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / countryCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + i * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      // 中国东南沿海节点集群（前 10%）
      const isChinaCluster = i < countryCount * 0.1;
      const adjustedX = isChinaCluster ? x * 1.05 : x;
      const adjustedY = isChinaCluster ? y * 0.9 : y;
      const adjustedZ = isChinaCluster ? z * 1.05 : z;

      const m = new THREE.Matrix4();
      m.compose(
        new THREE.Vector3(adjustedX, adjustedY, adjustedZ),
        new THREE.Quaternion(),
        new THREE.Vector3(1, 1, 1)
      );
      matrices.push(m);
    }
    return matrices;
  }, [countryCount]);

  // 动画更新
  useFrame((_, delta) => {
    const globe = globeRef.current;
    const rings = ringsRef.current;

    // 场景可见性
    const showScene = globalProgress > 0.35 && globalProgress < 0.9;
    const sceneIntensity = showScene
      ? Math.min(1, (globalProgress - 0.35) / 0.15) * Math.min(1, (0.9 - globalProgress) / 0.15)
      : 0;

    if (globe) {
      globe.visible = sceneIntensity > 0;
      globe.rotation.y += delta * 0.08;
      (globe.material as THREE.PointsMaterial).opacity = 0.85 * sceneIntensity;
    }

    if (rings) {
      rings.visible = sceneIntensity > 0.3;
      rings.rotation.y += delta * 0.08; // 与地球同步旋转

      for (let i = 0; i < countryCount; i++) {
        const m = countryMatrices[i];
        rings.setMatrixAt(i, m);
      }
      rings.instanceMatrix.needsUpdate = true;

      const mat = rings.material as THREE.MeshStandardMaterial;
      mat.opacity = sceneIntensity;
      mat.transparent = true;
    }
  });

  return (
    <group>
      {/* 地球点云 */}
      <points ref={globeRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[globePositions, 3]}
          />
        </bufferGeometry>
        <primitive object={globeMaterial} attach="material" />
      </points>

      {/* 国家节点光环 */}
      <instancedMesh
        ref={ringsRef}
        args={[ringGeometry, ringMaterial, countryCount]}
        visible={false}
      />
    </group>
  );
};
