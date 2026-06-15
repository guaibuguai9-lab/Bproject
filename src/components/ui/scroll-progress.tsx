'use client';

import { useSceneStore } from '@/stores/scene-store';

/**
 * 滚动进度条 — 底部固定，显示全局滚动进度
 */
export const ScrollProgress: React.FC = () => {
  const globalProgress = useSceneStore((s) => s.globalScrollProgress);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full transition-all duration-100 ease-linear"
        style={{
          width: `${globalProgress * 100}%`,
          background: 'linear-gradient(90deg, #E02D1C, #00AA6C, #1A73E8)',
        }}
      />
    </div>
  );
};
