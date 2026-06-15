import { create } from 'zustand';
import type { GlobalScrollState, SceneActions, SceneId, RenderBackend, QualityTier } from '@/types/scene';

export type SceneStore = GlobalScrollState & SceneActions;

export const useSceneStore = create<SceneStore>((set, get) => ({
  // ===== State =====
  globalScrollProgress: 0,
  activeScene: 'hero' as SceneId,
  sceneProgress: {
    hero: 0,
    agriculture: 0,
    temu: 0,
    ecosystem: 0,
  },
  isProgrammaticScroll: false,
  backend: 'webgl' as RenderBackend,
  qualityTier: 'high' as QualityTier,
  is3DLoaded: false,
  isParticleIdle: false,
  currentFPS: 60,

  // ===== Actions =====
  setGlobalProgress: (progress: number) =>
    set({ globalScrollProgress: progress }),

  setActiveScene: (scene: SceneId) =>
    set({ activeScene: scene }),

  setSceneProgress: (scene: SceneId, progress: number) =>
    set((state) => ({
      sceneProgress: { ...state.sceneProgress, [scene]: progress },
    })),

  setProgrammaticScroll: (isProgrammatic: boolean) =>
    set({ isProgrammaticScroll: isProgrammatic }),

  setBackend: (backend: RenderBackend) =>
    set({ backend }),

  setQualityTier: (tier: QualityTier) =>
    set({ qualityTier: tier }),

  set3DLoaded: (loaded: boolean) =>
    set({ is3DLoaded: loaded }),

  setParticleIdle: (idle: boolean) =>
    set({ isParticleIdle: idle }),

  setCurrentFPS: (fps: number) =>
    set({ currentFPS: fps }),

  navigateToScene: (scene: SceneId) => {
    set({ isProgrammaticScroll: true });
    const element = document.getElementById(`scene-${scene}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // 滚动结束后重置标志
    setTimeout(() => set({ isProgrammaticScroll: false }), 2000);
  },
}));
