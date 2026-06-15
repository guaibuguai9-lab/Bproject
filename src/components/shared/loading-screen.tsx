'use client';

import { useEffect, useState } from 'react';
import { useSceneStore } from '@/stores/scene-store';

/**
 * 3D 加载屏幕
 * Phase 0-3: Shell → Emerge → Crystallize → Idle
 */
export const LoadingScreen: React.FC = () => {
  const is3DLoaded = useSceneStore((s) => s.is3DLoaded);
  const [phase, setPhase] = useState<'hidden' | 'fade-in' | 'visible' | 'fade-out'>('hidden');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 模拟加载进度
    setPhase('fade-in');

    const duration = 2000; // 2s 总加载时间
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);

      if (p >= 1) {
        clearInterval(interval);
        setPhase('fade-out');
        setTimeout(() => {
          setPhase('hidden');
        }, 600);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[#0A0A0A]
        transition-opacity duration-600 ease-out
        ${phase === 'fade-out' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      aria-label="加载中"
      role="status"
    >
      {/* 品牌红渐变光晕 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(224,45,28,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          拼<span className="text-[#E02D1C]">多多</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base font-light">
          Tech for Agri · Global for All
        </p>
      </div>

      {/* 进度条 */}
      <div className="relative z-10 mt-12 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E02D1C] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* 加载文本 */}
      <p className="relative z-10 mt-4 text-xs text-white/30 font-light">
        {progress < 1 ? '正在构建沉浸体验...' : '准备就绪'}
      </p>
    </div>
  );
};
