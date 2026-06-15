'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

/**
 * 数字滚动统计卡片 — Scene 3 Temu 数据展示
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
}) => {
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
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        stat-card text-center p-6 rounded-2xl
        border border-white/10 bg-white/[0.03]
        backdrop-blur-sm
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      <span className="block text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
        {prefix}
        <span className="text-[#E02D1C]">{value}</span>
        {suffix}
      </span>
      <span className="text-sm md:text-base text-white/50 font-light">
        {label}
      </span>
    </div>
  );
};
