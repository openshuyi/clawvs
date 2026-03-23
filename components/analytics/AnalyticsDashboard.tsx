'use client';

import { useState, useMemo } from 'react';
import { tools as allTools } from '@/lib/tools';
import { ToolProfile } from '@/lib/tools/types';
import { DimensionSelector } from './DimensionSelector';
import { FilterPanel } from './FilterPanel';
import { BubbleChart } from './BubbleChart';
import { DetailPanel } from './DetailPanel';
import { ComparePanel } from './ComparePanel';
import {
  DimensionConfig,
  FilterState,
  DEFAULT_DIMENSION_CONFIG,
} from './types';
import { Database, BarChart3 } from 'lucide-react';

// 获取所有可用标签
const getAllTags = () => {
  const tags = new Set<string>();
  allTools.forEach(tool => {
    tool.tags.forEach(tag => tags.add(tag as string));
  });
  return Array.from(tags).sort();
};

// 默认筛选状态
const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  sourceTypes: [],
  regions: [],
  tags: [],
  minRating: 0,
  starsRange: [0, 100000],
};

export function AnalyticsDashboard() {
  // 维度配置状态
  const [dimensionConfig, setDimensionConfig] = useState<DimensionConfig>(DEFAULT_DIMENSION_CONFIG);
  
  // 筛选状态
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  
  // 选中的工具详情
  const [selectedTool, setSelectedTool] = useState<ToolProfile | null>(null);
  
  // 比较列表
  const [compareTools, setCompareTools] = useState<ToolProfile[]>([]);

  // 筛选后的工具列表
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      // 分类筛选
      if (filterState.categories.length > 0 && 
          !filterState.categories.includes(tool.primaryCategory)) {
        return false;
      }
      
      // 来源类型筛选
      if (filterState.sourceTypes.length > 0 && 
          !filterState.sourceTypes.includes(tool.sourceType)) {
        return false;
      }
      
      // 地区筛选
      if (filterState.regions.length > 0 && 
          !filterState.regions.includes(tool.region)) {
        return false;
      }
      
      // 标签筛选
      if (filterState.tags.length > 0 &&
          !filterState.tags.some(tag => tool.tags.includes(tag as any))) {
        return false;
      }
      
      // 最低评分筛选
      const avgRating = (
        tool.rating.security +
        tool.rating.speed +
        tool.rating.flexibility +
        tool.rating.stability +
        tool.rating.docs
      ) / 5;
      if (avgRating < filterState.minRating) {
        return false;
      }
      
      // Stars 范围筛选
      const stars = tool.githubStars || 0;
      if (stars < filterState.starsRange[0] || stars > filterState.starsRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [filterState]);

  // 处理维度配置变化
  const handleDimensionChange = (config: DimensionConfig) => {
    setDimensionConfig(config);
  };

  // 处理筛选变化
  const handleFilterChange = (value: FilterState) => {
    setFilterState(value);
  };

  // 处理选择工具
  const handleSelectTool = (tool: ToolProfile) => {
    setSelectedTool(tool);
  };

  // 处理添加到比较
  const handleAddToCompare = (tool: ToolProfile) => {
    if (!compareTools.find(t => t.slug === tool.slug) && compareTools.length < 5) {
      setCompareTools([...compareTools, tool]);
    }
  };

  // 处理移除比较
  const handleRemoveFromCompare = (slug: string) => {
    setCompareTools(compareTools.filter(t => t.slug !== slug));
  };

  // 处理清空比较
  const handleClearCompare = () => {
    setCompareTools([]);
  };

  // 检查工具是否在比较中
  const isInCompare = (tool: ToolProfile) => {
    return compareTools.some(t => t.slug === tool.slug);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 顶部控制栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 维度选择器 */}
        <div className="ui-panel p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent-cyan" />
            维度配置
          </h3>
          <DimensionSelector config={dimensionConfig} onChange={handleDimensionChange} />
        </div>

        {/* 筛选面板 */}
        <div className="ui-panel p-4 rounded-2xl">
          <FilterPanel
            value={filterState}
            onChange={handleFilterChange}
            availableTags={getAllTags()}
          />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* 气泡图 - 占据 2 列 */}
        <div className="xl:col-span-2 ui-panel p-4 rounded-2xl min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Database className="w-4 h-4 text-accent-cyan" />
              气泡图分析
              <span className="text-xs font-normal text-text-secondary ml-2">
                ({filteredTools.length} 个工具)
              </span>
            </h3>
          </div>
          <div className="flex-1 min-h-[400px]">
            <BubbleChart
              tools={filteredTools}
              config={dimensionConfig}
              onSelectTool={handleSelectTool}
            />
          </div>
        </div>

        {/* 右侧面板区 */}
        <div className="flex flex-col gap-4">
          {/* 详情面板 */}
          <div className="ui-panel p-4 rounded-2xl min-h-[300px]">
            <DetailPanel
              tool={selectedTool}
              onClose={() => setSelectedTool(null)}
              onAddToCompare={handleAddToCompare}
              isInCompare={isInCompare(selectedTool!)}
            />
          </div>

          {/* 比较面板 */}
          <div className="ui-panel p-4 rounded-2xl min-h-[250px] flex-1">
            <ComparePanel
              tools={compareTools}
              onRemove={handleRemoveFromCompare}
              onClear={handleClearCompare}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
