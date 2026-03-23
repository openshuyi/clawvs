'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DimensionConfig, PRESET_VIEWS, DIMENSION_LABELS, MetricKey, CategoryKey } from './types';
import { useId } from 'react';

interface DimensionSelectorProps {
  config: DimensionConfig;
  onChange: (config: DimensionConfig) => void;
}

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: 'githubStars', label: 'GitHub Stars' },
  { value: 'successRate', label: '成功率 (%)' },
  { value: 'avgDuration', label: '平均时长 (分钟)' },
  { value: 'retries', label: '重试次数' },
  { value: 'security', label: '安全性' },
  { value: 'speed', label: '响应速度' },
  { value: 'flexibility', label: '灵活性' },
  { value: 'stability', label: '稳定性' },
  { value: 'docs', label: '文档生态' },
  { value: 'avgRating', label: '综合评分' },
];

const CATEGORY_OPTIONS: { value: CategoryKey; label: string }[] = [
  { value: 'primaryCategory', label: '主要分类' },
  { value: 'sourceType', label: '来源类型' },
  { value: 'region', label: '地区' },
  { value: 'deployment', label: '部署方式' },
  { value: 'primaryLanguage', label: '编程语言' },
];

export function DimensionSelector({ config, onChange }: DimensionSelectorProps) {
  const xAxisId = useId();
  const yAxisId = useId();
  const colorId = useId();
  const sizeId = useId();

  const handlePresetChange = (presetId: string | null) => {
    if (presetId) {
      const preset = PRESET_VIEWS.find(p => p.id === presetId);
      if (preset) {
        onChange(preset.config);
      }
    }
  };

  const handleMetricChange = (axis: 'x' | 'y' | 'size', value: string | null) => {
    if (value) {
      onChange({
        ...config,
        [axis]: value as MetricKey,
      });
    }
  };

  const handleColorChange = (value: string | null) => {
    if (value) {
      onChange({
        ...config,
        color: value as CategoryKey,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 预设视图选择 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary whitespace-nowrap">预设视图:</span>
        <Select onValueChange={handlePresetChange} defaultValue="default">
          <SelectTrigger className="h-8 text-xs min-w-[120px]">
            <SelectValue placeholder="选择预设" />
          </SelectTrigger>
          <SelectContent>
            {PRESET_VIEWS.map(preset => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 维度配置 */}
      <div className="grid grid-cols-2 gap-3">
        {/* X 轴 */}
        <div className="space-y-1.5">
          <label htmlFor={xAxisId} className="text-xs font-medium text-text-secondary">X 轴</label>
          <Select
            value={config.x}
            onValueChange={(v) => handleMetricChange('x', v)}
          >
            <SelectTrigger className="h-8 text-xs" id={xAxisId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Y 轴 */}
        <div className="space-y-1.5">
          <label htmlFor={yAxisId} className="text-xs font-medium text-text-secondary">Y 轴</label>
          <Select
            value={config.y}
            onValueChange={(v) => handleMetricChange('y', v)}
          >
            <SelectTrigger className="h-8 text-xs" id={yAxisId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 颜色分组 */}
        <div className="space-y-1.5">
          <label htmlFor={colorId} className="text-xs font-medium text-text-secondary">颜色分组</label>
          <Select
            value={config.color}
            onValueChange={handleColorChange}
          >
            <SelectTrigger className="h-8 text-xs" id={colorId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 气泡大小 */}
        <div className="space-y-1.5">
          <label htmlFor={sizeId} className="text-xs font-medium text-text-secondary">气泡大小</label>
          <Select
            value={config.size}
            onValueChange={(v) => handleMetricChange('size', v)}
          >
            <SelectTrigger className="h-8 text-xs" id={sizeId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
