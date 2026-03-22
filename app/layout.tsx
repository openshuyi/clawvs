import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

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
    <html lang="zh-CN" className={`${inter.className} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[#121212]">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
