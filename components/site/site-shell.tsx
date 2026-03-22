import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Arena' },
  { href: '/tools', label: 'Tool Intelligence' },
  { href: '/choose', label: 'Help Me Choose' },
  { href: '/log', label: 'The Log' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e1e1e_0%,#121212_35%,#0b0b0b_100%)] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101010]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cyan-400/70 bg-cyan-400/10 text-cyan-300">
              CV
            </span>
            <span>Claw VS</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-200 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-cyan-300">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/tools"
              className="rounded-md border border-cyan-400/40 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:border-cyan-300"
            >
              搜索工具
            </Link>
            <Link
              href="/log"
              className="rounded-md border border-orange-400/50 bg-orange-400/10 px-3 py-1.5 text-xs font-medium text-orange-200 transition hover:bg-orange-400/20"
            >
              提交新工具
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 bg-[#0c0c0c]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-zinc-400 md:px-8">
          <p>本站由 AI 驱动，人类监督。</p>
          <p>数据持续更新，结论基于公开信息与标准化实测流程。</p>
        </div>
      </footer>
    </div>
  );
}
