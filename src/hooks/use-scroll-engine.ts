'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '@/stores/scene-store';
import type { SceneId } from '@/types/scene';

gsap.registerPlugin(ScrollTrigger);

/**
 * 统一滚动驱动引擎
 *
 * ## 架构
 * 用户滚动 → Lenis（平滑惯性滚动）→ GSAP ScrollTrigger（scrub 进度映射）
 * → Zustand Store（全局状态） → 3D 组件 useFrame（动画更新）
 *
 * ## 设计要点
 * - Lenis 负责惯性平滑，避免原生滚动的步进感
 * - 每个 `<section>` 对应一个 ScrollTrigger，scrub: 1.2 延迟跟随避免机械感
 * - 全局 main 元素另有一个 ScrollTrigger 追踪整体进度 0-1
 * - `setTimeout(500ms)` 等待 DOM 渲染完成后再注册触发器
 *
 * ## 清理
 * 组件卸载时 kill 所有 ScrollTrigger + destroy Lenis + cancelAnimationFrame
 */
export function useScrollEngine() {
  const lenisRef = useRef<Lenis | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const setGlobalProgress = useSceneStore((s) => s.setGlobalProgress);
  const setSceneProgress = useSceneStore((s) => s.setSceneProgress);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const setParticleIdle = useSceneStore((s) => s.setParticleIdle);

  const setupScrollTriggers = useCallback(() => {
    // 清理旧触发器
    triggersRef.current.forEach((st) => st.kill());
    triggersRef.current = [];

    // 场景配置：每个场景占据一定的滚动区域
    const scenes: { id: SceneId; element: string }[] = [
      { id: 'hero', element: '#scene-hero' },
      { id: 'agriculture', element: '#scene-agriculture' },
      { id: 'temu', element: '#scene-temu' },
      { id: 'ecosystem', element: '#scene-ecosystem' },
    ];

    // 为每个场景创建 ScrollTrigger
    scenes.forEach(({ id, element }) => {
      const el = document.querySelector(element);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setSceneProgress(id, self.progress);
        },
        onEnter: () => {
          setActiveScene(id);
          if (id === 'ecosystem') {
            setParticleIdle(true);
          }
        },
        onEnterBack: () => {
          setActiveScene(id);
          if (id !== 'ecosystem') {
            setParticleIdle(false);
          }
        },
      });

      triggersRef.current.push(st);
    });

    // 全局进度 ScrollTrigger（整个 main 元素）
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const globalST = ScrollTrigger.create({
        trigger: mainEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          setGlobalProgress(self.progress);
        },
      });
      triggersRef.current.push(globalST);
    }
  }, [setGlobalProgress, setSceneProgress, setActiveScene, setParticleIdle]);

  useEffect(() => {
    // 初始化 Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2.5,
      gestureOrientation: 'vertical' as const,
    });

    lenisRef.current = lenis;

    // Lenis → ScrollTrigger 同步
    lenis.on('scroll', ScrollTrigger.update);

    // 统一 RAF 循环
    const rafCallback = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(rafCallback);
    };
    const rafId = requestAnimationFrame(rafCallback);

    // GSAP ticker 同步
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 延迟设置 ScrollTrigger（等待 DOM 渲染完成）
    const timer = setTimeout(() => {
      setupScrollTriggers();
    }, 500);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      triggersRef.current.forEach((st) => st.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
    };
  }, [setupScrollTriggers]);

  /**
   * 程序化导航至指定场景
   */
  const scrollToScene = useCallback((sceneId: SceneId) => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const target = document.querySelector(`#scene-${sceneId}`) as HTMLElement | null;
    if (target) {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    }
  }, []);

  return { scrollToScene, lenis: lenisRef };
}
