import Link from 'next/link';
import type { Metadata } from 'next';
import { logItems } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'The Log | Claw VS',
  description: '追踪 AI Agent 领域的重要版本更新、生态变化与应对建议。',
};

export default function LogPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">The Log</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">更新日志与行业观察</h1>
        <p className="max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
          聚焦对选型有直接影响的变更：新能力、兼容性变化、发布节奏和建议动作。
        </p>
      </header>
      <section className="space-y-4">
        {logItems.map((item) => (
          <article key={item.title} className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="rounded border border-white/15 px-2 py-0.5">{item.category}</span>
              <span>{item.date}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">影响：{item.impact}</p>
            <p className="mt-1 text-sm text-zinc-400">建议动作：{item.action}</p>
          </article>
        ))}
      </section>
      <div className="rounded-xl border border-orange-400/30 bg-orange-400/8 p-4 text-sm text-zinc-200">
        <p className="font-medium text-orange-100">自动化运营建议</p>
        <p className="mt-2">
          可以用 OpenClaw 监控竞品仓库 Release，一旦有更新自动生成解读卡，并在此页发布。
        </p>
        <Link href="/arena" className="mt-3 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">
          回到对比竞技场 →
        </Link>
      </div>
    </div>
  );
}
