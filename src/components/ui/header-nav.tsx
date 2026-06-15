'use client';

import { useCallback } from 'react';
import { useSceneStore } from '@/stores/scene-store';
import type { SceneId } from '@/types/scene';

const NAV_ITEMS: { id: SceneId; label: string; href: string }[] = [
  { id: 'hero', label: '首页', href: '#scene-hero' },
  { id: 'agriculture', label: '农业科技', href: '#scene-agriculture' },
  { id: 'temu', label: 'Temu 全球', href: '#scene-temu' },
  { id: 'ecosystem', label: '商家生态', href: '#scene-ecosystem' },
];

/**
 * 顶部导航栏 — position: fixed 覆盖在 3D Canvas 之上
 */
export const HeaderNav: React.FC = () => {
  const activeScene = useSceneStore((s) => s.activeScene);
  const navigateToScene = useSceneStore((s) => s.navigateToScene);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sceneId: SceneId) => {
      e.preventDefault();
      navigateToScene(sceneId);
    },
    [navigateToScene]
  );

  return (
    <header
      role="banner"
      aria-label="网站导航"
      className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
    >
      <nav
        aria-label="主导航"
        className="mx-auto max-w-7xl flex items-center justify-between"
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="拼多多首页"
          className="flex items-center gap-2 text-white no-underline"
        >
          <span className="text-2xl font-bold tracking-tight text-[#E02D1C]">
            拼多多
          </span>
          <span className="hidden sm:inline text-xs text-white/50 font-light border-l border-white/20 pl-2">
            PDD
          </span>
        </a>

        {/* Nav Items */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-full
                  transition-all duration-300 no-underline
                  ${
                    activeScene === item.id
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
                aria-current={activeScene === item.id ? 'page' : undefined}
              >
                {item.label}
                {activeScene === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#E02D1C] rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA 按钮 */}
        <a
          href="/merchant"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold
                     bg-[#E02D1C] text-white rounded-full
                     hover:bg-[#c92012] transition-colors duration-200 no-underline"
        >
          商家入驻
        </a>
      </nav>
    </header>
  );
};
