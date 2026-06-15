'use client';

import { useEffect, useRef, useState } from 'react';

interface CTACardData {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const CTA_DATA: CTACardData[] = [
  {
    title: '商家入驻',
    description: '立即入驻，连接 9 亿消费者与全球市场',
    href: '/merchant',
    icon: '🏪',
  },
  {
    title: '投资者关系',
    description: '查看财报、SEC 文件与公司治理信息',
    href: '/investor',
    icon: '📊',
  },
  {
    title: '新闻中心',
    description: '了解拼多多最新动态与行业洞察',
    href: '/news',
    icon: '📰',
  },
];

/**
 * CTA 转化卡片 — Scene 4 核心商业转化区
 */
export const CTACards: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="navigation"
      aria-label="服务入口导航"
      className="cta-grid grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4"
    >
      {CTA_DATA.map((card, index) => (
        <a
          key={card.href}
          href={card.href}
          className={`
            cta-card group relative block p-8 rounded-2xl
            border border-white/10 bg-white/[0.03]
            backdrop-blur-md
            transition-all duration-500 ease-out
            no-underline text-left
            hover:border-[#E02D1C]
            hover:shadow-[0_0_32px_rgba(224,45,28,0.15)]
            hover:-translate-y-1
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[#E02D1C]/40
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
          style={{
            transitionDelay: isVisible ? `${index * 0.1}s` : '0s',
          }}
        >
          {/* 图标 */}
          <span className="text-4xl mb-4 block" aria-hidden="true">
            {card.icon}
          </span>

          {/* 标题 */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E02D1C] transition-colors">
            {card.title}
          </h3>

          {/* 描述 */}
          <p className="text-sm text-white/50 font-light leading-relaxed mb-6">
            {card.description}
          </p>

          {/* 箭头 */}
          <span
            className="inline-flex items-center text-[#E02D1C] text-sm font-semibold
                       group-hover:translate-x-1 transition-transform duration-200"
          >
            立即探索
            <span className="ml-1" aria-hidden="true">
              →
            </span>
          </span>

          {/* Hover 发光效果 */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                       transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(224,45,28,0.06) 0%, transparent 70%)',
            }}
          />
        </a>
      ))}
    </div>
  );
};
