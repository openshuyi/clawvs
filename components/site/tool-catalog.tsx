'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { primaryCategories, toolTags, tools } from '@/lib/site-data';

type SourceFilter = '全部' | '开源' | '闭源';
type RegionFilter = '全部' | '国内' | '海外' | '全球';
type CategoryFilter = '全部' | (typeof primaryCategories)[number];
type TagFilter = '全部' | (typeof toolTags)[number];
type ViewMode = 'card' | 'list';
type SortBy = '默认' | '名称 A-Z' | '成功率高到低' | 'Stars 高到低' | '综合评分高到低';
type ToolItem = (typeof tools)[number];

function getSortIcon(state: false | 'asc' | 'desc') {
  if (state === 'asc') {
    return <ArrowUp className="size-3.5" />;
  }
  if (state === 'desc') {
    return <ArrowDown className="size-3.5" />;
  }
  return <ArrowUpDown className="size-3.5 opacity-60" />;
}

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
            <p className="truncate text-sm font-semibold">{row.original.name}</p>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{row.original.tagline}</p>
          </div>
        ),
      },
      {
        accessorKey: 'primaryCategory',
        header: '主分类',
        cell: ({ row }) => <Badge variant="outline">{row.original.primaryCategory}</Badge>,
      },
      {
        accessorKey: 'sourceType',
        header: '类型',
        cell: ({ row }) => <Badge variant="secondary">{row.original.sourceType}</Badge>,
      },
      {
        accessorKey: 'region',
        header: '地区',
        cell: ({ row }) => <Badge variant="outline">{row.original.region}</Badge>,
      },
      {
        id: 'successRate',
        accessorFn: (tool) => tool.benchmark.successRate,
        header: '成功率',
        cell: ({ row }) => <Badge variant="outline">{row.original.benchmark.successRate}%</Badge>,
      },
      {
        id: 'githubStars',
        accessorFn: (tool) => tool.githubStars ?? -1,
        header: 'Stars',
        cell: ({ row }) => (
          <Badge variant="outline">
            {row.original.githubStars === null ? '-' : row.original.githubStars.toLocaleString('en-US')}
          </Badge>
        ),
      },
      {
        id: 'primaryLanguage',
        accessorFn: (tool) => tool.primaryLanguage ?? '',
        header: 'Language',
        cell: ({ row }) => <Badge variant="outline">{row.original.primaryLanguage ?? '-'}</Badge>,
      },
      {
        id: 'links',
        header: '链接',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Link
              href={row.original.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'xs' }))}
            >
              官网
            </Link>
            {row.original.githubUrl ? (
              <Link
                href={row.original.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'xs' }))}
              >
                GitHub
              </Link>
            ) : null}
            {row.original.docsUrl ? (
              <Link
                href={row.original.docsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'xs' }))}
              >
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
          <Link href={`/tools/${row.original.slug}`} className={cn(buttonVariants({ size: 'xs' }))}>
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
    <section className="space-y-6">
      <div className="ui-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="ui-kicker">筛选与排序 {'//'} FILTERS</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ui-chip font-mono">
              MATCH: {filteredTools.length} / {tools.length}
            </Badge>
            {hasActiveFilters ? (
              <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="font-mono text-xs uppercase">
                [ CLEAR ]
              </Button>
            ) : null}
          </div>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工具名、厂商、能力关键词..."
            className="pl-9 font-mono rounded-none border-border/60 bg-transparent focus-visible:ring-accent-cyan"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5 font-mono text-sm">
          <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as SourceFilter)}>
            <SelectTrigger className="w-full rounded-none border-border/60 bg-transparent">
              <SelectValue placeholder="全部类型" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/60">
              <SelectItem value="全部">全部类型</SelectItem>
              <SelectItem value="开源">开源</SelectItem>
              <SelectItem value="闭源">闭源</SelectItem>
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value as RegionFilter)}>
            <SelectTrigger className="w-full rounded-none border-border/60 bg-transparent">
              <SelectValue placeholder="全部地区" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/60">
              <SelectItem value="全部">全部地区</SelectItem>
              <SelectItem value="国内">国内</SelectItem>
              <SelectItem value="海外">海外</SelectItem>
              <SelectItem value="全球">全球</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
            <SelectTrigger className="w-full rounded-none border-border/60 bg-transparent">
              <SelectValue placeholder="全部主分类" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/60">
              <SelectItem value="全部">全部主分类</SelectItem>
              {primaryCategories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={(value) => setTagFilter(value as TagFilter)}>
            <SelectTrigger className="w-full rounded-none border-border/60 bg-transparent">
              <SelectValue placeholder="全部标签" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/60">
              <SelectItem value="全部">全部标签</SelectItem>
              {toolTags.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-full rounded-none border-border/60 bg-transparent">
              <SelectValue placeholder="默认排序" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border/60">
              <SelectItem value="默认">默认排序</SelectItem>
              <SelectItem value="名称 A-Z">名称 A-Z</SelectItem>
              <SelectItem value="成功率高到低">成功率高到低</SelectItem>
              <SelectItem value="Stars 高到低">Stars 高到低</SelectItem>
              <SelectItem value="综合评分高到低">综合评分高到低</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/30">
          <div className="flex flex-wrap gap-2">
            <span className="ui-chip px-2 py-1 text-[10px] uppercase font-mono tracking-wider">VIEW: CARD / LIST</span>
          </div>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList className="rounded-none h-8 bg-transparent border border-border/60 p-0">
              <TabsTrigger value="card" className="rounded-none h-full data-[state=active]:bg-accent-cyan/10 data-[state=active]:text-accent-cyan data-[state=active]:border-b-2 data-[state=active]:border-b-accent-cyan">卡片</TabsTrigger>
              <TabsTrigger value="list" className="rounded-none h-full data-[state=active]:bg-accent-cyan/10 data-[state=active]:text-accent-cyan data-[state=active]:border-b-2 data-[state=active]:border-b-accent-cyan">列表</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTools.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTools.map((tool) => (
              <Card key={tool.slug} className="group relative overflow-hidden border-border bg-card/90 shadow-sm transition-all hover:border-accent-cyan hover:bg-card ui-card-hover">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-cyan/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-3 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">{tool.sourceType}</Badge>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-background">{tool.region}</Badge>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-background">{tool.vendor}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan">{tool.name}</p>
                    </div>
                    <h2 className="text-lg font-bold leading-snug tracking-wide group-hover:text-accent-cyan transition-colors">{tool.tagline}</h2>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{tool.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">{tool.primaryCategory}</Badge>
                    {tool.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="border-border/60 bg-background/50 text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border/50 pt-4 font-mono text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span className="opacity-70">DEPLOY</span>
                      <span className="text-foreground font-medium">{tool.deployment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">NETWORK</span>
                      <span className="text-foreground font-medium">{tool.gfwStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">STARS</span>
                      <span className="text-foreground font-medium">{tool.githubStars === null ? '-' : tool.githubStars.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">LANG</span>
                      <span className="text-foreground font-medium">{tool.primaryLanguage ?? '-'}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative flex-wrap justify-between gap-3 border-t border-border/50 bg-muted/30 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={tool.homepageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(buttonVariants({ variant: 'outline', size: 'xs' }), 'h-7 font-mono text-[10px] uppercase bg-background hover:border-accent-cyan hover:text-accent-cyan')}
                    >
                      [ 官网 ]
                    </Link>
                    {tool.githubUrl ? (
                      <Link
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants({ variant: 'outline', size: 'xs' }), 'h-7 font-mono text-[10px] uppercase bg-background hover:border-accent-cyan hover:text-accent-cyan')}
                      >
                        [ GitHub ]
                      </Link>
                    ) : null}
                    {tool.docsUrl ? (
                      <Link
                        href={tool.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants({ variant: 'outline', size: 'xs' }), 'h-7 font-mono text-[10px] uppercase bg-background hover:border-accent-cyan hover:text-accent-cyan')}
                      >
                        [ 文档 ]
                      </Link>
                    ) : null}
                  </div>
                  <Link href={`/tools/${tool.slug}`} className={cn(buttonVariants({ size: 'xs' }), 'ui-btn-cyan h-7 font-mono text-[10px] uppercase')}>
                    进入档案 {'>'}
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/60 bg-card/75 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 border-b border-border/60 px-4">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => header.column.toggleSorting(header.column.getIsSorted() === 'asc')}
                            className="h-7 px-2 font-semibold"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                              {getSortIcon(header.column.getIsSorted())}
                            </Button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="align-top">
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-b border-border/60 px-4 py-3 text-muted-foreground">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="border-border/60 bg-card/75 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">没有匹配结果</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">尝试调整关键词，或者清空筛选条件查看全部产品。</p>
          </CardContent>
          <CardFooter className="border-t border-border/60 bg-transparent">
            <Button type="button" variant="outline" onClick={clearFilters}>
              查看全部产品
            </Button>
          </CardFooter>
        </Card>
      )}
    </section>
  );
}
