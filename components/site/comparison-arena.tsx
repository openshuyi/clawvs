'use client';

import { useMemo, useState } from 'react';
import { arenaToolOrder, comparisonRows, tools, type ArenaToolSlug } from '@/lib/site-data';

const toolNameMap = Object.fromEntries(tools.map((tool) => [tool.slug, tool.name])) as Record<ArenaToolSlug, string>;

export function ComparisonArena({ compact = false }: { compact?: boolean }) {
  const [selectedTools, setSelectedTools] = useState<ArenaToolSlug[]>([...arenaToolOrder]);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const rows = useMemo(() => {
    if (!showDiffOnly || selectedTools.length < 2) {
      return comparisonRows;
    }

    return comparisonRows.filter((row) => {
      const firstValue = row.values[selectedTools[0]];
      return selectedTools.some((tool) => row.values[tool] !== firstValue);
    });
  }, [selectedTools, showDiffOnly]);

  function toggleTool(slug: ArenaToolSlug) {
    setSelectedTools((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((item) => item !== slug);
      }
      return [...prev, slug];
    });
  }

  return (
    <section className="space-y-5">
      <div className="ui-panel flex flex-col gap-4 rounded-xl p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {arenaToolOrder.map((slug) => {
            const active = selectedTools.includes(slug);
            return (
              <button
                key={slug}
                type="button"
                onClick={() => toggleTool(slug)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'border-[color:var(--accent-cyan)] bg-[color:var(--accent-cyan-soft)] text-[color:var(--accent-cyan)]'
                    : 'border-[color:var(--border-color)] bg-transparent text-[color:var(--text-secondary)] hover:border-[color:var(--accent-cyan)]'
                }`}
              >
                {toolNameMap[slug]}
              </button>
            );
          })}
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
          <input
            type="checkbox"
            checked={showDiffOnly}
            onChange={(event) => setShowDiffOnly(event.target.checked)}
            className="h-4 w-4 rounded border-[color:var(--border-color)] bg-transparent accent-[color:var(--accent-orange)]"
          />
          仅显示差异项
        </label>
      </div>

      <div className="ui-panel overflow-x-auto rounded-xl">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[color:color-mix(in_oklab,var(--bg-surface-strong)_88%,transparent)] text-[color:var(--text-secondary)]">
            <tr>
              <th className="min-w-[180px] border-b border-[color:var(--border-color)] px-4 py-3 font-semibold">维度</th>
              <th className="min-w-[220px] border-b border-[color:var(--border-color)] px-4 py-3 font-semibold">说明</th>
              {selectedTools.map((tool) => (
                <th
                  key={tool}
                  className="min-w-[180px] border-b border-[color:var(--border-color)] px-4 py-3 font-semibold text-[color:var(--accent-cyan)]"
                >
                  {toolNameMap[tool]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(compact ? rows.slice(0, 5) : rows).map((row) => (
              <tr key={row.label} className="align-top">
                <td className="border-b border-[color:var(--border-color)] px-4 py-3 font-medium text-[color:var(--text-primary)]">
                  {row.label}
                </td>
                <td className="border-b border-[color:var(--border-color)] px-4 py-3 text-[color:var(--text-muted)]">{row.detail}</td>
                {selectedTools.map((tool) => (
                  <td
                    key={`${row.label}-${tool}`}
                    className="border-b border-[color:var(--border-color)] px-4 py-3 text-[color:var(--text-secondary)]"
                  >
                    {row.values[tool]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
