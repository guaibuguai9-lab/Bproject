# 拼多多 3D 沉浸式企业门户 &mdash; Pinduoduo 3D Corporate Portal

> **技术栈**: Next.js 16 + React 19 + TypeScript + Three.js 0.174 + React Three Fiber 9
> **设计理念**: Scroll-driven 叙事，以"有机算法的粒子罗盘"为全站核心隐喻

---

## ? 快速开始

### 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | 18.x | 推荐使用 20.x LTS |
| **npm** | 9.x | 随 Node.js 自带 |

### 第一步：安装依赖

打开终端（PowerShell / CMD），进入项目根目录：

```bash
cd vibeCoding
npm install
```

安装过程约 1-3 分钟，取决于网络速度。

### 第二步：启动开发服务器

**Windows PowerShell 用户：**

```bash
.\start.bat
```

**macOS / Linux 用户，或 Windows CMD：**

```bash
npm run dev
```

### 第三步：打开浏览器

浏览器访问：

```
http://localhost:3000
```

> ? 如果端口 3000 被占用，Next.js 会自动使用 3001、3002... 注意查看终端输出。

---

## ? 项目结构

```
vibeCoding/
├── docs/
│   └── proposal.md                  # 原始技术提案文档（终面汇报）
├── public/
│   └── favicon.ico                  # 网站图标
├── src/
│   ├── app/                         # Next.js App Router 页面
│   │   ├── layout.tsx               # 根布局（SEO metadata、zh-CN）
│   │   ├── page.tsx                 # 主页（4 场景 Scroll-driven）
│   │   └── globals.css              # 品牌色彩体系 + UI/3D 分层样式
│   ├── components/
│   │   ├── canvas/                  # R3F 3D 渲染组件
│   │   │   ├── scene-root.tsx       # 3D 场景根节点（灯光/背景/星空）
│   │   │   ├── three-canvas.tsx     # Canvas 容器组件（WebGL 渲染器）
│   │   │   ├── camera-rig.tsx       # 相机运动系统（4 关键帧平滑插值）
│   │   │   ├── particle-compass.tsx # Scene 1: 20,000+ 粒子罗盘核心
│   │   │   ├── farm-grid.tsx        # Scene 2: 40x60 参数化农田网格
│   │   │   ├── point-cloud-globe.tsx# Scene 3: 8,000 点 Fibonacci 球面地球
│   │   │   └── supply-chain-flows.tsx # Scene 3: 全球供应链粒子光流
│   │   ├── ui/                      # DOM UI 组件（覆盖在 3D 层之上）
│   │   │   ├── header-nav.tsx       # 顶部导航栏（fixed，5 个入口）
│   │   │   ├── side-nav.tsx         # 右侧场景圆点导航（4 场景指示器）
│   │   │   ├── cta-cards.tsx        # Scene 4 CTA 转化卡片
│   │   │   ├── stat-card.tsx        # 数据统计卡片（数字滚动）
│   │   │   └── scroll-progress.tsx  # 底部滚动进度条（品牌色渐变）
│   │   └── shared/                  # 共享/通用组件
│   │       ├── loading-screen.tsx   # 加载过渡动画
│   │       └── fallback-content.tsx # No-JS 降级内容（SEO 兜底）
│   ├── hooks/
│   │   └── use-scroll-engine.ts     # Lenis + GSAP ScrollTrigger 滚屏引擎
│   ├── stores/
│   │   └── scene-store.ts           # Zustand 全局状态管理
│   ├── types/
│   │   └── scene.d.ts              # TypeScript 类型定义
│   └── utils/
│       ├── adaptive-quality.ts      # 自适应画质引擎（5 档动态降级）
│       ├── dispose.ts               # GPU 资源回收工具
│       └── renderer-strategy.ts     # WebGPU / WebGL 双后端检测
├── start.bat                        # Windows 一键启动脚本
├── package.json                     # 项目依赖配置
└── tsconfig.json                    # TypeScript 配置
```

---

## ? 4 大场景说明

### Scene 1: 首页 Hero &mdash; 粒子罗盘

- **视觉**: 20,000+ 粒子通过引力算法形成旋转罗盘，品牌红核心 + 农业绿螺旋 + 全球蓝网状分布
- **动画**: Logo 分层浮现（延迟 0.3s / 0.6s），罗盘自动旋转 + 有机呼吸
- **交互**: 向下滚动 cue 指示器

### Scene 2: 农业数字化 &mdash; 农田网格

- **视觉**: 40 x 60 参数化网格，Y 轴按 Simplex Noise 起伏，随滚动从灰色生长为农业绿
- **数据**: 五届农研大赛、18 省份 AI 种植、40%+ GMV 年增速
- **叙事**: "甘愿将短期利润转化为对农业科技的投资" — 范洁真

### Scene 3: Temu 全球化 &mdash; 点云地球

- **视觉**: 8,000 点 Fibonacci 球面分布地球 + 90 国家光环 + 3,000 供应链光流
- **数据**: 90+ 国家、5.3 亿 MAU、12 亿+ 下载
- **技术**: 大圆航线弧线插值 + Curl Noise 扰动

### Scene 4: 商家生态 &mdash; CTA 转化层

- **过渡**: 3D 粒子密度线性衰减至 0，Canvas 背景模糊 20px
- **入口**: 商家入驻 / 投资者关系 / 新闻中心 三列 CTA 卡片
- **交互**: 品牌红 Hover 发光 + 上浮动画

---

## ? 色彩体系

| 用途 | 色值 | 应用场景 |
|------|------|---------|
| 品牌红 | `#E02D1C` | 算法核心、CTA 按钮、活跃态标识 |
| 农业绿 | `#00AA6C` | 农田粒子、数据上行、可持续叙事 |
| 全球蓝 | `#1A73E8` | 供应链网络、跨境节点、Temu 品牌 |
| 粒子白 | `#F5F5F5` | 环境粒子、过渡区、中性辅助 |
| 科技灰 | `#2D2D2D` | UI 面板底色、深度层级 |
| 背景深黑 | `#0A0A0A` | 全局画布背景 |

---

## ? 技术架构

### 渲染管线

```
用户浏览器
    │
    ├── DOM 层 (z-index: 10-30)
    │   ├── Header Nav（position: fixed, z=30）
    │   ├── Side Nav  右侧圆点导航 (z=30)
    │   ├── Scroll Content 语义化 HTML (z=10)
    │   └── CTA Cards Scene 4 转化区 (z=20)
    │
    └── Canvas 3D 层 (z-index: 1)
        ├── WebGL 渲染器（WebGPU 优先 / WebGL 兜底）
        ├── 4 场景 Camera Rig 关键帧插值
        ├── 粒子系统 (Points + InstancedMesh)
        └── 后处理（背景渐变 + 星空粒子）
```

### 状态管理 & 数据流

```
用户滚动
    │
    ▼
Lenis（平滑滚动）
    │
    ├──────────────────────► GSAP ScrollTrigger
    │                            │
    │                            ▼
    │                    Zustand Scene Store
    │                            │
    │              ┌─────────────┼─────────────┐
    │              ▼             ▼              ▼
    │         CameraRig    3D Components   UI Components
    │         (相机运动)   (粒子/网格/地球)  (导航/CTA/进度条)
    │
    └──────────────────────► DOM scroll offset
```

### 性能优化策略

| 层级 | 方案 | 目标 |
|------|------|------|
| 几何 LOD | BatchedMesh + InstancedMesh 批量渲染 | -80% Draw Calls |
| 视锥裁剪 | Frustum Culling 场景显隐 | GPU 负载 -50% |
| 按需渲染 | `frameloop="demand"` 空闲 GPU 零占用 | 省电/降发热 |
| 自适应降级 | 5 档画质（ultra ? static），FPS 监控自动切换 | 低端机 ? 30fps |
| 内存管理 | 场景切换 `dispose()` 链式清理 | 零内存泄漏 |
| 资源优化 | 粒子纹理 Canvas 程序化生成 | 零外部依赖 |

---

## ? 构建与部署

### 生产构建

```bash
npm run build
```

构建产物位于 `.next/` 目录，输出示例：

```
Route (app)
? ? /
? ? /_not-found
?  (Static)  prerendered as static content
```

### 本地预览生产版本

```bash
npm run start
```

### 部署到服务器 / CDN

`.next/` 目录 + `public/` 目录 + `package.json` 即可运行。部署步骤：

```bash
# 1. 拷贝文件到服务器
# 2. 安装生产依赖
npm install --omit=dev

# 3. 启动
npm run start
```

### Vercel 一键部署

项目使用 Next.js App Router，可直接关联 GitHub 仓库到 [Vercel](https://vercel.com) 一键部署，零配置。

---

## ? 浏览器兼容性

| 浏览器 | 最低版本 | 状态 |
|--------|---------|------|
| Chrome | 90+ | ? 完全支持（WebGPU 需 113+） |
| Edge | 90+ | ? 完全支持 |
| Firefox | 90+ | ? 完全支持（WebGL Fallback） |
| Safari | 15+ | ? 完全支持（WebGL Fallback） |
| Mobile Chrome | 90+ | ? 自适应画质 |
| Mobile Safari | 15+ | ? 自适应画质 |

---

## ? 辅助功能

- ? 语义化 HTML5 标签（`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`）
- ? ARIA 标签（`aria-label`, `aria-current`, `role`）
- ? No-JS 降级内容（`<noscript>` 包裹的核心导航）
- ? 键盘导航支持（`focus-visible` 样式）
- ? `prefers-reduced-motion` 响应
- ? Open Graph / Twitter Card meta 标签
- ? `application/ld+json` 结构化数据

---

## ? 维护与二次开发

### 修改粒子数量

编辑 `src/utils/adaptive-quality.ts` 中的 `configs` 对象：

```typescript
ultra:  { particleCount: 30000, ... },
high:   { particleCount: 20000, ... },
medium: { particleCount: 10000, ... },
```

### 修改品牌色

编辑 `src/app/globals.css` 中的 CSS 变量：

```css
:root {
  --pdd-red: #E02D1C;
  --pdd-agri-green: #00AA6C;
  --pdd-global-blue: #1A73E8;
}
```

### 添加新场景

1. 在 `src/types/scene.d.ts` 的 `SceneId` 里添加新场景标识
2. 在 `src/stores/scene-store.ts` 的 `sceneProgress` 里添加进度键
3. 在 `src/components/canvas/scene-root.tsx` 里添加新的 3D 组件
4. 在 `src/app/page.tsx` 里添加 `<section>` 和对应的 DOM 内容
5. 在 `src/components/ui/side-nav.tsx` 的 `SCENE_DOTS` 里添加导航项

### 调试技巧

```typescript
// 在浏览器控制台查看当前状态
const store = useSceneStore.getState();
console.log(store.activeScene, store.globalScrollProgress);

// 打印当前 FPS
console.log(store.currentFPS);

// 查看画质等级
console.log(store.qualityTier);
```

---

## ? 致谢

- **3D 渲染**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **滚动引擎**: [Lenis](https://lenis.studiofreight.com/) + [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- **状态管理**: [Zustand](https://docs.pmnd.rs/zustand)
- **前端框架**: [Next.js](https://nextjs.org/) + [React](https://react.dev/)
- **字体**: System UI (零外部字体依赖)
