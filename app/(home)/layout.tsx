import { SiteShell } from '@/components/site/site-shell';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
