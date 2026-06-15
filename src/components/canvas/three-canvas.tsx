'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneRoot } from './scene-root';
import { useSceneStore } from '@/stores/scene-store';
import { AdaptiveQualityEngine } from '@/utils/adaptive-quality';

/**
 * Three.js Canvas 容器
 *
 * WebGL 优先渲染（WebGPU 作为渐进增强），
 * 固定为全屏背景层，pointer-events: none 确保 DOM 交互不受阻
 */
export const ThreeCanvas: React.FC = () => {
  const set3DLoaded = useSceneStore((s) => s.set3DLoaded);
  const setQualityTier = useSceneStore((s) => s.setQualityTier);
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 初始化自适应画质
    const qualityEngine = new AdaptiveQualityEngine();
    const tier = qualityEngine.initialize();
    setQualityTier(tier);
  }, [setQualityTier]);

  // Scene 4 激活时模糊 Canvas
  const isScene4 = globalProgress > 0.75;

  if (!isMounted) return null;

  return (
    <div
      id="three-canvas-container"
      aria-hidden="true"
      className="three-canvas-container"
      style={{
        filter: isScene4 ? 'blur(20px)' : 'blur(0px)',
        transition: 'filter 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Canvas
        frameloop="always"
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
        }}
        camera={{
          position: [0, 0, 8],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        onCreated={() => {
          set3DLoaded(true);
        }}
      >
        <SceneRoot />
      </Canvas>
    </div>
  );
};
