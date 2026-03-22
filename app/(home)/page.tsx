import Link from 'next/link';
import { ComparisonArena } from '@/components/site/comparison-arena';
import { gfwMatrix, promptSimulation, siteStats, tools } from '@/lib/site-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claw VS | AI Agent 对比竞技场',
  description: '聚焦 OpenClaw 与主流 AI Agent 的结构化对比、实测数据与场景推荐。',
};

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-10 md:px-8 md:py-14">
      <section className="ui-panel-strong rounded-2xl p-6 md:p-10">
        <p className="ui-kicker text-xs">The Arena</p>
        <h1 className="ui-title mt-3 text-3xl font-semibold md:text-5xl">不要盲目测试，直接看 Claw VS。</h1>
        <p className="ui-subtitle mt-4 max-w-3xl text-sm leading-7 md:text-base">
          在 AI Agent 百花齐放的时代，我们提供证据驱动的对比与推荐：从权限、模型、部署到网络兼容性，帮助你在几分钟内完成技术选型。
        </p>
        <div className="ui-panel mt-6 grid gap-2 rounded-xl p-4 text-xs md:grid-cols-2 md:text-sm">
          {siteStats.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/arena"
            className="ui-btn-cyan rounded-md px-4 py-2 text-sm font-medium transition hover:brightness-110"
          >
            进入对比竞技场
          </Link>
          <Link
            href="/choose"
            className="ui-btn-orange rounded-md px-4 py-2 text-sm font-medium transition hover:brightness-110"
          >
            开始智选问答
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="ui-title text-2xl font-semibold">核心对比面板</h2>
          <Link href="/arena" className="text-sm text-accent-cyan transition hover:brightness-110">
            查看完整版 →
          </Link>
        </div>
        <ComparisonArena compact />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="ui-panel rounded-xl p-5">
          <h3 className="ui-title text-lg font-semibold">GFW 兼容性报告</h3>
          <div className="mt-4 space-y-2 text-sm">
            {gfwMatrix.map((item) => (
              <div key={item.name} className="ui-panel rounded-md p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-text-primary">{item.name}</p>
                  <span className="rounded px-2 py-0.5 text-xs text-accent-orange">{item.status}</span>
                </div>
                <p className="ui-muted mt-1">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ui-panel rounded-xl p-5">
          <h3 className="ui-title text-lg font-semibold">Prompt-to-Claw 模拟器</h3>
          <p className="ui-subtitle mt-2 text-sm">示例指令：{promptSimulation.prompt}</p>
          <div className="mt-4 space-y-3">
            {promptSimulation.outputs.map((item) => (
              <div key={item.tool} className="ui-panel rounded-md p-3">
                <p className="text-sm font-medium text-accent-cyan">{item.tool}</p>
                <p className="ui-subtitle mt-1 font-mono text-xs">{item.command}</p>
                <p className="ui-muted mt-2 text-xs">风险提示：{item.risk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="ui-title text-2xl font-semibold">热门工具档案</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.slice(0, 3).map((tool) => (
            <article key={tool.slug} className="ui-panel rounded-xl p-5 ui-card-hover">
              <p className="text-xs uppercase tracking-wider text-accent-cyan">{tool.name}</p>
              <h3 className="ui-title mt-2 text-lg font-semibold">{tool.tagline}</h3>
              <p className="ui-muted mt-2 text-sm leading-6">{tool.summary}</p>
              <Link
                href={`/tools/${tool.slug}`}
                className="mt-4 inline-flex text-sm font-medium text-accent-orange transition hover:brightness-110"
              >
                查看深度档案 →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="ui-panel rounded-xl p-5">
        <h2 className="ui-title text-2xl font-semibold">四大模块入口</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            { href: '/arena', label: 'The Arena', desc: '动态对比矩阵与差异过滤' },
            { href: '/tools', label: 'Tool Intelligence', desc: '每个工具的实测档案与避坑建议' },
            { href: '/choose', label: 'Help Me Choose', desc: '问答式快速推荐卡片' },
            { href: '/log', label: 'The Log', desc: 'AI Agent 行业变化追踪' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ui-panel rounded-md p-3 transition hover:border-accent-cyan ui-card-hover"
            >
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="ui-muted mt-1 text-xs">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="ui-panel-strong rounded-xl p-5 text-sm">
        <p className="font-medium text-accent-orange">SEO 核心词</p>
        <p className="mt-2 text-text-primary">
          OpenClaw alternatives · AI Agent comparison · OpenInterpreter vs OpenClaw · Anthropic Computer Use vs OpenClaw
        </p>
      </section>
      <p className="ui-muted text-xs">
        数据说明：社区热度与实测指标会持续更新，推荐结果仅作为技术评估起点。
      </p>
      <p className="ui-muted text-xs">
        文档中心仍可在
        <Link href="/docs" className="mx-1 text-accent-cyan hover:brightness-110">
          /docs
        </Link>{' '}
        查看。
      </p>
    </div>
  );
}
