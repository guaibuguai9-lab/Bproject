import * as THREE from 'three';

/** 4 个核心场景标识 */
export type SceneId = 'hero' | 'agriculture' | 'temu' | 'ecosystem';

/** 自适应画质等级 */
export type QualityTier = 'ultra' | 'high' | 'medium' | 'low' | 'static';

/** 渲染后端 */
export type RenderBackend = 'webgpu' | 'webgl';

/** 相机关键帧 */
export interface CameraKeyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

/** 场景时间轴配置 */
export interface SceneTimeline {
  id: SceneId;
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: number;
  onUpdate?: (progress: number) => void;
}

/** 质量配置 */
export interface AdaptiveConfig {
  qualityTier: QualityTier;
  particleCount: number;
  shadowEnabled: boolean;
  textureResolution: 'full' | 'half' | 'quarter';
  antialias: boolean;
  postProcessing: boolean;
}

/** 全局滚动状态 */
export interface GlobalScrollState {
  /** 全局滚动进度 0-1，跨 4 个场景 */
  globalScrollProgress: number;
  /** 当前活跃场景 */
  activeScene: SceneId;
  /** 每个场景内的局部进度 0-1 */
  sceneProgress: Record<SceneId, number>;
  /** 是否正在程序化滚动（Nav 跳转） */
  isProgrammaticScroll: boolean;
  /** 渲染后端类型 */
  backend: RenderBackend;
  /** 自适应画质等级 */
  qualityTier: QualityTier;
  /** 是否 3D 加载完成 */
  is3DLoaded: boolean;
  /** 粒子是否处于 Idle 状态 */
  isParticleIdle: boolean;
  /** 当前 FPS */
  currentFPS: number;
}

/** Store Actions */
export interface SceneActions {
  setGlobalProgress: (progress: number) => void;
  setActiveScene: (scene: SceneId) => void;
  setSceneProgress: (scene: SceneId, progress: number) => void;
  setProgrammaticScroll: (isProgrammatic: boolean) => void;
  setBackend: (backend: RenderBackend) => void;
  setQualityTier: (tier: QualityTier) => void;
  set3DLoaded: (loaded: boolean) => void;
  setParticleIdle: (idle: boolean) => void;
  setCurrentFPS: (fps: number) => void;
  /** 导航至指定场景 */
  navigateToScene: (scene: SceneId) => void;
}
