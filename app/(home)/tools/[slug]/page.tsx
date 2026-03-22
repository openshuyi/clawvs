import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTool, tools } from '@/lib/site-data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) {
    return {};
  }
  return {
    title: `${tool.name} 档案 | Claw VS`,
    description: tool.summary,
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/10 via-transparent to-orange-400/10 p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Tool Intelligence</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{tool.name}</h1>
        <p className="text-base text-zinc-200">{tool.tagline}</p>
        <p className="max-w-4xl text-sm leading-7 text-zinc-300">{tool.summary}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5 md:col-span-2">
          <h2 className="text-lg font-semibold text-white">避坑指南</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {tool.pitfalls.map((pitfall) => (
              <li key={pitfall} className="rounded-md border border-white/10 bg-white/3 px-3 py-2">
                {pitfall}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
          <h2 className="text-lg font-semibold text-white">部署与网络</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{tool.deployment}</p>
          <p className="mt-3 text-sm text-zinc-300">GFW 兼容：{tool.gfwStatus}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {tool.connectivity.map((item) => (
              <span key={item} className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-cyan-100">
                {item}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
          <h2 className="text-lg font-semibold text-white">性能实测</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-md border border-white/10 bg-white/3 p-3">
              <p className="text-zinc-400">成功率</p>
              <p className="mt-1 text-xl font-semibold text-cyan-200">{tool.benchmark.successRate}%</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/3 p-3">
              <p className="text-zinc-400">平均耗时</p>
              <p className="mt-1 text-xl font-semibold text-cyan-200">{tool.benchmark.avgDurationMin}m</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/3 p-3">
              <p className="text-zinc-400">重试次数</p>
              <p className="mt-1 text-xl font-semibold text-cyan-200">{tool.benchmark.retries}</p>
            </div>
          </div>
        </article>
        <article className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
          <h2 className="text-lg font-semibold text-white">社区热度</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>GitHub Stars：{tool.community.stars}</p>
            <p>最新版本：{tool.community.release}</p>
            <p>趋势：{tool.community.trend}</p>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
        <h2 className="text-lg font-semibold text-white">用户口碑雷达</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(tool.rating).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-zinc-300">
                <span>{key}</span>
                <span>{value.toFixed(1)}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-orange-300" style={{ width: `${value * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
