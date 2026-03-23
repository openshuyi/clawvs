'use client';

import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
  Legend,
} from 'recharts';
import { ToolProfile } from '@/lib/tools/types';
import {
  DimensionConfig,
  BubbleDataItem,
  getMetricValue,
  getCategoryValue,
  getCategoryColor,
  DIMENSION_LABELS,
} from './types';

interface BubbleChartProps {
  tools: ToolProfile[];
  config: DimensionConfig;
  onSelectTool: (tool: ToolProfile) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload as BubbleDataItem;
  if (!data) return null;

  return (
    <div className="p-3 bg-bg-surface-strong border border-border-color rounded-lg shadow-lg min-w-[200px]">
      <div className="font-semibold text-text-primary text-sm mb-2">{data.name}</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">{DIMENSION_LABELS.x}:</span>
          <span className="text-text-primary font-medium">{data.x.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">{DIMENSION_LABELS.y}:</span>
          <span className="text-text-primary font-medium">{data.y.toFixed(1)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-text-secondary">分类:</span>
          <span className="text-text-primary font-medium">{data.category}</span>
        </div>
      </div>
    </div>
  );
}

export function BubbleChart({ tools, config, onSelectTool }: BubbleChartProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // 计算数据范围
  const dataRange = useMemo(() => {
    if (tools.length === 0) {
      return { xMin: 0, xMax: 100, yMin: 0, yMax: 100, sizeMin: 0, sizeMax: 100 };
    }

    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let sizeMin = Infinity, sizeMax = -Infinity;

    tools.forEach(tool => {
      const x = getMetricValue(tool, config.x);
      const y = getMetricValue(tool, config.y);
      const size = getMetricValue(tool, config.size);

      xMin = Math.min(xMin, x);
      xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y);
      yMax = Math.max(yMax, y);
      sizeMin = Math.min(sizeMin, size);
      sizeMax = Math.max(sizeMax, size);
    });

    // 添加 10% 的边距
    const xPadding = (xMax - xMin) * 0.1 || 1;
    const yPadding = (yMax - yMin) * 0.1 || 1;

    return {
      xMin: Math.max(0, xMin - xPadding),
      xMax: xMax + xPadding,
      yMin: Math.max(0, yMin - yPadding),
      yMax: yMax + yPadding,
      sizeMin,
      sizeMax,
    };
  }, [tools, config]);

  // 生成气泡图数据
  const chartData: BubbleDataItem[] = useMemo(() => {
    return tools.map(tool => {
      const x = getMetricValue(tool, config.x);
      const y = getMetricValue(tool, config.y);
      const size = getMetricValue(tool, config.size);
      const category = getCategoryValue(tool, config.color);
      const color = getCategoryColor(category, config.color);

      // 归一化气泡大小 (范围 50-400)
      const normalizedSize = dataRange.sizeMax > dataRange.sizeMin
        ? 50 + ((size - dataRange.sizeMin) / (dataRange.sizeMax - dataRange.sizeMin)) * 350
        : 200;

      return {
        slug: tool.slug,
        name: tool.name,
        x,
        y,
        size: normalizedSize,
        color,
        category,
        tool,
      };
    });
  }, [tools, config, dataRange]);

  // 生成图例数据（去重的分类）
  const legendData = useMemo(() => {
    const categories = new Set(chartData.map(d => d.category));
    return Array.from(categories).map(category => {
      const sampleItem = chartData.find(d => d.category === category);
      return {
        value: category,
        color: sampleItem?.color || '#6b7280',
      };
    });
  }, [chartData]);

  // 格式化轴标签
  const formatXAxisLabel = (value: number) => {
    const xKey = config.x;
    if (xKey === 'githubStars') {
      if (value >= 10000) {
        return `${(value / 1000).toFixed(0)}k`;
      }
      return value.toString();
    }
    if (xKey === 'avgDuration' || xKey === 'retries') {
      return value.toFixed(0);
    }
    if (['security', 'speed', 'flexibility', 'stability', 'docs', 'avgRating'].includes(xKey)) {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const formatYAxisLabel = (value: number) => {
    const yKey = config.y;
    if (yKey === 'successRate') {
      return `${value.toFixed(0)}%`;
    }
    if (yKey === 'githubStars') {
      if (value >= 10000) {
        return `${(value / 1000).toFixed(0)}k`;
      }
      return value.toString();
    }
    return value.toString();
  };

  const handleCellClick = (data: any) => {
    if (data && data.payload) {
      onSelectTool(data.payload.tool);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            dataKey="x"
            name={DIMENSION_LABELS[config.x]}
            stroke="var(--text-muted)"
            domain={[dataRange.xMin, dataRange.xMax]}
            tickFormatter={formatXAxisLabel}
            label={{
              value: DIMENSION_LABELS[config.x],
              position: 'bottom',
              fill: 'var(--text-secondary)',
              fontSize: 12,
              offset: 40,
            }}
            fontSize={11}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={DIMENSION_LABELS[config.y]}
            stroke="var(--text-muted)"
            domain={[dataRange.yMin, dataRange.yMax]}
            tickFormatter={formatYAxisLabel}
            label={{
              value: DIMENSION_LABELS[config.y],
              angle: -90,
              position: 'left',
              fill: 'var(--text-secondary)',
              fontSize: 12,
              offset: 50,
            }}
            fontSize={11}
          />
          <ZAxis type="number" dataKey="size" range={[50, 400]} name="大小" />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name="工具"
            data={chartData}
            fill="var(--accent-cyan)"
            isAnimationActive={true}
            animationDuration={500}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.slug}
                fill={entry.color}
                fillOpacity={hoveredSlug === entry.slug ? 0.9 : 0.6}
                stroke={hoveredSlug === entry.slug ? 'var(--text-primary)' : 'none'}
                strokeWidth={2}
                onClick={handleCellClick}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredSlug(entry.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              />
            ))}
          </Scatter>
          <Legend
            content={() => (
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {legendData.map(item => (
                  <div
                    key={item.value}
                    className="flex items-center gap-2 text-xs text-text-secondary"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
