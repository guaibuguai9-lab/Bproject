'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/stores/scene-store';
import * as THREE from 'three';

/**
 * 全球供应链光点流动 — Scene 3
 *
 * 工厂→港口→消费者 光点流
 * GPU 粒子系统模拟，Additive Blending
 */
export const SupplyChainFlows: React.FC = () => {
  const flowRef = useRef<THREE.Points>(null);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);
  const qualityTier = useSceneStore((s) => s.qualityTier);

  const flowCount = useMemo(() => {
    const counts: Record<string, number> = {
      ultra: 5000, high: 3000, medium: 1500, low: 600, static: 0,
    };
    return counts[qualityTier] ?? 1500;
  }, [qualityTier]);

  // 每个粒子的元数据
  const particleData = useMemo(() => {
    const data: {
      origin: THREE.Vector3;
      target: THREE.Vector3;
      progress: number;
      speed: number;
    }[] = [];

    // 工厂原点集群 — 中国东南沿海（球面坐标映射）
    const factoryCenter = new THREE.Vector3(1.8, -0.5, 0.3);

    // 生成 90+ 消费节点
    const consumerNodes: THREE.Vector3[] = [];
    const radius = 2.5;
    for (let i = 0; i < 90; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / 90);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + i * 0.3;
      consumerNodes.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ));
    }

    for (let i = 0; i < flowCount; i++) {
      const origin = factoryCenter.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.4
        )
      );
      const targetIdx = Math.floor(Math.random() * consumerNodes.length);
      data.push({
        origin,
        target: consumerNodes[targetIdx].clone(),
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.004,
      });
    }
    return data;
  }, [flowCount]);

  // 粒子位置 Buffer
  const positions = useMemo(() => {
    return new Float32Array(flowCount * 3);
  }, [flowCount]);

  // 粒子颜色 Buffer
  const colors = useMemo(() => {
    const col = new Float32Array(flowCount * 3);
    const blue = new THREE.Color('#1A73E8');
    const red = new THREE.Color('#E02D1C');
    for (let i = 0; i < flowCount; i++) {
      const t = particleData[i].speed / 0.005;
      const c = blue.clone().lerp(red, t);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, [particleData, flowCount]);

  // 材质
  const material = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.PointsMaterial({
      size: 0.06,
      map: texture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  // 临时向量缓存
  const tempVec = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const flow = flowRef.current;
    if (!flow) return;

    const showScene = globalProgress > 0.4 && globalProgress < 0.9;
    const sceneIntensity = showScene
      ? Math.min(1, (globalProgress - 0.4) / 0.1) * Math.min(1, (0.9 - globalProgress) / 0.1)
      : 0;

    flow.visible = sceneIntensity > 0;
    material.opacity = 0.8 * sceneIntensity;

    if (!showScene) return;

    const posArray = positions;
    const dt = delta;

    for (let i = 0; i < flowCount; i++) {
      const data = particleData[i];
      data.progress += data.speed * dt * 60;

      // 生命周期循环
      if (data.progress > 1) {
        data.progress = 0;
        // 随机切换目标
        const newTargetIdx = Math.floor(Math.random() * 90);
        const radius = 2.5;
        const phi = Math.acos(1 - 2 * (newTargetIdx + 0.5) / 90);
        const theta = Math.PI * (1 + Math.sqrt(5)) * newTargetIdx + newTargetIdx * 0.3;
        data.target.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }

      // 沿大圆航线插值
      const t = data.progress;
      const easedT = t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;

      tempVec.current.lerpVectors(data.origin, data.target, easedT);

      // 弧线高度（模拟大圆航线）
      const arcHeight = Math.sin(t * Math.PI) * 1.2;
      tempVec.current.y += arcHeight;

      // Curl noise 扰动
      const curlX = Math.sin(tempVec.current.y * 3 + globalProgress * 10) * 0.05;
      const curlZ = Math.cos(tempVec.current.x * 3 + globalProgress * 10) * 0.05;
      tempVec.current.x += curlX;
      tempVec.current.z += curlZ;

      posArray[i * 3] = tempVec.current.x;
      posArray[i * 3 + 1] = tempVec.current.y;
      posArray[i * 3 + 2] = tempVec.current.z;
    }

    (flow.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
  });

  return (
    <points ref={flowRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
};
