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
    <div className="min-h-screen text-[color:var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[color:var(--border-color)] bg-[color:color-mix(in_oklab,var(--bg-surface)_90%,transparent)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[0.08em]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--accent-cyan)] bg-[color:var(--accent-cyan-soft)] text-[color:var(--accent-cyan)]">
              CV
            </span>
            <span>Claw VS</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-[color:var(--text-secondary)] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative transition hover:text-[color:var(--accent-cyan)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[color:var(--accent-cyan)] after:transition-all hover:after:w-full"
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
      <footer className="mt-16 border-t border-[color:var(--border-color)] bg-[color:color-mix(in_oklab,var(--bg-surface)_78%,transparent)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-[color:var(--text-muted)] md:px-8">
          <p>本站由 AI 驱动，人类监督。</p>
          <p>数据持续更新，结论基于公开信息与标准化实测流程。</p>
        </div>
      </footer>
    </div>
  );
}
