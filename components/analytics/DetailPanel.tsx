'use client';

import { ToolProfile } from '@/lib/tools/types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { X, ExternalLink, Star, Target, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DetailPanelProps {
  tool: ToolProfile | null;
  onClose: () => void;
  onAddToCompare: (tool: ToolProfile) => void;
  isInCompare: boolean;
}

const COLORS = ['#00f0ff', '#ff3c00', '#10b981', '#8b5cf6', '#ec4899'];

export function DetailPanel({ tool, onClose, onAddToCompare, isInCompare }: DetailPanelProps) {
  if (!tool) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        点击气泡查看工具详情
      </div>
    );
  }

  // 雷达图数据
  const radarData = [
    { subject: '安全性', A: tool.rating.security, fullMark: 10 },
    { subject: '响应速度', A: tool.rating.speed, fullMark: 10 },
    { subject: '灵活性', A: tool.rating.flexibility, fullMark: 10 },
    { subject: '稳定性', A: tool.rating.stability, fullMark: 10 },
    { subject: '文档生态', A: tool.rating.docs, fullMark: 10 },
  ];

  const avgRating = (
    tool.rating.security +
    tool.rating.speed +
    tool.rating.flexibility +
    tool.rating.stability +
    tool.rating.docs
  ) / 5;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 头部 */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate">{tool.name}</h3>
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">{tool.tagline}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 基本信息 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-medium">供应商:</span>
          <span className="text-text-primary">{tool.vendor}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-medium">分类:</span>
          <span className="text-text-primary">{tool.primaryCategory}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {tool.sourceType}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {tool.region}
          </Badge>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-bg-surface-strong rounded-lg border border-border-color">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Star className="w-3 h-3" />
            <span className="text-xs">GitHub Stars</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {tool.githubStars ? tool.githubStars.toLocaleString() : '-'}
          </div>
        </div>
        <div className="p-2 bg-bg-surface-strong rounded-lg border border-border-color">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Target className="w-3 h-3" />
            <span className="text-xs">成功率</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {tool.benchmark?.successRate ? `${tool.benchmark.successRate}%` : '-'}
          </div>
        </div>
        <div className="p-2 bg-bg-surface-strong rounded-lg border border-border-color">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-xs">平均时长</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {tool.benchmark?.avgDurationMin ? `${tool.benchmark.avgDurationMin}min` : '-'}
          </div>
        </div>
        <div className="p-2 bg-bg-surface-strong rounded-lg border border-border-color">
          <div className="flex items-center gap-1.5 text-text-muted mb-1">
            <RefreshCw className="w-3 h-3" />
            <span className="text-xs">重试次数</span>
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {tool.benchmark?.retries ?? '-'}
          </div>
        </div>
      </div>

      {/* 综合评分 */}
      <div className="p-3 bg-bg-surface-strong rounded-lg border border-border-color">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">综合评分</span>
          <span className="text-sm font-bold text-accent-cyan">{avgRating.toFixed(1)}</span>
        </div>
        <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-cyan to-accent-cyan/50 transition-all duration-300"
            style={{ width: `${(avgRating / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* 能力雷达图 */}
      <div className="flex-1 min-h-[200px] p-2 bg-bg-surface-strong rounded-lg border border-border-color">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="60%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
              }}
            />
            <Radar
              name={tool.name}
              dataKey="A"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.4}
              isAnimationActive={true}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 标签 */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-text-secondary">标签</span>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
          {tool.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 pt-2 border-t border-border-color">
        <Button
          variant="default"
          size="sm"
          className="flex-1 h-8 text-xs bg-accent-cyan text-black hover:bg-accent-cyan/80"
          onClick={() => onAddToCompare(tool)}
          disabled={isInCompare}
        >
          {isInCompare ? '已在比较中' : '添加到比较'}
        </Button>
        {tool.homepageUrl && (
          <a
            href={tool.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 h-8 text-xs border border-border-color rounded-md hover:bg-bg-surface-strong transition-colors text-text-secondary"
          >
            <ExternalLink className="w-3 h-3" />
            官网
          </a>
        )}
        {tool.docsUrl && (
          <a
            href={tool.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 h-8 text-xs border border-border-color rounded-md hover:bg-bg-surface-strong transition-colors text-text-secondary"
          >
            <ExternalLink className="w-3 h-3" />
            文档
          </a>
        )}
      </div>
    </div>
  );
}
