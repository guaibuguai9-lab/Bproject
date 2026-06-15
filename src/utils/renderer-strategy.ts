'use client';

import type { RenderBackend } from '@/types/scene';

/**
 * 检测 WebGPU 支持并创建对应的渲染器
 * WebGPU 优先、WebGL 兜底
 */
export async function detectRendererBackend(): Promise<{
  backend: RenderBackend;
  supportsWebGPU: boolean;
}> {
  if (typeof navigator === 'undefined') {
    return { backend: 'webgl', supportsWebGPU: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ('gpu' in navigator) {
    try {
      const gpu = (navigator as any).gpu;
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        return { backend: 'webgpu', supportsWebGPU: true };
      }
    } catch {
      console.warn('[PDD Portal] WebGPU init failed, falling back to WebGL');
    }
  }

  return { backend: 'webgl', supportsWebGPU: false };
}

/**
 * GPU 性能启发式检测
 */
export function detectGPUTier(): 'high' | 'medium' | 'low' {
  if (typeof document === 'undefined') return 'medium';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 'medium';

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

  if (/Apple M[34]|RTX|RX 7\d00|Arc A\d00/i.test(renderer)) return 'high';
  if (/Intel|Mali-4|Adreno 5/i.test(renderer)) return 'low';
  return 'medium';
}
