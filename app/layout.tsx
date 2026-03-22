import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://clawvs.dev'),
  title: {
    default: 'Claw VS',
    template: '%s | Claw VS',
  },
  description: 'OpenClaw 与主流 AI Agent 的对比、实测与选型平台。',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
