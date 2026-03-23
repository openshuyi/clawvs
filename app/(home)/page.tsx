import Link from 'next/link';
import { ComparisonArena } from '@/components/site/comparison-arena';
import { gfwMatrix, promptSimulation, siteStats, tools } from '@/lib/site-data';
import type { Metadata } from 'next';
import { ChevronRight, Sparkles, Activity, Search, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Claw VS | AI Agent 对比竞技场',
  description: '聚焦 OpenClaw 与主流 AI Agent 的结构化对比、实测数据与场景推荐。',
};

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-10 md:px-8 md:py-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-10 pb-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--accent-cyan-soft),transparent_50%)] opacity-50 blur-3xl"></div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-sm text-accent-cyan mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Sparkles className="size-4" />
          <span>全新升级：3D 工具图谱现已上线</span>
          <Link href="/graph" className="ml-1 flex items-center font-semibold hover:underline">
            立即体验 <ChevronRight className="size-3" />
          </Link>
        </div>
        <h1 className="ui-title text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl max-w-4xl drop-shadow-sm">
          不要盲目测试，<br className="md:hidden" />
          直接看 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500">Claw VS</span>。
        </h1>
        <p className="ui-subtitle mt-6 max-w-2xl text-base md:text-lg leading-relaxed">
          在 AI Agent 百花齐放的时代，我们提供证据驱动的对比与推荐：从权限、模型、部署到网络兼容性，帮助你在几分钟内完成技术选型。
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/arena"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-accent-cyan px-8 py-3.5 font-semibold text-bg-main transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
          >
            <span className="mr-2">进入对比竞技场</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/choose"
            className="group inline-flex items-center justify-center rounded-lg border border-border-color bg-bg-surface px-8 py-3.5 font-semibold text-text-primary transition-all hover:border-accent-orange hover:bg-accent-orange/5 hover:text-accent-orange hover:shadow-[0_0_20px_rgba(255,60,0,0.15)]"
          >
            开始智选问答
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {siteStats.map((item, i) => {
            const icons = [<Activity key="1"/>, <Database key="2"/>, <Search key="3"/>, <Sparkles key="4"/>];
            return (
              <div key={item} className="ui-panel flex flex-col items-center justify-center rounded-2xl p-4 text-center">
                <div className="text-accent-cyan mb-2 opacity-80">{icons[i % icons.length]}</div>
                <p className="text-sm font-medium text-text-secondary">{item}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Arena Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-border-color pb-4">
          <div>
            <h2 className="ui-title text-2xl md:text-3xl font-bold">核心对比面板</h2>
            <p className="ui-subtitle mt-1 text-sm">全维度解析各大 Agent 能力差异</p>
          </div>
          <Link href="/arena" className="group flex items-center text-sm font-medium text-accent-cyan transition hover:brightness-110">
            查看完整版 <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="rounded-xl overflow-hidden shadow-2xl border border-border-color">
          <ComparisonArena compact />
        </div>
      </section>

      {/* Dual Panels Section */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="ui-panel-strong rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-accent-orange/20 p-2 text-accent-orange">
              <Activity className="size-5" />
            </div>
            <h3 className="ui-title text-xl font-bold">GFW 兼容性报告</h3>
          </div>
          <div className="space-y-3">
            {gfwMatrix.map((item) => (
              <div key={item.name} className="ui-panel rounded-xl p-4 transition-all hover:-translate-y-1 hover:border-accent-orange/50">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${
                    item.status === '需要代理' || item.status === '强依赖海外服务' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' : 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="ui-muted mt-2 text-sm">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ui-panel rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-accent-cyan/20 p-2 text-accent-cyan">
              <Database className="size-5" />
            </div>
            <h3 className="ui-title text-xl font-bold">Prompt-to-Claw 模拟器</h3>
          </div>
          <div className="mb-6 rounded-lg bg-bg-surface-strong p-3 border border-border-color">
            <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">User Input</p>
            <p className="text-sm font-medium text-text-primary">"{promptSimulation.prompt}"</p>
          </div>
          <div className="space-y-4">
            {promptSimulation.outputs.map((item) => (
              <div key={item.tool} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-border-color last:before:bottom-auto last:before:h-2">
                <div className="absolute left-0 top-2 size-4 rounded-full border-2 border-bg-main bg-accent-cyan"></div>
                <div className="ui-panel rounded-xl p-4 transition-all hover:border-accent-cyan/50">
                  <p className="text-sm font-bold text-accent-cyan">{item.tool}</p>
                  <div className="mt-2 rounded bg-bg-surface-strong p-2 font-mono text-xs text-text-secondary">
                    {item.command}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">Risk Level</span>
                    <span className="text-xs font-medium text-accent-orange">{item.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-border-color pb-4">
          <div>
            <h2 className="ui-title text-2xl md:text-3xl font-bold">热门工具档案</h2>
            <p className="ui-subtitle mt-1 text-sm">深入了解顶尖 Agent 的架构与能力</p>
          </div>
          <Link href="/tools" className="group flex items-center text-sm font-medium text-accent-cyan transition hover:brightness-110">
            浏览全部 <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {tools.slice(0, 3).map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="ui-panel rounded-2xl p-6 ui-card-hover group flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">
                  {tool.name}
                </p>
                <div className="text-text-muted transition-colors group-hover:text-accent-cyan">
                  <ChevronRight className="size-5" />
                </div>
              </div>
              <h3 className="ui-title text-xl font-bold leading-tight">{tool.tagline}</h3>
              <p className="ui-muted mt-3 text-sm leading-relaxed flex-grow">{tool.summary}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded-full border border-border-color text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="ui-panel rounded-2xl p-8 bg-gradient-to-b from-bg-surface to-bg-main relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-64 bg-accent-orange/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="ui-title text-2xl font-bold mb-8 text-center relative z-10">快速探索四大模块</h2>

        <div className="grid gap-4 md:grid-cols-4 relative z-10">
          {[
            { href: '/arena', label: 'The Arena', desc: '动态对比矩阵与差异过滤', icon: <Database className="size-5 mb-2 text-accent-cyan" /> },
            { href: '/tools', label: 'Tool Intelligence', desc: '每个工具的实测档案与避坑建议', icon: <Activity className="size-5 mb-2 text-accent-orange" /> },
            { href: '/choose', label: 'Help Me Choose', desc: '问答式快速推荐卡片', icon: <Search className="size-5 mb-2 text-accent-cyan" /> },
            { href: '/log', label: 'The Log', desc: 'AI Agent 行业变化追踪', icon: <Sparkles className="size-5 mb-2 text-accent-orange" /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ui-panel rounded-xl p-5 transition-all hover:border-accent-cyan ui-card-hover group flex flex-col items-center text-center bg-bg-surface/50"
            >
              {item.icon}
              <p className="text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors">{item.label}</p>
              <p className="ui-muted mt-2 text-xs leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4 border-t border-border-color pt-8">
        <section className="ui-panel-strong rounded-xl p-5 text-sm flex-1 w-full">
          <p className="font-medium text-accent-orange flex items-center gap-2"><Sparkles className="size-4"/> SEO 核心词</p>
          <p className="mt-2 text-text-primary text-xs leading-relaxed opacity-80">
            OpenClaw alternatives · AI Agent comparison · OpenInterpreter vs OpenClaw · Anthropic Computer Use vs OpenClaw
          </p>
        </section>
        
        <div className="flex-1 w-full space-y-2 text-right">
          <p className="ui-muted text-xs">
            数据说明：社区热度与实测指标会持续更新，推荐结果仅作为技术评估起点。
          </p>
          <p className="ui-muted text-xs">
            文档中心仍可在
            <Link href="/docs" className="mx-1 font-medium text-accent-cyan hover:underline">
              /docs
            </Link>{' '}
            查看。
          </p>
        </div>
      </div>
    </div>
  );
}
