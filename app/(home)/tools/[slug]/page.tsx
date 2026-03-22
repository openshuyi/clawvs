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
      <header className="ui-panel-strong space-y-3 rounded-2xl p-6">
        <p className="ui-kicker text-xs">Tool Intelligence</p>
        <h1 className="ui-title text-3xl font-semibold md:text-4xl">{tool.name}</h1>
        <p className="ui-subtitle text-base">{tool.tagline}</p>
        <p className="ui-subtitle max-w-4xl text-sm leading-7">{tool.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="ui-chip rounded px-2 py-1">{tool.primaryCategory}</span>
          <span className="ui-chip rounded px-2 py-1">{tool.sourceType}</span>
          <span className="ui-chip rounded px-2 py-1">{tool.region}</span>
          <span className="ui-chip rounded px-2 py-1">{tool.vendor}</span>
          <span className="ui-chip rounded px-2 py-1">{tool.pricing}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {tool.tags.map((tag) => (
            <span key={tag} className="ui-chip rounded px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="ui-panel rounded-xl p-5 md:col-span-2">
          <h2 className="ui-title text-lg font-semibold">避坑指南</h2>
          <ul className="ui-subtitle mt-3 space-y-2 text-sm">
            {tool.pitfalls.map((pitfall) => (
              <li key={pitfall} className="ui-panel rounded-md px-3 py-2">
                {pitfall}
              </li>
            ))}
          </ul>
        </article>
        <article className="ui-panel rounded-xl p-5">
          <h2 className="ui-title text-lg font-semibold">产品信息</h2>
          <p className="ui-subtitle mt-3 text-sm">厂商：{tool.vendor}</p>
          <p className="ui-subtitle mt-2 text-sm">授权：{tool.license}</p>
          <p className="ui-subtitle mt-2 text-sm">定价：{tool.pricing}</p>
          <p className="ui-subtitle mt-2 text-sm">GitHub Stars：{tool.githubStars === null ? '-' : tool.githubStars.toLocaleString('en-US')}</p>
          <p className="ui-subtitle mt-2 text-sm">主要语言：{tool.primaryLanguage ?? '-'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={tool.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="ui-btn-cyan inline-flex rounded-md px-3 py-1.5 text-xs"
            >
              官网
            </Link>
            {tool.githubUrl ? (
              <Link
                href={tool.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-btn-cyan inline-flex rounded-md px-3 py-1.5 text-xs"
              >
                GitHub
              </Link>
            ) : null}
            {tool.docsUrl ? (
              <Link
                href={tool.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-btn-cyan inline-flex rounded-md px-3 py-1.5 text-xs"
              >
                文档
              </Link>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="ui-panel rounded-xl p-5 md:col-span-2">
          <h2 className="ui-title text-lg font-semibold">部署与网络</h2>
          <p className="ui-subtitle mt-3 text-sm leading-6">{tool.deployment}</p>
          <p className="ui-subtitle mt-3 text-sm">GFW 兼容：{tool.gfwStatus}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {tool.connectivity.map((item) => (
              <span key={item} className="ui-chip rounded px-2 py-1">
                {item}
              </span>
            ))}
          </div>
        </article>
        <article className="ui-panel rounded-xl p-5">
          <h2 className="ui-title text-lg font-semibold">典型场景</h2>
          <ul className="mt-3 space-y-2">
            {tool.scenarios.map((item) => (
              <li key={item} className="ui-chip rounded px-2 py-1 text-xs">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="ui-panel rounded-xl p-5">
          <h2 className="ui-title text-lg font-semibold">性能实测</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="ui-panel rounded-md p-3">
              <p className="ui-muted">成功率</p>
              <p className="mt-1 text-xl font-semibold text-accent-cyan">{tool.benchmark.successRate}%</p>
            </div>
            <div className="ui-panel rounded-md p-3">
              <p className="ui-muted">平均耗时</p>
              <p className="mt-1 text-xl font-semibold text-accent-cyan">{tool.benchmark.avgDurationMin}m</p>
            </div>
            <div className="ui-panel rounded-md p-3">
              <p className="ui-muted">重试次数</p>
              <p className="mt-1 text-xl font-semibold text-accent-cyan">{tool.benchmark.retries}</p>
            </div>
          </div>
        </article>
        <article className="ui-panel rounded-xl p-5">
          <h2 className="ui-title text-lg font-semibold">社区热度</h2>
          <div className="ui-subtitle mt-3 space-y-2 text-sm">
            <p>GitHub Stars：{tool.community.stars}</p>
            <p>最新版本：{tool.community.release}</p>
            <p>趋势：{tool.community.trend}</p>
          </div>
        </article>
      </section>

      <section className="ui-panel rounded-xl p-5">
        <h2 className="ui-title text-lg font-semibold">用户口碑雷达</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(tool.rating).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="ui-subtitle flex items-center justify-between text-sm">
                <span>{key}</span>
                <span>{(value as number).toFixed(1)}</span>
              </div>
              <div className="h-2 rounded-full bg-border-color">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-orange"
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
