'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/stores/scene-store';
import * as THREE from 'three';

/**
 * 粒子罗盘核心 — Scene 1 主视觉
 *
 * ## 设计理念
 * 20,000+ 粒子通过 5 种分布模式模拟"有机算法的粒子罗盘"：
 * 1. 核心球体 (20%): 品牌红密集核心，象征拼多多 AI 推荐引擎
 * 2. 螺旋环 (20%): 红/绿/蓝混合螺旋，多色粒子绕核心旋转
 * 3. 绿色光晕 (15%): 东北方向农业粒子流，代表农产品上行
 * 4. 蓝色网状 (15%): 全球供应链扩散，代表 Temu 跨境网络
 * 5. 宽域环境 (30%): 极低亮度散落粒子，填充屏幕两侧边缘
 *
 * ## 性能
 * - 粒子数随 5 档画质缩放 (4K-30K)
 * - 使用 THREE.Points + AdditiveBlending，单 Draw Call
 * - 圆形粒子纹理 Canvas 程序化生成，零外部资源依赖
 *
 * ## 动画
 * - 罗盘自转 + 微呼吸（sin 波动 ±3% 透明度）
 * - Scene 4 过渡期缩小至 15% + 透明度线性衰减
 */
export const ParticleCompass: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);
  const sceneProgress = useSceneStore((s) => s.sceneProgress.hero);
  const qualityTier = useSceneStore((s) => s.qualityTier);

  // 根据画质等级确定粒子数量
  const particleCount = useMemo(() => {
    const counts: Record<string, number> = {
      ultra: 30000,
      high: 20000,
      medium: 10000,
      low: 4000,
      static: 0,
    };
    return counts[qualityTier] ?? 10000;
  }, [qualityTier]);

  // 创建粒子几何体 — 螺旋环状罗盘
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    // PDD 品牌色
    const brandRed = new THREE.Color('#E02D1C');
    const agriGreen = new THREE.Color('#00AA6C');
    const globalBlue = new THREE.Color('#1A73E8');
    const neutralWhite = new THREE.Color('#F5F5F5');

    for (let i = 0; i < particleCount; i++) {
      // 多种分布模式混合，形成罗盘形状
      const mode = Math.random();

      let x: number, y: number, z: number;
      let color: THREE.Color;

      if (mode < 0.20) {
        // 模式 1 (20%): 核心球体 — 品牌红
        const radius = 0.3 + Math.random() * 0.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
        color = brandRed.clone().multiplyScalar(0.7 + Math.random() * 0.3);
      } else if (mode < 0.40) {
        // 模式 2 (20%): 螺旋环 — 多种颜色
        const t = (mode - 0.20) / 0.20;
        const angle = t * Math.PI * 6 + Math.random() * 0.5;
        const radius = 1.2 + Math.sin(t * Math.PI * 4) * 0.4 + Math.random() * 0.15;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = (Math.random() - 0.5) * 0.6 + Math.sin(t * Math.PI * 3) * 0.5;

        const colorMix = Math.random();
        if (colorMix < 0.33) color = agriGreen.clone();
        else if (colorMix < 0.66) color = globalBlue.clone();
        else color = brandRed.clone();
        color.multiplyScalar(0.6 + Math.random() * 0.4);
      } else if (mode < 0.55) {
        // 模式 3 (15%): 外围光晕 — 绿色农业粒子流（东北方向）
        const t = (mode - 0.40) / 0.15;
        const angle = t * Math.PI * 2 + Math.PI / 4;
        const radius = 1.8 + Math.random() * 0.8;
        const height = 0.5 + Math.random() * 1.5;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = height;
        color = agriGreen.clone().multiplyScalar(0.5 + Math.random() * 0.5);
      } else if (mode < 0.70) {
        // 模式 4 (15%): 外围网状 — 蓝色全球供应链粒子
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.5 + Math.random() * 1.2;
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.cos(phi) * 0.6;
        z = radius * Math.sin(phi) * Math.sin(theta);
        color = globalBlue.clone().multiplyScalar(0.5 + Math.random() * 0.5);
      } else {
        // 模式 5 (30%): 宽域环境粒子 — 填充屏幕两侧
        // 水平方向大幅展开，纵深散布，极低亮度
        const spreadX = (Math.random() - 0.5) * 16;       // X: -8 ~ +8
        const spreadZ = (Math.random() - 0.5) * 8;        // Z: -4 ~ +4
        const heightRange = (Math.random() - 0.5) * 5;    // Y: -2.5 ~ +2.5
        x = spreadX;
        z = spreadZ;
        y = heightRange;

        // 中性白 + 极低亮度，不抢核心罗盘焦点
        const brightness = 0.08 + Math.random() * 0.12;
        const tintRoll = Math.random();
        if (tintRoll < 0.15) {
          color = brandRed.clone().multiplyScalar(brightness);
        } else if (tintRoll < 0.30) {
          color = agriGreen.clone().multiplyScalar(brightness);
        } else if (tintRoll < 0.45) {
          color = globalBlue.clone().multiplyScalar(brightness);
        } else {
          color = neutralWhite.clone().multiplyScalar(brightness);
        }
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { positions: pos, colors: col };
  }, [particleCount]);

  // 创建粒子材质
  const material = useMemo(() => {
    // 创建圆形粒子纹理
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return new THREE.PointsMaterial({
      size: 0.04,
      map: texture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    });
  }, []);

  // 动画循环
  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // 基础自转
    points.rotation.y += delta * 0.15;
    points.rotation.x += delta * 0.03;

    // 呼吸效果 — Scene 1 活跃时最强
    const heroActivity = sceneProgress < 0.3 ? 1 : Math.max(0, 1 - (sceneProgress - 0.3) / 0.4);
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03 * heroActivity;
    const scale = breathe;

    // Scene 4: 缩小并退场
    const shrinkFactor = globalProgress > 0.75
      ? 1 - (globalProgress - 0.75) / 0.25
      : 1;
    points.scale.setScalar(scale * Math.max(0.15, shrinkFactor));

    // 透明度随全局进度衰减
    material.opacity = globalProgress > 0.7
      ? 0.9 * (1 - (globalProgress - 0.7) / 0.3)
      : 0.9;
  });

  // 可见性控制
  const visible = globalProgress < 0.9;

  return (
    <points ref={pointsRef} visible={visible}>
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
