import type { QualityTier, AdaptiveConfig } from '@/types/scene';

/**
 * 基于设备能力 + 实时 FPS 的动态降级引擎
 */
export class AdaptiveQualityEngine {
  private fpsHistory: number[] = [];
  private currentTier: QualityTier = 'high';

  initialize(): QualityTier {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'high';
    }

    const screenPixels = window.innerWidth * window.innerHeight;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // 检测 GPU
    const gpu = this.detectGPU();

    if (isMobile || screenPixels < 800_000 || gpu === 'low') {
      this.currentTier = 'medium';
    } else if (gpu === 'high' && screenPixels > 3_000_000) {
      this.currentTier = 'ultra';
    } else {
      this.currentTier = 'high';
    }

    return this.currentTier;
  }

  evaluate(currentFPS: number): AdaptiveConfig {
    this.fpsHistory.push(currentFPS);
    if (this.fpsHistory.length > 60) this.fpsHistory.shift();

    const avgFPS =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    if (avgFPS < 30 && this.currentTier !== 'low') {
      this.currentTier = this.downgrade(this.currentTier);
    }
    if (avgFPS > 55 && this.currentTier !== 'ultra') {
      this.currentTier = this.upgrade(this.currentTier);
    }

    return this.getConfig(this.currentTier);
  }

  getCurrentTier(): QualityTier {
    return this.currentTier;
  }

  private downgrade(current: QualityTier): QualityTier {
    const order: QualityTier[] = ['ultra', 'high', 'medium', 'low', 'static'];
    const idx = order.indexOf(current);
    return order[Math.min(idx + 1, order.length - 1)];
  }

  private upgrade(current: QualityTier): QualityTier {
    const order: QualityTier[] = ['ultra', 'high', 'medium', 'low', 'static'];
    const idx = order.indexOf(current);
    return order[Math.max(idx - 1, 0)];
  }

  private getConfig(tier: QualityTier): AdaptiveConfig {
    const configs: Record<QualityTier, AdaptiveConfig> = {
      ultra: {
        qualityTier: 'ultra',
        particleCount: 30000,
        shadowEnabled: true,
        textureResolution: 'full',
        antialias: true,
        postProcessing: true,
      },
      high: {
        qualityTier: 'high',
        particleCount: 20000,
        shadowEnabled: true,
        textureResolution: 'full',
        antialias: true,
        postProcessing: true,
      },
      medium: {
        qualityTier: 'medium',
        particleCount: 10000,
        shadowEnabled: false,
        textureResolution: 'half',
        antialias: false,
        postProcessing: false,
      },
      low: {
        qualityTier: 'low',
        particleCount: 4000,
        shadowEnabled: false,
        textureResolution: 'quarter',
        antialias: false,
        postProcessing: false,
      },
      static: {
        qualityTier: 'static',
        particleCount: 0,
        shadowEnabled: false,
        textureResolution: 'quarter',
        antialias: false,
        postProcessing: false,
      },
    };
    return configs[tier];
  }

  private detectGPU(): 'high' | 'medium' | 'low' {
    if (typeof document === 'undefined') return 'medium';

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return 'low';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'medium';

    const renderer = gl.getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL
    ) as string;

    if (/Apple M[34]|RTX|RX 7\d00|Arc A\d00/i.test(renderer)) return 'high';
    if (/Intel|Mali-4|Adreno 5/i.test(renderer)) return 'low';
    return 'medium';
  }
}
