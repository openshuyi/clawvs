import type { Metadata } from 'next';
import { ComparisonArena } from '@/components/site/comparison-arena';
import { siteStats } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'The Arena | Claw VS',
  description: 'OpenClaw 与主流 AI Agent 的动态对比矩阵。',
};

export default function ArenaPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="ui-kicker text-xs">The Arena</p>
        <h1 className="ui-title text-3xl font-semibold md:text-4xl">动态对比矩阵</h1>
        <p className="ui-subtitle max-w-4xl text-sm leading-7 md:text-base">
          聚焦权限、连接性、模型兼容、部署难度与离线能力五大维度，支持多工具对照和差异过滤。
        </p>
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          {siteStats.map((item) => (
            <span key={item} className="ui-chip rounded px-2 py-1">
              {item}
            </span>
          ))}
        </div>
      </header>
      <ComparisonArena />
    </div>
  );
}
