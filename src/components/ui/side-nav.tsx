'use client';

import { useCallback } from 'react';
import { useSceneStore } from '@/stores/scene-store';
import type { SceneId } from '@/types/scene';

interface SceneDot {
  id: SceneId;
  label: string;
  number: string;
}

const SCENE_DOTS: SceneDot[] = [
  { id: 'hero', label: '首页', number: '01' },
  { id: 'agriculture', label: '农业', number: '02' },
  { id: 'temu', label: '全球', number: '03' },
  { id: 'ecosystem', label: '生态', number: '04' },
];

/**
 * 右侧场景圆点导航
 * 竖排固定在视口右侧，指示当前场景，可点击跳转
 */
export const SideNav: React.FC = () => {
  const activeScene = useSceneStore((s) => s.activeScene);
  const navigateToScene = useSceneStore((s) => s.navigateToScene);

  const handleClick = useCallback(
    (sceneId: SceneId) => {
      navigateToScene(sceneId);
    },
    [navigateToScene]
  );

  return (
    <nav
      aria-label="场景导航"
      className="
        fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-30
        flex flex-col items-center gap-4
      "
    >
      {SCENE_DOTS.map((dot) => {
        const isActive = activeScene === dot.id;
        return (
          <button
            key={dot.id}
            onClick={() => handleClick(dot.id)}
            aria-label={`跳转到${dot.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="
              group relative flex items-center gap-3
              bg-transparent border-0 cursor-pointer p-1
              transition-all duration-300
            "
          >
            {/* Label (hover 时显示) */}
            <span
              className="
                hidden md:block absolute right-8 text-xs font-medium
                whitespace-nowrap text-white/0
                group-hover:text-white/60
                transition-all duration-200
              "
            >
              {dot.number} {dot.label}
            </span>

            {/* Dot */}
            <span
              className={`
                block rounded-full transition-all duration-300
                ${
                  isActive
                    ? 'w-3 h-3 bg-[#E02D1C] shadow-[0_0_12px_rgba(224,45,28,0.5)] scale-110'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40 hover:scale-110'
                }
              `}
            />

            {/* Active 时的小光环 */}
            {isActive && (
              <span
                className="
                  absolute w-6 h-6 rounded-full
                  border border-[#E02D1C]/30
                  animate-ping opacity-0
                "
                style={{ animationDuration: '2s' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
