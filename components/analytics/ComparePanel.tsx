'use client';

import { ToolProfile } from '@/lib/tools/types';
import { X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CATEGORY_COLORS,
  SOURCE_TYPE_COLORS,
  REGION_COLORS,
  getMetricValue,
} from './types';

interface ComparePanelProps {
  tools: ToolProfile[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}

const COLORS = ['#00f0ff', '#ff3c00', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

export function ComparePanel({ tools, onRemove, onClear }: ComparePanelProps) {
  if (tools.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm">
        从详情面板添加工具进行比较
      </div>
    );
  }

  // 比较指标
  const metrics = [
    { key: 'githubStars', label: 'GitHub Stars', format: (v: number) => v.toLocaleString() },
    { key: 'successRate', label: '成功率', format: (v: number) => `${v.toFixed(1)}%` },
    { key: 'avgDuration', label: '平均时长', format: (v: number) => `${v.toFixed(1)} min` },
    { key: 'retries', label: '重试次数', format: (v: number) => v.toString() },
    { key: 'security', label: '安全性', format: (v: number) => v.toFixed(1) },
    { key: 'speed', label: '响应速度', format: (v: number) => v.toFixed(1) },
    { key: 'flexibility', label: '灵活性', format: (v: number) => v.toFixed(1) },
    { key: 'stability', label: '稳定性', format: (v: number) => v.toFixed(1) },
    { key: 'docs', label: '文档生态', format: (v: number) => v.toFixed(1) },
  ];

  // 计算每个指标的最大/最小值用于高亮
  const getMetricStats = (key: string) => {
    const values = tools.map(t => getMetricValue(t, key as any));
    return {
      max: Math.max(...values),
      min: Math.min(...values),
    };
  };

  const getCategoryColor = (tool: ToolProfile, index: number) => {
    const category = tool.primaryCategory;
    return CATEGORY_COLORS[category] || COLORS[index % COLORS.length];
  };

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-color">
        <h3 className="text-sm font-semibold text-text-primary">
          工具比较 <span className="text-text-muted font-normal">({tools.length}/5)</span>
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-text-secondary hover:text-accent-cyan transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          清空
        </button>
      </div>

      {/* 工具列表 */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
        {tools.map((tool, index) => (
          <div
            key={tool.slug}
            className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 bg-bg-surface-strong border border-border-color rounded-md"
            style={{ borderLeftColor: getCategoryColor(tool, index) }}
          >
            <span className="text-xs font-medium text-text-primary max-w-[100px] truncate">
              {tool.name}
            </span>
            <button
              type="button"
              onClick={() => onRemove(tool.slug)}
              className="text-text-muted hover:text-accent-cyan transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* 比较表格 */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-bg-primary z-10">
            <tr>
              <th className="text-left font-medium text-text-secondary py-1.5 px-2 border-b border-border-color min-w-[80px]">
                指标
              </th>
              {tools.map((tool, index) => (
                <th
                  key={tool.slug}
                  className="text-center font-medium text-text-primary py-1.5 px-2 border-b border-border-color"
                  style={{ color: getCategoryColor(tool, index) }}
                >
                  {tool.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 基本信息行 */}
            <tr className="hover:bg-bg-surface-strong/50">
              <td className="text-text-secondary py-1.5 px-2 border-b border-border-color/50">
                供应商
              </td>
              {tools.map(tool => (
                <td key={tool.slug} className="text-center text-text-primary py-1.5 px-2 border-b border-border-color/50">
                  {tool.vendor}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-bg-surface-strong/50">
              <td className="text-text-secondary py-1.5 px-2 border-b border-border-color/50">
                分类
              </td>
              {tools.map(tool => (
                <td key={tool.slug} className="text-center text-text-primary py-1.5 px-2 border-b border-border-color/50">
                  {tool.primaryCategory}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-bg-surface-strong/50">
              <td className="text-text-secondary py-1.5 px-2 border-b border-border-color/50">
                来源
              </td>
              {tools.map(tool => (
                <td key={tool.slug} className="text-center py-1.5 px-2 border-b border-border-color/50">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${SOURCE_TYPE_COLORS[tool.sourceType] || '#6b7280'}20`,
                      color: SOURCE_TYPE_COLORS[tool.sourceType] || '#6b7280',
                      borderColor: `${SOURCE_TYPE_COLORS[tool.sourceType] || '#6b7280'}40`,
                    }}
                  >
                    {tool.sourceType}
                  </Badge>
                </td>
              ))}
            </tr>
            <tr className="hover:bg-bg-surface-strong/50">
              <td className="text-text-secondary py-1.5 px-2 border-b border-border-color/50">
                地区
              </td>
              {tools.map(tool => (
                <td key={tool.slug} className="text-center py-1.5 px-2 border-b border-border-color/50">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{
                      backgroundColor: `${REGION_COLORS[tool.region] || '#6b7280'}20`,
                      color: REGION_COLORS[tool.region] || '#6b7280',
                      borderColor: `${REGION_COLORS[tool.region] || '#6b7280'}40`,
                    }}
                  >
                    {tool.region}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* 指标行 */}
            {metrics.map(metric => {
              const stats = getMetricStats(metric.key);
              return (
                <tr key={metric.key} className="hover:bg-bg-surface-strong/50">
                  <td className="text-text-secondary py-1.5 px-2 border-b border-border-color/50">
                    {metric.label}
                  </td>
                  {tools.map(tool => {
                    const value = getMetricValue(tool, metric.key as any);
                    const isMax = value === stats.max && stats.max !== stats.min;
                    const isMin = value === stats.min && stats.max !== stats.min;
                    return (
                      <td
                        key={tool.slug}
                        className={`text-center text-text-primary py-1.5 px-2 border-b border-border-color/50 font-medium ${
                          isMax ? 'text-accent-cyan bg-accent-cyan/10' : ''
                        } ${
                          isMin ? 'text-accent-orange/70 bg-accent-orange/10' : ''
                        }`}
                      >
                        {metric.format(value)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* 综合评分行 */}
            <tr className="bg-bg-surface-strong/30">
              <td className="text-text-secondary font-medium py-2 px-2">
                综合评分
              </td>
              {tools.map(tool => {
                const avgRating = (
                  tool.rating.security +
                  tool.rating.speed +
                  tool.rating.flexibility +
                  tool.rating.stability +
                  tool.rating.docs
                ) / 5;
                return (
                  <td key={tool.slug} className="text-center py-2 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-accent-cyan">{avgRating.toFixed(1)}</span>
                      <div className="w-16 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-cyan to-accent-cyan/50"
                          style={{ width: `${(avgRating / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
