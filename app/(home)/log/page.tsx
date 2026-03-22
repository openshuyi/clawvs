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
        <p className="ui-kicker text-xs">The Log</p>
        <h1 className="ui-title text-3xl font-semibold md:text-4xl">更新日志与行业观察</h1>
        <p className="ui-subtitle max-w-4xl text-sm leading-7 md:text-base">
          聚焦对选型有直接影响的变更：新能力、兼容性变化、发布节奏和建议动作。
        </p>
      </header>
      <section className="space-y-4">
        {logItems.map((item) => (
          <article key={item.title} className="ui-panel rounded-xl p-5">
            <div className="ui-muted flex flex-wrap items-center gap-2 text-xs">
              <span className="ui-chip rounded px-2 py-0.5">{item.category}</span>
              <span>{item.date}</span>
            </div>
            <h2 className="ui-title mt-3 text-xl font-semibold">{item.title}</h2>
            <p className="ui-subtitle mt-2 text-sm">影响：{item.impact}</p>
            <p className="ui-muted mt-1 text-sm">建议动作：{item.action}</p>
          </article>
        ))}
      </section>
      <div className="ui-panel-strong rounded-xl p-4 text-sm">
        <p className="font-medium text-accent-orange">自动化运营建议</p>
        <p className="mt-2">
          可以用 OpenClaw 监控竞品仓库 Release，一旦有更新自动生成解读卡，并在此页发布。
        </p>
        <Link href="/arena" className="mt-3 inline-flex text-sm font-medium text-accent-cyan hover:brightness-110">
          回到对比竞技场 →
        </Link>
      </div>
    </div>
  );
}
