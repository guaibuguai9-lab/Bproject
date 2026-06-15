'use client';

import dynamic from 'next/dynamic';
import { HeaderNav } from '@/components/ui/header-nav';
import { SideNav } from '@/components/ui/side-nav';
import { CTACards } from '@/components/ui/cta-cards';
import { StatCard } from '@/components/ui/stat-card';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { FallbackContent } from '@/components/shared/fallback-content';
import { useScrollEngine } from '@/hooks/use-scroll-engine';
import { useSceneStore } from '@/stores/scene-store';

// 动态导入 3D Canvas — 关闭 SSR，避免 hydration 不匹配
const ThreeCanvas = dynamic(
  () =>
    import('@/components/canvas/three-canvas').then((mod) => ({
      default: mod.ThreeCanvas,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function HomePage() {
  // 初始化滚屏引擎（Lenis + GSAP ScrollTrigger）
  useScrollEngine();

  return (
    <>
      {/* ===== 加载屏幕 ===== */}
      <LoadingScreen />

      {/* ===== No-JS Fallback (noscript 包裹) ===== */}
      <FallbackContent />

      {/* ===== 3D Canvas 背景层 ===== */}
      <ThreeCanvas />

      {/* ===== 顶部导航 (z=30) ===== */}
      <HeaderNav />

      {/* ===== 右侧场景圆点导航 (z=30) ===== */}
      <SideNav />

      {/* ===== 左侧品牌水印 ===== */}
      <aside
        aria-hidden="true"
        className="
          fixed left-6 md:left-10 bottom-32 z-20
          hidden md:flex flex-col items-center gap-1
          pointer-events-none select-none
        "
      >
        <span
          className="
            text-[10rem] md:text-[14rem] font-black leading-none
            text-white/[0.03] tracking-tighter
          "
          style={{ writingMode: 'vertical-rl' }}
        >
          PDD
        </span>
      </aside>

      {/* ===== 滚动进度条 (z=30) ===== */}
      <ScrollProgress />

      {/* ===== 主内容 DOM 层 (z=10) ===== */}
      <main className="scroll-content">
        {/* ============================================
            Scene 1: 首页 Hero — 粒子罗盘
            ============================================ */}
        <section
          id="scene-hero"
          className="scene-section"
          aria-label="企业愿景"
        >
          <div className="hero-content text-center max-w-3xl mx-auto">
            {/* Slogan Layer 1 */}
            <h1 className="hero-title text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
              拼<span className="text-[#E02D1C]">多多</span>
            </h1>

            {/* Slogan Layer 2 — 缓入延迟 */}
            <p className="hero-slogan text-xl md:text-2xl text-white/70 font-light mb-2 animate-fade-in-up">
              科技赋能 · 全球连接
            </p>

            {/* Slogan Layer 3 — 更晚缓入 */}
            <p className="hero-slogan-en text-base md:text-lg text-white/40 font-light animate-fade-in-up-delayed">
              Tech for Agri · Global for All
            </p>

            {/* Scroll Cue: 向下滚动探索 */}
            <div className="scroll-cue mt-16">
              <span className="text-white/30 text-sm font-light">
                向下滚动探索
              </span>
              <div className="mt-2 w-5 h-8 mx-auto border border-white/20 rounded-full flex justify-center">
                <span className="block w-1 h-2 bg-white/40 rounded-full mt-1 animate-scroll-dot" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            Scene 2: 农业数字化 — 农田网格
            ============================================ */}
        <section
          id="scene-agriculture"
          className="scene-section"
          aria-label="农业数字化"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              科技赋能<span className="text-[#00AA6C]">农业</span>
            </h2>

            {/* 数据亮点 */}
            <div
              className="stats flex flex-wrap justify-center gap-6 mb-12"
              role="list"
            >
              <div className="stat-item text-center" role="listitem">
                <strong className="block text-3xl md:text-4xl font-bold text-white">
                  五届
                </strong>
                <span className="text-sm text-white/50">
                  多多农研科技大赛
                </span>
              </div>
              <div className="stat-item text-center" role="listitem">
                <strong className="block text-3xl md:text-4xl font-bold text-[#00AA6C]">
                  18 个
                </strong>
                <span className="text-sm text-white/50">
                  AI 种植模型覆盖省份
                </span>
              </div>
              <div className="stat-item text-center" role="listitem">
                <strong className="block text-3xl md:text-4xl font-bold text-white">
                  40%+
                </strong>
                <span className="text-sm text-white/50">
                  农产品上行 GMV 年增速
                </span>
              </div>
            </div>

            {/* 引用 */}
            <blockquote
              className="text-center border-l-0 italic text-white/60 max-w-2xl mx-auto"
              cite="https://example.com/pdd-agri-speech-2025"
            >
              <p className="text-lg md:text-xl leading-relaxed">
                &ldquo;甘愿将短期利润转化为对农业科技、人才与产业链的持久投资&rdquo;
              </p>
              <footer className="mt-4 text-sm text-white/40 not-italic">
                <cite>— 范洁真，2025 世界互联网大会</cite>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ============================================
            Scene 3: Temu 全球化 — 点云地球
            ============================================ */}
        <section
          id="scene-temu"
          className="scene-section"
          aria-label="Temu 全球供应链"
        >
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Temu · <span className="text-[#1A73E8]">多多跨境</span>
            </h2>
            <p className="text-center text-white/40 mb-12 max-w-xl mx-auto">
              重新定义全球供应链 — 中国制造直达全球家庭
            </p>

            {/* 数据卡片网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <StatCard value="90+" label="覆盖国家与地区" />
              <StatCard value="5.3亿" label="全球月活用户" />
              <StatCard value="12亿+" label="累计下载量" />
            </div>

            <div className="text-center text-white/30 text-sm font-light max-w-lg mx-auto">
              <p>
                截至 2025 年，Temu 已覆盖全球 90+ 国家和地区，月活跃用户突破
                5.3 亿，累计下载量超 12 亿次。
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            Scene 4: CTA 转化层 — 商家生态入口
            ============================================ */}
        <section
          id="scene-ecosystem"
          className="scene-section scene-cta"
          aria-label="商家与服务入口"
        >
          <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              加入拼多多<span className="text-[#E02D1C]">生态</span>
            </h2>
            <p className="text-white/40 mb-12 max-w-lg mx-auto">
              无论您是商家、投资者还是合作伙伴，这里都有您的位置
            </p>

            <CTACards />
          </div>
        </section>

        {/* ===== 页脚 ===== */}
        <footer
          role="contentinfo"
          className="relative z-20 py-8 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; 2026 Pinduoduo Inc. All rights reserved.
            </p>
            <nav aria-label="底部导航" className="flex gap-6">
              <a
                href="/privacy"
                className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline"
              >
                隐私政策
              </a>
              <a
                href="/terms"
                className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline"
              >
                服务条款
              </a>
              <a
                href="/contact"
                className="text-xs text-white/30 hover:text-white/60 transition-colors no-underline"
              >
                联系我们
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
