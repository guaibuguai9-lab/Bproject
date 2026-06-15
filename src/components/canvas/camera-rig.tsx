'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '@/stores/scene-store';
import * as THREE from 'three';
import type { CameraKeyframe } from '@/types/scene';

/**
 * 4 个场景的相机关键帧预设
 */
const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Scene 1: 首页 — 近距离罗盘
  {
    position: new THREE.Vector3(0, 0, 8),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 60,
  },
  // Scene 2: 农业 — 抬升俯瞰
  {
    position: new THREE.Vector3(0, 3, 12),
    lookAt: new THREE.Vector3(0, 1, -3),
    fov: 55,
  },
  // Scene 3: 全球化 — 大幅拉远
  {
    position: new THREE.Vector3(0, 7, 18),
    lookAt: new THREE.Vector3(0, 2, 0),
    fov: 50,
  },
  // Scene 4: 商家生态 — 远处静态
  {
    position: new THREE.Vector3(0, 0, 20),
    lookAt: new THREE.Vector3(0, -1, -10),
    fov: 45,
  },
];

/**
 * Camera Rig — 纯逻辑组件
 * 根据 globalScrollProgress 在 4 个关键帧之间平滑插值
 * 使用 CatmullRom 样条实现平滑的相机运动
 */
export const CameraRig: React.FC = () => {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);

  // 缓存向量避免 GC
  const currentPos = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const lerpPos = useRef(new THREE.Vector3());
  const lerpLook = useRef(new THREE.Vector3());

  // 呼吸动画相位
  const breathePhase = useRef(0);

  useFrame((_, delta) => {
    // 根据全局进度确定当前处于哪两个关键帧之间
    const sceneCount = CAMERA_KEYFRAMES.length - 1; // 3 段插值
    const t = Math.max(0, Math.min(1, globalProgress));
    const scaledT = t * sceneCount;
    const fromIndex = Math.min(Math.floor(scaledT), sceneCount - 1);
    const toIndex = fromIndex + 1;
    const localT = scaledT - fromIndex;

    // 获取当前段的关键帧
    const fromKF = CAMERA_KEYFRAMES[fromIndex];
    const toKF = CAMERA_KEYFRAMES[toIndex];

    // 使用 smoothstep 平滑插值
    const smoothT = THREE.MathUtils.smoothstep(localT, 0, 1);

    // 位置插值
    targetPos.current.lerpVectors(fromKF.position, toKF.position, smoothT);
    targetLook.current.lerpVectors(fromKF.lookAt, toKF.lookAt, smoothT);

    // 呼吸动画（Scene 1 时最强，Scene 4 时消失）
    breathePhase.current += delta * 0.5;
    const breatheStrength = Math.max(0, 1 - globalProgress * 3);
    const breatheOffset = Math.sin(breathePhase.current) * 0.3 * breatheStrength;

    // 平滑跟随
    currentPos.current.lerp(targetPos.current, 0.05);
    currentPos.current.y += breatheOffset;
    currentLook.current.lerp(targetLook.current, 0.05);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);

    // FOV 插值
    const targetFov = THREE.MathUtils.lerp(fromKF.fov, toKF.fov, smoothT);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
    camera.updateProjectionMatrix();
  });

  return null;
};
