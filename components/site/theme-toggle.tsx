'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const cookieKey = 'clawvs-theme';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getCookieTheme(): ThemeMode | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + cookieKey + '=([^;]+)'));
  if (match) return match[2] as ThemeMode;
  return null;
}

function setCookieTheme(theme: ThemeMode) {
  document.cookie = `${cookieKey}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Read from cookie first, fallback to system
    const stored = getCookieTheme();
    const resolved = stored ?? getSystemTheme();
    setTheme(resolved);
    applyTheme(resolved);
    setReady(true);
  }, []);

  function onToggle() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    setCookieTheme(next);
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="ui-chip inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition hover:bg-bg-subtle hover:text-text-primary"
      aria-label={ready ? `切换到${theme === 'dark' ? '浅色' : '深色'}主题` : '切换主题'}
      title={ready ? `切换到${theme === 'dark' ? '浅色' : '深色'}主题` : '切换主题'}
    >
      {ready ? (
        theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />
      ) : (
        <span className="w-4 h-4" /> // placeholder to prevent layout shift
      )}
    </button>
  );
}
