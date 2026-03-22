import type { Metadata } from 'next';
import { ToolCatalog } from '@/components/site/tool-catalog';

export const metadata: Metadata = {
  title: 'Tool Intelligence | Claw VS',
  description: '查看 OpenClaw 及竞品的深度档案、避坑建议与实测表现。',
};

export default function ToolsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="ui-kicker text-xs">Tool Intelligence</p>
        <h1 className="ui-title text-3xl font-semibold md:text-4xl">深度档案库</h1>
        <p className="ui-subtitle max-w-4xl text-sm leading-7 md:text-base">
          支持关键词搜索、开源闭源筛选、国内外生态筛选。每个工具都提供独立详情页用于深入评估。
        </p>
      </header>
      <ToolCatalog />
    </div>
  );
}
