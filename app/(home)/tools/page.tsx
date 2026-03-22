import Link from 'next/link';
import type { Metadata } from 'next';
import { tools } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Tool Intelligence | Claw VS',
  description: '查看 OpenClaw 及竞品的深度档案、避坑建议与实测表现。',
};

export default function ToolsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Tool Intelligence</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">深度档案库</h1>
        <p className="max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
          每个工具页面包含避坑指南、性能实测、社区热度与评分雷达，帮助你把单点参数转化为可执行决策。
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <article key={tool.slug} className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">{tool.name}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{tool.tagline}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{tool.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
              <span className="rounded border border-white/15 px-2 py-1">部署：{tool.deployment}</span>
              <span className="rounded border border-white/15 px-2 py-1">网络：{tool.gfwStatus}</span>
            </div>
            <Link
              href={`/tools/${tool.slug}`}
              className="mt-4 inline-flex rounded-md border border-orange-400/60 bg-orange-400/15 px-3 py-2 text-sm font-medium text-orange-100 transition hover:bg-orange-400/25"
            >
              进入档案
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
