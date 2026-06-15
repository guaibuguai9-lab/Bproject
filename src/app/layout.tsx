import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '拼多多 — 科技赋能农业 · 连接全球供应链',
  description:
    '拼多多（Pinduoduo）是世界领先的农业科技与跨境电商平台。旗下 Temu 已覆盖 90+ 国家和地区，服务全球 5.3 亿月活用户。商家入驻、投资者关系、新闻中心一站直达。',
  keywords: [
    '拼多多',
    'Pinduoduo',
    'Temu',
    '农业科技',
    '跨境电商',
    '多多农研',
    '商家入驻',
    '投资者关系',
  ],
  openGraph: {
    title: '拼多多 — 科技赋能农业 · 连接全球供应链',
    description: '探索拼多多的农业科技与全球供应链网络。',
    type: 'website',
    locale: 'zh_CN',
    siteName: '拼多多',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
