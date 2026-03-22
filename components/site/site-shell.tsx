import Link from 'next/link';
import { ThemeToggle } from '@/components/site/theme-toggle';

const navItems = [
  { href: '/', label: 'Arena' },
  { href: '/tools', label: 'Tool Intelligence' },
  { href: '/choose', label: 'Help Me Choose' },
  { href: '/log', label: 'The Log' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-text-primary">
      <header className="sticky top-0 z-50 border-b border-border-color bg-bg-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/" className="group flex items-center gap-2 text-lg font-semibold tracking-[0.08em]">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-accent-cyan bg-accent-cyan-soft text-accent-cyan shadow-[0_0_8px_color-mix(in_oklab,var(--accent-cyan)_50%,transparent)] transition-all group-hover:bg-accent-cyan group-hover:text-bg-main group-hover:shadow-[0_0_15px_var(--accent-cyan)]">
              CV
            </span>
            <span className="uppercase tracking-widest text-text-primary transition-colors group-hover:text-accent-cyan">
              Claw<span className="text-accent-orange">VS</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-text-secondary md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative transition hover:text-accent-cyan after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent-cyan after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/tools"
              className="ui-btn-cyan rounded-md px-3 py-1.5 text-xs font-medium transition hover:brightness-110"
            >
              搜索工具
            </Link>
            <Link
              href="/log"
              className="ui-btn-orange rounded-md px-3 py-1.5 text-xs font-medium transition hover:brightness-110"
            >
              行业动态
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t border-border-color bg-bg-surface/75 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-text-muted md:px-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-accent-cyan">System.Status: Online</span>
          </div>
          <p>本站由 AI 驱动，人类监督。</p>
          <p>数据持续更新，结论基于公开信息与标准化实测流程。</p>
        </div>
      </footer>
    </div>
  );
}
