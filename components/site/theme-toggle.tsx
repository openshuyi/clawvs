'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const storageKey = 'clawvs-theme';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeToggle() {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeMode | null;
    const resolved = stored ?? getSystemTheme();
    setTheme(resolved);
    applyTheme(resolved);
    setReady(true);
  }, []);

  function onToggle() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(storageKey, next);
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="ui-chip inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-xs font-medium transition hover:brightness-110"
      aria-label={ready ? `切换到${theme === 'dark' ? '浅色' : '深色'}主题` : '切换主题'}
    >
      {ready && theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      <span>{ready ? (theme === 'dark' ? '浅色' : '深色') : '主题'}</span>
    </button>
  );
}
