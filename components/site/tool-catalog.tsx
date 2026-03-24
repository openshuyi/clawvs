'use client';

import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Globe, Github, BookOpen, Search, Columns3, RotateCcw, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
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
type UpdateTimeFilter = '全部' | '最近一个月' | '最近三个月' | '最近半年' | '最近一年';
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
  const CONFIG_KEY = 'clawvs-tool-catalog-config-v1';

  // Default states
  const [query, setQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('全部');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('全部');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('全部');
  const [tagFilter, setTagFilter] = useState<TagFilter>('全部');
  const [updateTimeFilter, setUpdateTimeFilter] = useState<UpdateTimeFilter>('全部');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('默认');
  const [tableSorting, setTableSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    vendor: false,
    gfwStatus: false,
    pricing: false,
    deployment: false,
    lastCommitDate: true,
  });
  
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.query !== undefined) setQuery(parsed.query);
        if (parsed.sourceFilter) setSourceFilter(parsed.sourceFilter);
        if (parsed.regionFilter) setRegionFilter(parsed.regionFilter);
        if (parsed.categoryFilter) setCategoryFilter(parsed.categoryFilter);
        if (parsed.tagFilter) setTagFilter(parsed.tagFilter);
        if (parsed.updateTimeFilter) setUpdateTimeFilter(parsed.updateTimeFilter);
        if (parsed.sortBy) setSortBy(parsed.sortBy);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
        if (parsed.columnVisibility) setColumnVisibility(parsed.columnVisibility);
      }
    } catch (e) {
      console.error('Failed to load table config', e);
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({
        query, sourceFilter, regionFilter, categoryFilter, tagFilter, updateTimeFilter, sortBy, viewMode, columnVisibility
      }));
    }
  }, [query, sourceFilter, regionFilter, categoryFilter, tagFilter, updateTimeFilter, sortBy, viewMode, columnVisibility, isMounted]);

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const now = new Date();
    
    const visibleTools = tools.filter((tool) => {
      const matchSource = sourceFilter === '全部' || tool.sourceType === sourceFilter;
      const matchRegion = regionFilter === '全部' || tool.region === regionFilter;
      const matchCategory = categoryFilter === '全部' || tool.primaryCategory === categoryFilter;
      const matchTag = tagFilter === '全部' || tool.tags.includes(tagFilter);
      
      let matchUpdateTime = true;
      if (updateTimeFilter !== '全部') {
        const dateStr = tool.lastCommitDate || tool.lastReleaseDate;
        if (!dateStr) {
          matchUpdateTime = false;
        } else {
          const updateDate = new Date(dateStr);
          const diffMonths = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          if (updateTimeFilter === '最近一个月') matchUpdateTime = diffMonths <= 1;
          else if (updateTimeFilter === '最近三个月') matchUpdateTime = diffMonths <= 3;
          else if (updateTimeFilter === '最近半年') matchUpdateTime = diffMonths <= 6;
          else if (updateTimeFilter === '最近一年') matchUpdateTime = diffMonths <= 12;
        }
      }

      const matchKeyword =
        keyword.length === 0 ||
        `${tool.name} ${tool.tagline} ${tool.summary} ${tool.vendor} ${tool.focus} ${tool.scenarios.join(' ')} ${tool.tags.join(' ')}`.toLowerCase().includes(keyword);
      return matchSource && matchRegion && matchCategory && matchTag && matchUpdateTime && matchKeyword;
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
  }, [categoryFilter, query, regionFilter, sortBy, sourceFilter, tagFilter, updateTimeFilter]);

  function clearFilters() {
    setQuery('');
    setSourceFilter('全部');
    setRegionFilter('全部');
    setCategoryFilter('全部');
    setTagFilter('全部');
    setUpdateTimeFilter('全部');
    setSortBy('默认');
    setTableSorting([]);
    setColumnVisibility({
      vendor: false,
      gfwStatus: false,
      pricing: false,
      deployment: false,
      lastCommitDate: true,
    });
  }

  const hasActiveFilters =
    query.trim().length > 0 ||
    sourceFilter !== '全部' ||
    regionFilter !== '全部' ||
    categoryFilter !== '全部' ||
    tagFilter !== '全部' ||
    updateTimeFilter !== '全部' ||
    sortBy !== '默认' ||
    tableSorting.length > 0;

  const columns = useMemo<ColumnDef<ToolItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '工具',
        cell: ({ row }) => (
          <Link href={`/tools/${row.original.slug}`} className="block min-w-0 hover:text-accent-cyan transition-colors">
            <p className="truncate text-sm font-semibold">{row.original.name}</p>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{row.original.tagline}</p>
          </Link>
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
        accessorKey: 'vendor',
        header: '厂商',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.vendor}</span>,
      },
      {
        accessorKey: 'gfwStatus',
        header: '网络',
        cell: ({ row }) => <Badge variant="outline">{row.original.gfwStatus}</Badge>,
      },
      {
        accessorKey: 'pricing',
        header: '定价',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.pricing}</span>,
      },
      {
        accessorKey: 'deployment',
        header: '部署',
        cell: ({ row }) => <span className="text-muted-foreground truncate max-w-[150px] block" title={row.original.deployment}>{row.original.deployment}</span>,
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
        id: 'lastCommitDate',
        accessorFn: (tool) => tool.lastCommitDate || tool.lastReleaseDate || '',
        header: '更新时间',
        cell: ({ row }) => {
          const dateStr = row.original.lastCommitDate || row.original.lastReleaseDate;
          if (!dateStr) return <span className="text-muted-foreground">-</span>;
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return <span className="text-muted-foreground">-</span>;
          return <span className="text-muted-foreground">{date.toISOString().split('T')[0]}</span>;
        },
      },
      {
        id: 'links',
        header: '链接',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.homepageUrl && (
              <Link
                href={row.original.homepageUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-7')}
                title="官网"
              >
                <Globe className="size-4" />
              </Link>
            )}
            {row.original.githubUrl ? (
              <Link
                href={row.original.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-7')}
                title="GitHub"
              >
                <Github className="size-4" />
              </Link>
            ) : null}
            {row.original.docsUrl ? (
              <Link
                href={row.original.docsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-7')}
                title="文档"
              >
                <BookOpen className="size-4" />
              </Link>
            ) : null}
          </div>
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
      columnVisibility,
    },
    onSortingChange: setTableSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-6">
      <div className="ui-panel p-3 rounded-xl flex flex-col xl:flex-row gap-3 items-center justify-between">
        {/* Left side: Search & Filters inline */}
        <div className="flex flex-1 w-full items-center gap-2 overflow-x-auto custom-scrollbar pb-1 xl:pb-0">
          <div className="relative shrink-0 w-48 xl:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索工具、厂商..."
              className="pl-9 h-9 font-mono text-xs rounded-md border-border/60 bg-transparent focus-visible:ring-accent-cyan"
            />
          </div>
          
          <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as SourceFilter)}>
            <SelectTrigger className="h-9 w-[110px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60">
              <SelectItem value="全部">全部类型</SelectItem>
              <SelectItem value="开源">开源</SelectItem>
              <SelectItem value="闭源">闭源</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
            <SelectTrigger className="h-9 w-[140px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="分类" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60 max-h-[300px]">
              <SelectItem value="全部">全部主分类</SelectItem>
              {primaryCategories.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value as RegionFilter)}>
            <SelectTrigger className="h-9 w-[100px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="地区" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60">
              <SelectItem value="全部">全部地区</SelectItem>
              <SelectItem value="国内">国内</SelectItem>
              <SelectItem value="海外">海外</SelectItem>
              <SelectItem value="全球">全球</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={(value) => setTagFilter(value as TagFilter)}>
            <SelectTrigger className="h-9 w-[110px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="标签" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60 max-h-[300px]">
              <SelectItem value="全部">全部标签</SelectItem>
              {toolTags.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={updateTimeFilter} onValueChange={(value) => setUpdateTimeFilter(value as UpdateTimeFilter)}>
            <SelectTrigger className="h-9 w-[110px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="更新时间" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60">
              <SelectItem value="全部">全部时间</SelectItem>
              <SelectItem value="最近一个月">最近一个月</SelectItem>
              <SelectItem value="最近三个月">最近三个月</SelectItem>
              <SelectItem value="最近半年">最近半年</SelectItem>
              <SelectItem value="最近一年">最近一年</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="h-9 w-[120px] shrink-0 font-mono text-xs rounded-md border-border/60 bg-transparent">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent className="rounded-md border-border/60">
              <SelectItem value="默认">默认排序</SelectItem>
              <SelectItem value="名称 A-Z">名称 A-Z</SelectItem>
              <SelectItem value="成功率高到低">成功率高到低</SelectItem>
              <SelectItem value="Stars 高到低">Stars 高到低</SelectItem>
              <SelectItem value="综合评分高到低">综合评分高到低</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Tools */}
        <div className="flex items-center gap-2 shrink-0 border-t xl:border-t-0 xl:border-l border-border-color pt-3 xl:pt-0 pl-0 xl:pl-3 w-full xl:w-auto justify-between xl:justify-end">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ui-chip font-mono text-xs px-2 h-9 flex items-center justify-center">
              {filteredTools.length}/{tools.length}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "h-9 text-xs gap-1.5 font-mono rounded-md border-border/60")}>
                <Columns3 className="size-3.5" />
                列配置
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-bg-surface border-border-color/60 shadow-xl backdrop-blur-md">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-text-muted">显示/隐藏列</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border-color/50" />
                  {table.getAllLeafColumns().filter(col => typeof col.accessorFn !== 'undefined' || col.id === 'links' || ['vendor', 'gfwStatus', 'pricing', 'deployment', 'lastCommitDate'].includes(col.id)).map(column => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-xs cursor-pointer focus:bg-accent-cyan/10 focus:text-accent-cyan"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList className="h-9 p-0.5 bg-bg-surface-strong border border-border-color/60 rounded-md">
                <TabsTrigger value="list" className="text-xs px-2.5 h-7 data-[state=active]:bg-accent-cyan data-[state=active]:text-bg-main rounded-sm"><List className="size-3.5" /></TabsTrigger>
                <TabsTrigger value="card" className="text-xs px-2.5 h-7 data-[state=active]:bg-accent-cyan data-[state=active]:text-bg-main rounded-sm"><LayoutGrid className="size-3.5" /></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {(hasActiveFilters || Object.values(columnVisibility).some(v => !v)) && (
            <Button type="button" variant="ghost" size="icon" onClick={clearFilters} className="h-9 w-9 text-text-muted hover:text-accent-orange transition-colors" title="重置所有条件">
              <RotateCcw className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {filteredTools.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTools.map((tool) => (
              <Card key={tool.slug} className="ui-panel group relative overflow-hidden transition-all hover:border-accent-cyan ui-card-hover rounded-none">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-cyan/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                <CardHeader className="relative space-y-3 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="ui-chip font-mono text-[10px] uppercase tracking-wider bg-accent-cyan-soft text-accent-cyan border-accent-cyan/30">{tool.sourceType}</Badge>
                    <Badge variant="outline" className="ui-chip font-mono text-[10px] uppercase tracking-wider">{tool.region}</Badge>
                    <Badge variant="outline" className="ui-chip font-mono text-[10px] uppercase tracking-wider">{tool.vendor}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan">{tool.name}</p>
                    </div>
                    <h2 className="text-lg font-bold leading-snug tracking-wide group-hover:text-accent-cyan transition-colors ui-title">{tool.tagline}</h2>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm leading-relaxed ui-subtitle">{tool.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default" className="ui-chip bg-accent-orange-soft text-accent-orange border-accent-orange/30 hover:bg-accent-orange-soft/80">{tool.primaryCategory}</Badge>
                    {tool.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="ui-chip text-text-muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border-color/50 pt-4 font-mono text-[11px] ui-muted">
                    <div className="flex justify-between">
                      <span className="opacity-70">DEPLOY</span>
                      <span className="text-text-primary font-medium">{tool.deployment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">NETWORK</span>
                      <span className="text-text-primary font-medium">{tool.gfwStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">STARS</span>
                      <span className="text-text-primary font-medium">{tool.githubStars === null ? '-' : tool.githubStars.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">LANG</span>
                      <span className="text-text-primary font-medium">{tool.primaryLanguage ?? '-'}</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="opacity-70">UPDATE</span>
                      <span className="text-text-primary font-medium">
                        {(tool.lastCommitDate || tool.lastReleaseDate) && !isNaN(new Date(tool.lastCommitDate || tool.lastReleaseDate || '').getTime())
                          ? new Date(tool.lastCommitDate || tool.lastReleaseDate || '').toISOString().split('T')[0]
                          : '-'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="relative flex-wrap justify-between gap-3 border-t border-border-color/50 bg-bg-surface-strong/30 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.homepageUrl && (
                      <Link
                        href={tool.homepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ui-chip px-3 py-1 font-mono text-[10px] uppercase hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                      >
                        [ 官网 ]
                      </Link>
                    )}
                    {tool.githubUrl ? (
                      <Link
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ui-chip px-3 py-1 font-mono text-[10px] uppercase hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                      >
                        [ GitHub ]
                      </Link>
                    ) : null}
                    {tool.docsUrl ? (
                      <Link
                        href={tool.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ui-chip px-3 py-1 font-mono text-[10px] uppercase hover:border-accent-cyan hover:text-accent-cyan transition-colors"
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
          <Card className="ui-panel rounded-none">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface-strong/40">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-border-color/60 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 border-b border-border-color/60 px-4 text-text-secondary">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => header.column.toggleSorting(header.column.getIsSorted() === 'asc')}
                            className="h-7 px-2 font-semibold hover:bg-accent-cyan-soft hover:text-accent-cyan"
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
                    <TableRow key={row.id} className="align-top border-border-color/60 hover:bg-bg-surface-strong/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-b border-border-color/60 px-4 py-3 text-text-primary">
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
        <Card className="ui-panel rounded-none">
          <CardHeader>
            <CardTitle className="text-base ui-title">没有匹配结果</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm ui-subtitle">尝试调整关键词，或者清空筛选条件查看全部产品。</p>
          </CardContent>
          <CardFooter className="border-t border-border-color/60 bg-transparent">
            <Button type="button" variant="outline" onClick={clearFilters} className="ui-chip hover:border-accent-cyan hover:text-accent-cyan">
              查看全部产品
            </Button>
          </CardFooter>
        </Card>
      )}
    </section>
  );
}
