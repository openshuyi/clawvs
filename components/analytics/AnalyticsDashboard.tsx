'use client';

import { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  BarChart, Bar, Legend, ResponsiveContainer, ZAxis, Cell
} from 'recharts';
import { tools } from '@/lib/tools';
import { ToolProfile, primaryCategories } from '@/lib/tools/types';
import { Database, TrendingUp, Shield, Activity, FileText } from 'lucide-react';

const COLORS = ['#00f0ff', '#ff3c00', '#10b981', '#8b5cf6', '#ec4899'];

export function AnalyticsDashboard() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    'openclaw', 'openinterpreter', 'anthropic-computer-use'
  ]);

  // Handle Tool Selection
  const toggleTool = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      if (selectedSlugs.length > 1) {
        setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
      }
    } else {
      if (selectedSlugs.length < 5) {
        setSelectedSlugs([...selectedSlugs, slug]);
      }
    }
  };

  const selectedTools = useMemo(() => {
    return selectedSlugs.map(slug => tools.find(t => t.slug === slug)).filter(Boolean) as ToolProfile[];
  }, [selectedSlugs]);

  // Radar Chart Data (Multi-dimensional Comparison)
  const radarData = useMemo(() => {
    const dimensions = [
      { key: 'security', label: '安全性' },
      { key: 'speed', label: '响应速度' },
      { key: 'flexibility', label: '灵活性' },
      { key: 'stability', label: '稳定性' },
      { key: 'docs', label: '文档生态' },
    ];

    return dimensions.map(dim => {
      const dataPoint: any = { subject: dim.label, fullMark: 10 };
      selectedTools.forEach(tool => {
        dataPoint[tool.name] = tool.rating[dim.key as keyof typeof tool.rating] || 0;
      });
      return dataPoint;
    });
  }, [selectedTools]);

  // Scatter Plot Data (Stars vs Success Rate)
  const scatterData = useMemo(() => {
    return tools.map(t => ({
      name: t.name,
      stars: t.githubStars && t.githubStars > 0 ? t.githubStars : 1, // Avoid log(0) error
      successRate: t.benchmark?.successRate || 0,
      category: t.primaryCategory,
      avgRating: (t.rating.security + t.rating.speed + t.rating.flexibility + t.rating.stability + t.rating.docs) / 5
    })).filter(t => t.successRate > 0);
  }, []);

  // Bar Chart Data (Category Distribution)
  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach(t => {
      counts[t.primaryCategory] = (counts[t.primaryCategory] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 categories
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tool Selector Panel */}
      <div className="ui-panel p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Database className="size-5 text-accent-cyan" />
          对比目标选择 <span className="text-xs font-normal text-text-secondary ml-2">(最多选 5 个)</span>
        </h3>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
          {tools.map(tool => {
            const isSelected = selectedSlugs.includes(tool.slug);
            return (
              <button
                type="button"
                key={tool.slug}
                onClick={() => toggleTool(tool.slug)}
                disabled={!isSelected && selectedSlugs.length >= 5}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  isSelected 
                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                    : 'bg-bg-surface-strong border-border-color text-text-secondary hover:border-text-primary disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Panel */}
        <div className="ui-panel p-6 rounded-2xl min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <Activity className="size-5 text-accent-cyan" />
            多维能力评估雷达
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'var(--text-muted)' }} tickCount={6} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'var(--border-color)', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                {selectedTools.map((tool, index) => (
                  <Radar
                    key={tool.slug}
                    name={tool.name}
                    dataKey={tool.name}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.3}
                    isAnimationActive={true}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Panel */}
        <div className="ui-panel p-6 rounded-2xl min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <FileText className="size-5 text-accent-orange" />
            热门领域分布 (Top 8)
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={11} width={120} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="var(--accent-orange)" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? 'var(--accent-cyan)' : 'var(--accent-orange)'} fillOpacity={0.8 + (0.2 * (barData.length - index) / barData.length)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scatter Chart Panel */}
      <div className="ui-panel p-6 rounded-2xl min-h-[500px] flex flex-col relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-accent-cyan/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="size-5 text-accent-cyan" />
            社区热度 vs 任务成功率 (景观图)
          </h3>
          <div className="text-xs text-text-secondary bg-bg-surface-strong px-3 py-1 rounded-md border border-border-color">
            气泡大小代表综合评分
          </div>
        </div>
        <div className="flex-1 w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                type="number" 
                dataKey="stars" 
                name="GitHub Stars" 
                stroke="var(--text-muted)"
                label={{ value: 'GitHub Stars', position: 'bottom', fill: 'var(--text-secondary)' }}
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(1)}k` : value}
              />
              <YAxis 
                type="number" 
                dataKey="successRate" 
                name="Success Rate" 
                unit="%" 
                stroke="var(--text-muted)"
                label={{ value: 'Success Rate (%)', angle: -90, position: 'left', fill: 'var(--text-secondary)' }}
                domain={[0, 100]}
              />
              <ZAxis type="number" dataKey="avgRating" range={[60, 400]} name="综合评分" />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                formatter={(value: any, name: any) => {
                  const nameStr = String(name);
                  if (nameStr === 'Success Rate') return [`${value}%`, '任务成功率'];
                  if (nameStr === 'GitHub Stars') return [value, 'Stars'];
                  if (nameStr === '综合评分') return [Number(value).toFixed(1), '综合评分'];
                  return [value, nameStr];
                }}
                labelFormatter={() => ''}
              />
              <Scatter name="AI Agents" data={scatterData} fill="var(--accent-cyan)" fillOpacity={0.6}>
                {scatterData.map((entry) => (
                  <Cell key={entry.name} fill={entry.category === 'OpenClaw 生态' ? 'var(--accent-orange)' : 'var(--accent-cyan)'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
