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
  // Use a tiny inline script to check localStorage/cookie before Hydration
  // to prevent FOUC (Flash of Unstyled Content) while keeping the site fully static
  const themeScript = `
    (function() {
      try {
        var match = document.cookie.match(new RegExp('(^| )clawvs-theme=([^;]+)'));
        var theme = match ? match[2] : 'dark';
        if (theme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.style.colorScheme = 'light';
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn('font-sans dark', geist.variable)} data-theme="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg-base text-text-primary" suppressHydrationWarning>
        <RootProvider theme={{ defaultTheme: 'dark', forcedTheme: undefined, attribute: 'class' }}>{children}</RootProvider>
      </body>
    </html>
  );
}
