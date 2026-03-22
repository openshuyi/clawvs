import type { Metadata } from 'next';
import Link from 'next/link';
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
      <header className="ui-panel-strong space-y-4 rounded-none p-8">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
          <p className="ui-kicker text-xs font-mono tracking-widest">System.Profile // {tool.slug}</p>
        </div>
        <h1 className="ui-title text-4xl font-bold tracking-wide md:text-5xl uppercase">{tool.name}</h1>
        <p className="text-accent-cyan text-lg font-mono tracking-wide">{tool.tagline}</p>
        <p className="ui-subtitle max-w-4xl text-sm leading-7">{tool.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs pt-2">
          <span className="ui-chip px-3 py-1 font-mono uppercase bg-accent-orange-soft text-accent-orange border-accent-orange/30">{tool.primaryCategory}</span>
          <span className="ui-chip px-3 py-1 font-mono uppercase">{tool.sourceType}</span>
          <span className="ui-chip px-3 py-1 font-mono uppercase">{tool.region}</span>
          <span className="ui-chip px-3 py-1 font-mono uppercase">{tool.vendor}</span>
          <span className="ui-chip px-3 py-1 font-mono uppercase">{tool.pricing}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs pt-1">
          {tool.tags.map((tag) => (
            <span key={tag} className="ui-chip px-2 py-1 font-mono text-text-muted">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="ui-panel ui-card-hover rounded-none p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-orange font-mono">[{'!'}]</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">避坑指南_PITFALLS</h2>
          </div>
          <ul className="ui-subtitle space-y-3 text-sm">
            {tool.pitfalls.map((pitfall) => (
              <li key={pitfall} className="flex items-start gap-3 ui-panel rounded-none px-4 py-3 bg-bg-surface/50 border-border-color/30 transition-colors hover:border-accent-orange/50 hover:bg-accent-orange-soft/10">
                <span className="text-accent-orange font-mono mt-0.5">{'>'}</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="ui-panel ui-card-hover rounded-none p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-cyan font-mono">{'//'}</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">产品信息_INFO</h2>
          </div>
          <div className="space-y-3 font-mono text-xs ui-subtitle">
            <div className="flex justify-between border-b border-border-color/20 pb-2">
              <span className="text-text-muted">VENDOR</span>
              <span className="text-text-primary text-right">{tool.vendor}</span>
            </div>
            <div className="flex justify-between border-b border-border-color/20 pb-2">
              <span className="text-text-muted">LICENSE</span>
              <span className="text-text-primary text-right">{tool.license}</span>
            </div>
            <div className="flex justify-between border-b border-border-color/20 pb-2">
              <span className="text-text-muted">PRICING</span>
              <span className="text-text-primary text-right">{tool.pricing}</span>
            </div>
            <div className="flex justify-between border-b border-border-color/20 pb-2">
              <span className="text-text-muted">STARS</span>
              <span className="text-text-primary text-right">{tool.githubStars === null ? '-' : tool.githubStars.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-text-muted">LANG</span>
              <span className="text-text-primary text-right">{tool.primaryLanguage ?? '-'}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.homepageUrl ? (
              <Link
                href={tool.homepageUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-btn-cyan inline-flex rounded-none px-4 py-2 text-xs font-mono uppercase tracking-wider"
              >
                [ 官网_WEBSITE ]
              </Link>
            ) : null}
            {tool.githubUrl ? (
              <Link
                href={tool.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-btn-cyan inline-flex rounded-none px-4 py-2 text-xs font-mono uppercase tracking-wider"
              >
                [ GITHUB ]
              </Link>
            ) : null}
            {tool.docsUrl ? (
              <Link
                href={tool.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-btn-cyan inline-flex rounded-none px-4 py-2 text-xs font-mono uppercase tracking-wider"
              >
                [ 文档_DOCS ]
              </Link>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="ui-panel ui-card-hover rounded-none p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-cyan font-mono">{'//'}</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">部署与网络_DEPLOYMENT</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">ENVIRONMENT</p>
              <p className="ui-subtitle text-sm leading-6 ui-panel p-3 bg-bg-surface/50 border-border-color/30">{tool.deployment}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted mb-1">GFW_STATUS</p>
              <p className="ui-subtitle text-sm ui-panel p-3 bg-bg-surface/50 border-border-color/30">
                <span className={tool.gfwStatus.includes('直连') ? 'text-accent-cyan' : 'text-accent-orange'}>
                  [{tool.gfwStatus}]
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-text-muted mb-2">CONNECTIVITY</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {tool.connectivity.map((item) => (
                  <span key={item} className="ui-chip px-3 py-1 font-mono bg-bg-surface/50 border-border-color/30 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
        <article className="ui-panel ui-card-hover rounded-none p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-cyan font-mono">{'//'}</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">典型场景_SCENARIOS</h2>
          </div>
          <ul className="space-y-2">
            {tool.scenarios.map((item) => (
              <li key={item} className="ui-chip px-3 py-2 text-sm flex items-center gap-2 border-border-color/30 bg-bg-surface/50 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors">
                <span className="text-accent-cyan text-xs">{'*'}</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="ui-panel ui-card-hover rounded-none p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-cyan font-mono">{'//'}</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">性能实测_BENCHMARK</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="ui-panel rounded-none p-4 bg-bg-surface/50 border-border-color/30 flex flex-col items-center justify-center transition-colors hover:border-accent-cyan/50 hover:bg-accent-cyan-soft/10">
              <p className="ui-muted font-mono text-xs mb-2">SUCCESS_RATE</p>
              <p className="text-2xl font-bold text-accent-cyan">{tool.benchmark.successRate}<span className="text-sm ml-1">%</span></p>
            </div>
            <div className="ui-panel rounded-none p-4 bg-bg-surface/50 border-border-color/30 flex flex-col items-center justify-center transition-colors hover:border-accent-cyan/50 hover:bg-accent-cyan-soft/10">
              <p className="ui-muted font-mono text-xs mb-2">AVG_DURATION</p>
              <p className="text-2xl font-bold text-accent-cyan">{tool.benchmark.avgDurationMin}<span className="text-sm ml-1">m</span></p>
            </div>
            <div className="ui-panel rounded-none p-4 bg-bg-surface/50 border-border-color/30 flex flex-col items-center justify-center transition-colors hover:border-accent-cyan/50 hover:bg-accent-cyan-soft/10">
              <p className="ui-muted font-mono text-xs mb-2">RETRIES</p>
              <p className="text-2xl font-bold text-accent-cyan">{tool.benchmark.retries}</p>
            </div>
          </div>
        </article>
        <article className="ui-panel ui-card-hover rounded-none p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-border-color/30 pb-2">
            <span className="text-accent-cyan font-mono">{'//'}</span>
            <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">社区热度_COMMUNITY</h2>
          </div>
          <div className="space-y-4 font-mono text-xs ui-subtitle">
            <div className="flex justify-between items-center ui-panel p-3 bg-bg-surface/50 border-border-color/30 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan">
              <span className="text-text-muted">STARS</span>
              <span className="text-text-primary text-base font-semibold">{tool.community.stars}</span>
            </div>
            <div className="flex justify-between items-center ui-panel p-3 bg-bg-surface/50 border-border-color/30 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan">
              <span className="text-text-muted">RELEASE</span>
              <span className="text-text-primary text-base font-semibold">{tool.community.release}</span>
            </div>
            <div className="flex justify-between items-center ui-panel p-3 bg-bg-surface/50 border-border-color/30 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan">
              <span className="text-text-muted">TREND</span>
              <span className="text-accent-cyan text-base font-semibold">{tool.community.trend}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="ui-panel ui-card-hover rounded-none p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-border-color/30 pb-2">
          <span className="text-accent-cyan font-mono">{'//'}</span>
          <h2 className="ui-title text-lg font-semibold font-mono tracking-wide">用户口碑雷达_RATING</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(tool.rating).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="ui-subtitle flex items-center justify-between text-xs font-mono">
                <span className="uppercase tracking-widest">{key}</span>
                <span className="text-accent-cyan font-semibold">{(value as number).toFixed(1)} / 10</span>
              </div>
              <div className="h-1.5 rounded-none bg-bg-surface-strong/50 border border-border-color/30 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-accent-cyan shadow-[0_0_10px_var(--accent-cyan)] transition-all duration-1000"
                  style={{ width: `${(value as number) * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
