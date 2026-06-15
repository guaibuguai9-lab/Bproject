'use client';

import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleCompass } from './particle-compass';
import { FarmGrid } from './farm-grid';
import { PointCloudGlobe } from './point-cloud-globe';
import { SupplyChainFlows } from './supply-chain-flows';
import { CameraRig } from './camera-rig';
import { useSceneStore } from '@/stores/scene-store';

/**
 * 灯光配置组件
 */
const SceneLighting: React.FC = () => {
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);

  return (
    <>
      {/* 主方向光 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#FFFFFF"
      />
      {/* 环境光 */}
      <ambientLight intensity={0.4} color="#404060" />
      {/* 农业暖色补光 — Scene 2 */}
      <pointLight
        position={[0, 3, 0]}
        intensity={Math.max(0, globalProgress > 0.15 && globalProgress < 0.55 ? 0.8 : 0)}
        color="#FFD700"
      />
      {/* 全球冷色补光 — Scene 3 */}
      <pointLight
        position={[0, 5, 0]}
        intensity={Math.max(0, globalProgress > 0.4 && globalProgress < 0.8 ? 0.6 : 0)}
        color="#448AFF"
      />
      {/* 核心红色光 */}
      <pointLight
        position={[0, 0, 0]}
        intensity={Math.max(0, 1 - globalProgress * 1.5)}
        color="#E02D1C"
      />
    </>
  );
};

/**
 * FPS 监控组件
 */
const FPSMonitor: React.FC = () => {
  const fpsHistory = useRef<number[]>([]);
  const setCurrentFPS = useSceneStore((s) => s.setCurrentFPS);

  useFrame((_, delta) => {
    if (delta > 0) {
      const fps = 1 / delta;
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 30) fpsHistory.current.shift();
      const avgFPS =
        fpsHistory.current.reduce((a, b) => a + b, 0) /
        fpsHistory.current.length;
      setCurrentFPS(Math.round(avgFPS));
    }
  });

  return null;
};

/**
 * 背景渐变色
 */
const SceneBackground: React.FC = () => {
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);

  useFrame(({ scene }) => {
    // 从深色到品牌暗红色的渐变背景
    const r = 0.05 + globalProgress * 0.08;
    const g = 0.02 + globalProgress * 0.02;
    const b = 0.08 + (1 - globalProgress) * 0.05;
    scene.background = new THREE.Color(r, g, b);
  });

  return null;
};

/**
 * 场景 3D 根组件
 * 组合所有 3D 场景元素
 */
export const SceneRoot: React.FC = () => {
  return (
    <>
      {/* 背景 */}
      <SceneBackground />

      {/* 灯光 */}
      <SceneLighting />

      {/* 星空背景粒子 */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* 相机运动系统 */}
      <CameraRig />

      {/* FPS 监控 */}
      <FPSMonitor />

      {/* ===== Scene 1: 粒子罗盘 ===== */}
      <Suspense fallback={null}>
        <ParticleCompass />
      </Suspense>

      {/* ===== Scene 2: 农田网格 ===== */}
      <Suspense fallback={null}>
        <FarmGrid />
      </Suspense>

      {/* ===== Scene 3: 点云地球 + 供应链光流 ===== */}
      <Suspense fallback={null}>
        <PointCloudGlobe />
        <SupplyChainFlows />
      </Suspense>
    </>
  );
};
