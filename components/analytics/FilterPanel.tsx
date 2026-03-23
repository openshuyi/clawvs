'use client';

import { useState, useMemo, useId } from 'react';
import { FilterState } from './types';
import { primaryCategories } from '@/lib/tools/types';
import { X } from 'lucide-react';

interface FilterPanelProps {
  value: FilterState;
  onChange: (value: FilterState) => void;
  availableTags: string[];
}

const SOURCE_TYPES = ['开源', '闭源', '部分开源'];
const REGIONS = ['国内', '海外', '全球'];

export function FilterPanel({ value, onChange, availableTags }: FilterPanelProps) {
  const [tagSearch, setTagSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categoryLabelId = useId();
  const sourceLabelId = useId();
  const regionLabelId = useId();
  const tagLabelId = useId();
  const ratingLabelId = useId();
  const starsLabelId = useId();

  const filteredTags = useMemo(() => {
    if (!tagSearch) return availableTags.slice(0, 20);
    return availableTags
      .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
      .slice(0, 20);
  }, [tagSearch, availableTags]);

  const toggleCategory = (category: string) => {
    if (value.categories.includes(category)) {
      onChange({ ...value, categories: value.categories.filter(c => c !== category) });
    } else {
      onChange({ ...value, categories: [...value.categories, category] });
    }
  };

  const toggleSourceType = (sourceType: string) => {
    if (value.sourceTypes.includes(sourceType)) {
      onChange({ ...value, sourceTypes: value.sourceTypes.filter(s => s !== sourceType) });
    } else {
      onChange({ ...value, sourceTypes: [...value.sourceTypes, sourceType] });
    }
  };

  const toggleRegion = (region: string) => {
    if (value.regions.includes(region)) {
      onChange({ ...value, regions: value.regions.filter(r => r !== region) });
    } else {
      onChange({ ...value, regions: [...value.regions, region] });
    }
  };

  const toggleTag = (tag: string) => {
    if (value.tags.includes(tag)) {
      onChange({ ...value, tags: value.tags.filter(t => t !== tag) });
    } else {
      onChange({ ...value, tags: [...value.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    onChange({ ...value, tags: value.tags.filter(t => t !== tag) });
  };

  const resetFilters = () => {
    onChange({
      categories: [],
      sourceTypes: [],
      regions: [],
      tags: [],
      minRating: 0,
      starsRange: [0, 100000],
    });
  };

  const hasActiveFilters = 
    value.categories.length > 0 ||
    value.sourceTypes.length > 0 ||
    value.regions.length > 0 ||
    value.tags.length > 0 ||
    value.minRating > 0 ||
    value.starsRange[0] > 0 ||
    value.starsRange[1] < 100000;

  return (
    <div className="space-y-4">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">筛选条件</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              重置
            </button>
          )}
        </div>
      </div>

      {/* 筛选内容 */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 分类筛选 */}
          <div className="space-y-2">
            <span id={categoryLabelId} className="text-xs font-medium text-text-secondary">分类</span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {primaryCategories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    value.categories.includes(category)
                      ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                      : 'bg-bg-surface-strong border-border-color text-text-secondary hover:border-text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 来源类型 */}
          <div className="space-y-2">
            <span id={sourceLabelId} className="text-xs font-medium text-text-secondary">来源类型</span>
            <div className="flex flex-wrap gap-1.5">
              {SOURCE_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSourceType(type)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    value.sourceTypes.includes(type)
                      ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                      : 'bg-bg-surface-strong border-border-color text-text-secondary hover:border-text-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 地区 */}
          <div className="space-y-2">
            <span id={regionLabelId} className="text-xs font-medium text-text-secondary">地区</span>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map(region => (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    value.regions.includes(region)
                      ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                      : 'bg-bg-surface-strong border-border-color text-text-secondary hover:border-text-primary'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* 标签筛选 */}
          <div className="space-y-2">
            <span id={tagLabelId} className="text-xs font-medium text-text-secondary">标签</span>
            {/* 已选标签 */}
            {value.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {value.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-accent-cyan/80"
                      aria-label={`移除标签 ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* 标签搜索 */}
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="搜索标签..."
              className="w-full px-2 py-1.5 text-xs bg-bg-surface-strong border border-border-color rounded-md focus:outline-none focus:border-accent-cyan/50 text-text-primary placeholder:text-text-muted"
              aria-label="搜索标签"
            />
            {/* 标签列表 */}
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {filteredTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  disabled={value.tags.includes(tag)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    value.tags.includes(tag)
                      ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                      : 'bg-bg-surface-strong border-border-color text-text-secondary hover:border-text-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 最低评分 */}
          <div className="space-y-2">
            <span id={ratingLabelId} className="text-xs font-medium text-text-secondary">
              最低综合评分：{value.minRating.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={value.minRating}
              onChange={(e) => onChange({ ...value, minRating: parseFloat(e.target.value) })}
              className="w-full h-1 bg-bg-surface-strong rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Stars 范围 */}
          <div className="space-y-2">
            <span id={starsLabelId} className="text-xs font-medium text-text-secondary">
              GitHub Stars 范围：{value.starsRange[0]} - {value.starsRange[1]}+
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={value.starsRange[0]}
                onChange={(e) => onChange({
                  ...value,
                  starsRange: [parseInt(e.target.value), value.starsRange[1]]
                })}
                className="flex-1 h-1 bg-bg-surface-strong rounded-lg appearance-none cursor-pointer accent-accent-cyan"
              />
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={value.starsRange[1]}
                onChange={(e) => onChange({
                  ...value,
                  starsRange: [value.starsRange[0], parseInt(e.target.value)]
                })}
                className="flex-1 h-1 bg-bg-surface-strong rounded-lg appearance-none cursor-pointer accent-accent-cyan"
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>0</span>
              <span>50k</span>
              <span>100k+</span>
            </div>
          </div>
        </div>
      )}

      {/* 激活的筛选条件摘要 */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border-color">
          {value.categories.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
              分类：{value.categories.length}
            </span>
          )}
          {value.sourceTypes.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
              来源：{value.sourceTypes.length}
            </span>
          )}
          {value.regions.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
              地区：{value.regions.length}
            </span>
          )}
          {value.tags.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
              标签：{value.tags.length}
            </span>
          )}
          {value.minRating > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
              评分≥{value.minRating.toFixed(1)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
