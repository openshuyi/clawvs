'use client';

import { useMemo, useState } from 'react';
import { arenaToolOrder, comparisonRows, tools, type ToolSlug } from '@/lib/site-data';

const toolNameMap = Object.fromEntries(tools.map((tool) => [tool.slug, tool.name])) as Record<ToolSlug, string>;

export function ComparisonArena({ compact = false }: { compact?: boolean }) {
  const [selectedTools, setSelectedTools] = useState<ToolSlug[]>(arenaToolOrder);
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

  function toggleTool(slug: ToolSlug) {
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
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0f0f0f]/90 p-4 md:p-5">
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
                    ? 'border-cyan-400/70 bg-cyan-400/20 text-cyan-100'
                    : 'border-white/20 bg-transparent text-zinc-300 hover:border-cyan-300/60'
                }`}
              >
                {toolNameMap[slug]}
              </button>
            );
          })}
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={showDiffOnly}
            onChange={(event) => setShowDiffOnly(event.target.checked)}
            className="h-4 w-4 rounded border-white/30 bg-transparent accent-orange-400"
          />
          仅显示差异项
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0d0d0d]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-white/5 text-zinc-200">
            <tr>
              <th className="min-w-[180px] border-b border-white/10 px-4 py-3 font-semibold">维度</th>
              <th className="min-w-[220px] border-b border-white/10 px-4 py-3 font-semibold">说明</th>
              {selectedTools.map((tool) => (
                <th key={tool} className="min-w-[180px] border-b border-white/10 px-4 py-3 font-semibold text-cyan-200">
                  {toolNameMap[tool]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(compact ? rows.slice(0, 5) : rows).map((row) => (
              <tr key={row.label} className="align-top">
                <td className="border-b border-white/10 px-4 py-3 font-medium text-zinc-100">{row.label}</td>
                <td className="border-b border-white/10 px-4 py-3 text-zinc-400">{row.detail}</td>
                {selectedTools.map((tool) => (
                  <td key={`${row.label}-${tool}`} className="border-b border-white/10 px-4 py-3 text-zinc-200">
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
