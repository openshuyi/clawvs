'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { primaryCategories, toolTags, tools } from '@/lib/site-data';

type SourceFilter = '全部' | '开源' | '闭源';
type RegionFilter = '全部' | '国内' | '海外' | '全球';
type CategoryFilter = '全部' | (typeof primaryCategories)[number];
type TagFilter = '全部' | (typeof toolTags)[number];
type ViewMode = 'card' | 'list';
type SortBy = '默认' | '名称 A-Z' | '成功率高到低' | 'Stars 高到低' | '综合评分高到低';
type ToolItem = (typeof tools)[number];

export function ToolCatalog() {
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('全部');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('全部');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('全部');
  const [tagFilter, setTagFilter] = useState<TagFilter>('全部');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [sortBy, setSortBy] = useState<SortBy>('默认');
  const [tableSorting, setTableSorting] = useState<SortingState>([]);

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const visibleTools = tools.filter((tool) => {
      const matchSource = sourceFilter === '全部' || tool.sourceType === sourceFilter;
      const matchRegion = regionFilter === '全部' || tool.region === regionFilter;
      const matchCategory = categoryFilter === '全部' || tool.primaryCategory === categoryFilter;
      const matchTag = tagFilter === '全部' || tool.tags.includes(tagFilter);
      const matchKeyword =
        keyword.length === 0 ||
        `${tool.name} ${tool.tagline} ${tool.summary} ${tool.vendor} ${tool.focus} ${tool.scenarios.join(' ')} ${tool.tags.join(' ')}`.toLowerCase().includes(keyword);
      return matchSource && matchRegion && matchCategory && matchTag && matchKeyword;
    });
    if (sortBy === '名称 A-Z') {
      return [...visibleTools].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === '成功率高到低') {
      return [...visibleTools].sort((a, b) => b.benchmark.successRate - a.benchmark.successRate);
    }
    if (sortBy === 'Stars 高到低') {
      return [...visibleTools].sort((a, b) => (b.githubStars ?? -1) - (a.githubStars ?? -1));
    }
    if (sortBy === '综合评分高到低') {
      return [...visibleTools].sort((a, b) => {
        const aScore = (a.rating.security + a.rating.speed + a.rating.flexibility + a.rating.stability + a.rating.docs) / 5;
        const bScore = (b.rating.security + b.rating.speed + b.rating.flexibility + b.rating.stability + b.rating.docs) / 5;
        return bScore - aScore;
      });
    }
    return visibleTools;
  }, [categoryFilter, query, regionFilter, sortBy, sourceFilter, tagFilter]);

  function clearFilters() {
    setQuery('');
    setSourceFilter('全部');
    setRegionFilter('全部');
    setCategoryFilter('全部');
    setTagFilter('全部');
    setSortBy('默认');
    setTableSorting([]);
  }

  const hasActiveFilters =
    query.trim().length > 0 ||
    sourceFilter !== '全部' ||
    regionFilter !== '全部' ||
    categoryFilter !== '全部' ||
    tagFilter !== '全部' ||
    sortBy !== '默认' ||
    tableSorting.length > 0;

  const columns = useMemo<ColumnDef<ToolItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '工具',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="ui-title truncate text-sm font-semibold">{row.original.name}</p>
            <p className="ui-muted mt-1 line-clamp-1 text-xs">{row.original.tagline}</p>
          </div>
        ),
      },
      {
        accessorKey: 'primaryCategory',
        header: '主分类',
        cell: ({ row }) => <span className="ui-chip rounded px-2 py-1 text-xs">{row.original.primaryCategory}</span>,
      },
      {
        accessorKey: 'sourceType',
        header: '类型',
        cell: ({ row }) => <span className="ui-chip rounded px-2 py-1 text-xs">{row.original.sourceType}</span>,
      },
      {
        accessorKey: 'region',
        header: '地区',
        cell: ({ row }) => <span className="ui-chip rounded px-2 py-1 text-xs">{row.original.region}</span>,
      },
      {
        id: 'successRate',
        accessorFn: (tool) => tool.benchmark.successRate,
        header: '成功率',
        cell: ({ row }) => <span className="ui-chip rounded px-2 py-1 text-xs">{row.original.benchmark.successRate}%</span>,
      },
      {
        id: 'githubStars',
        accessorFn: (tool) => tool.githubStars ?? -1,
        header: 'Stars',
        cell: ({ row }) => (
          <span className="ui-chip rounded px-2 py-1 text-xs">
            {row.original.githubStars === null ? '-' : row.original.githubStars.toLocaleString('en-US')}
          </span>
        ),
      },
      {
        id: 'primaryLanguage',
        accessorFn: (tool) => tool.primaryLanguage ?? '',
        header: 'Language',
        cell: ({ row }) => <span className="ui-chip rounded px-2 py-1 text-xs">{row.original.primaryLanguage ?? '-'}</span>,
      },
      {
        id: 'links',
        header: '链接',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Link href={row.original.homepageUrl} target="_blank" rel="noreferrer" className="ui-btn-cyan rounded-md px-2 py-1">
              官网
            </Link>
            {row.original.githubUrl ? (
              <Link href={row.original.githubUrl} target="_blank" rel="noreferrer" className="ui-btn-cyan rounded-md px-2 py-1">
                GitHub
              </Link>
            ) : null}
            {row.original.docsUrl ? (
              <Link href={row.original.docsUrl} target="_blank" rel="noreferrer" className="ui-btn-cyan rounded-md px-2 py-1">
                文档
              </Link>
            ) : null}
          </div>
        ),
      },
      {
        id: 'profile',
        header: '档案',
        enableSorting: false,
        cell: ({ row }) => (
          <Link href={`/tools/${row.original.slug}`} className="ui-btn-orange rounded-md px-2.5 py-1 text-xs">
            查看
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredTools,
    columns,
    state: {
      sorting: tableSorting,
    },
    onSortingChange: setTableSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-4">
      <div className="ui-panel rounded-xl p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工具名、厂商、能力关键词..."
            className="rounded-md border border-[color:var(--border-color)] bg-transparent px-3 py-2 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          />
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
            className="rounded-md border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-secondary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          >
            <option value="全部">全部类型</option>
            <option value="开源">开源</option>
            <option value="闭源">闭源</option>
          </select>
          <select
            value={regionFilter}
            onChange={(event) => setRegionFilter(event.target.value as RegionFilter)}
            className="rounded-md border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-secondary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          >
            <option value="全部">全部地区</option>
            <option value="国内">国内</option>
            <option value="海外">海外</option>
            <option value="全球">全球</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}
            className="rounded-md border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-secondary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          >
            <option value="全部">全部主分类</option>
            {primaryCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value as TagFilter)}
            className="rounded-md border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-secondary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          >
            <option value="全部">全部标签</option>
            {toolTags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="rounded-md border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-secondary)] outline-none transition focus:border-[color:var(--accent-cyan)]"
          >
            <option value="默认">默认排序</option>
            <option value="名称 A-Z">名称 A-Z</option>
            <option value="成功率高到低">成功率高到低</option>
            <option value="Stars 高到低">Stars 高到低</option>
            <option value="综合评分高到低">综合评分高到低</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="ui-muted text-xs">当前结果：{filteredTools.length} / {tools.length}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${viewMode === 'card' ? 'ui-btn-cyan' : 'ui-chip'}`}
            >
              卡片
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${viewMode === 'list' ? 'ui-btn-cyan' : 'ui-chip'}`}
            >
              列表
            </button>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="ui-btn-cyan rounded-md px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
            >
              清空筛选
            </button>
          ) : null}
        </div>
      </div>

      {filteredTools.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTools.map((tool) => (
              <article key={tool.slug} className="ui-panel rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="ui-chip rounded px-2 py-1">{tool.sourceType}</span>
                  <span className="ui-chip rounded px-2 py-1">{tool.region}</span>
                  <span className="ui-chip rounded px-2 py-1">{tool.vendor}</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[color:var(--accent-cyan)]">{tool.name}</p>
                <h2 className="ui-title mt-2 text-xl font-semibold">{tool.tagline}</h2>
                <p className="ui-muted mt-2 text-sm leading-6">{tool.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="ui-chip rounded px-2 py-1">{tool.primaryCategory}</span>
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="ui-chip rounded px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="ui-chip rounded px-2 py-1">部署：{tool.deployment}</span>
                  <span className="ui-chip rounded px-2 py-1">网络：{tool.gfwStatus}</span>
                  <span className="ui-chip rounded px-2 py-1">Stars：{tool.githubStars === null ? '-' : tool.githubStars.toLocaleString('en-US')}</span>
                  <span className="ui-chip rounded px-2 py-1">Language：{tool.primaryLanguage ?? '-'}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Link
                    href={tool.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ui-btn-cyan inline-flex rounded-md px-2.5 py-1 transition hover:brightness-110"
                  >
                    官网
                  </Link>
                  {tool.githubUrl ? (
                    <Link
                      href={tool.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ui-btn-cyan inline-flex rounded-md px-2.5 py-1 transition hover:brightness-110"
                    >
                      GitHub
                    </Link>
                  ) : null}
                  {tool.docsUrl ? (
                    <Link
                      href={tool.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ui-btn-cyan inline-flex rounded-md px-2.5 py-1 transition hover:brightness-110"
                    >
                      文档
                    </Link>
                  ) : null}
                </div>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="ui-btn-orange mt-4 inline-flex rounded-md px-3 py-2 text-sm font-medium transition hover:brightness-110"
                >
                  进入档案
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="ui-panel overflow-x-auto rounded-xl">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[color:color-mix(in_oklab,var(--bg-surface-strong)_88%,transparent)] text-[color:var(--text-secondary)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border-b border-[color:var(--border-color)] px-4 py-3 font-semibold">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={() => header.column.toggleSorting(header.column.getIsSorted() === 'asc')}
                            className="inline-flex items-center gap-1 text-left transition hover:text-[color:var(--accent-cyan)]"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc'
                              ? '↑'
                              : header.column.getIsSorted() === 'desc'
                                ? '↓'
                                : ''}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border-b border-[color:var(--border-color)] px-4 py-3 text-[color:var(--text-secondary)]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="ui-panel rounded-xl p-6">
          <p className="ui-title text-base font-semibold">没有匹配结果</p>
          <p className="ui-muted mt-2 text-sm">尝试调整关键词，或者清空筛选条件查看全部产品。</p>
          <button
            type="button"
            onClick={clearFilters}
            className="ui-btn-cyan mt-4 rounded-md px-3 py-2 text-sm font-medium transition hover:brightness-110"
          >
            查看全部产品
          </button>
        </div>
      )}
    </section>
  );
}
