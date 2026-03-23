import { ToolProfile } from '@/lib/tools/types';

// 数值型维度键
export type MetricKey = 
  | 'githubStars' 
  | 'successRate' 
  | 'avgDuration' 
  | 'retries' 
  | 'security' 
  | 'speed' 
  | 'flexibility' 
  | 'stability' 
  | 'docs' 
  | 'avgRating';

// 分类型维度键
export type CategoryKey = 
  | 'primaryCategory' 
  | 'sourceType' 
  | 'region' 
  | 'deployment' 
  | 'primaryLanguage';

// 维度配置接口
export interface DimensionConfig {
  x: MetricKey;
  y: MetricKey;
  color: CategoryKey;
  size: MetricKey;
}

// 预设视图配置
export interface PresetView {
  id: string;
  name: string;
  config: DimensionConfig;
}

// 筛选状态接口
export interface FilterState {
  categories: string[];
  sourceTypes: string[];
  regions: string[];
  tags: string[];
  minRating: number;
  starsRange: [number, number];
}

// 气泡图数据项
export interface BubbleDataItem {
  slug: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  category: string;
  tool: ToolProfile;
}

// 默认维度配置
export const DEFAULT_DIMENSION_CONFIG: DimensionConfig = {
  x: 'githubStars',
  y: 'successRate',
  color: 'primaryCategory',
  size: 'avgRating',
};

// 预设视图列表
export const PRESET_VIEWS: PresetView[] = [
  {
    id: 'default',
    name: '默认视图',
    config: {
      x: 'githubStars',
      y: 'successRate',
      color: 'primaryCategory',
      size: 'avgRating',
    },
  },
  {
    id: 'performance',
    name: '性能分析',
    config: {
      x: 'speed',
      y: 'stability',
      color: 'deployment',
      size: 'successRate',
    },
  },
  {
    id: 'community',
    name: '社区生态',
    config: {
      x: 'githubStars',
      y: 'docs',
      color: 'sourceType',
      size: 'flexibility',
    },
  },
  {
    id: 'security',
    name: '安全评估',
    config: {
      x: 'security',
      y: 'stability',
      color: 'sourceType',
      size: 'avgRating',
    },
  },
  {
    id: 'efficiency',
    name: '效率分析',
    config: {
      x: 'avgDuration',
      y: 'retries',
      color: 'primaryCategory',
      size: 'successRate',
    },
  },
];

// 维度标签映射
export const DIMENSION_LABELS: Record<string, string> = {
  // 数值型
  githubStars: 'GitHub Stars',
  successRate: '成功率 (%)',
  avgDuration: '平均时长 (分钟)',
  retries: '重试次数',
  security: '安全性',
  speed: '响应速度',
  flexibility: '灵活性',
  stability: '稳定性',
  docs: '文档生态',
  avgRating: '综合评分',
  // 分类型
  primaryCategory: '主要分类',
  sourceType: '来源类型',
  region: '地区',
  deployment: '部署方式',
  primaryLanguage: '编程语言',
};

// 分类颜色映射
export const CATEGORY_COLORS: Record<string, string> = {
  'OpenClaw 生态': '#00f0ff',
  'OpenClaw 云服务': '#10b981',
  'Computer Use / 桌面自动化': '#ff3c00',
  'Code Agent / 开发助手': '#8b5cf6',
  '通用任务执行 Agent': '#ec4899',
  '多 Agent 协作框架': '#f59e0b',
  '应用平台 / 工作流平台': '#06b6d4',
  'RPA 自动化': '#84cc16',
  '云厂商 Agent 服务': '#f97316',
  'AI 编排与工作流平台': '#6366f1',
};

// 来源类型颜色
export const SOURCE_TYPE_COLORS: Record<string, string> = {
  '开源': '#10b981',
  '闭源': '#f43f5e',
  '部分开源': '#f59e0b',
};

// 地区颜色
export const REGION_COLORS: Record<string, string> = {
  '国内': '#3b82f6',
  '海外': '#f97316',
  '全球': '#8b5cf6',
};

// 获取维度值的辅助函数
export function getMetricValue(tool: ToolProfile, key: MetricKey): number {
  switch (key) {
    case 'githubStars':
      return tool.githubStars || 0;
    case 'successRate':
      return tool.benchmark?.successRate || 0;
    case 'avgDuration':
      return tool.benchmark?.avgDurationMin || 0;
    case 'retries':
      return tool.benchmark?.retries || 0;
    case 'security':
      return tool.rating.security || 0;
    case 'speed':
      return tool.rating.speed || 0;
    case 'flexibility':
      return tool.rating.flexibility || 0;
    case 'stability':
      return tool.rating.stability || 0;
    case 'docs':
      return tool.rating.docs || 0;
    case 'avgRating':
      return (
        tool.rating.security +
        tool.rating.speed +
        tool.rating.flexibility +
        tool.rating.stability +
        tool.rating.docs
      ) / 5;
    default:
      return 0;
  }
}

// 获取分类值的辅助函数
export function getCategoryValue(tool: ToolProfile, key: CategoryKey): string {
  switch (key) {
    case 'primaryCategory':
      return tool.primaryCategory;
    case 'sourceType':
      return tool.sourceType;
    case 'region':
      return tool.region;
    case 'deployment':
      return tool.deployment;
    case 'primaryLanguage':
      return tool.primaryLanguage || '未知';
    default:
      return '未知';
  }
}

// 获取分类颜色的辅助函数
export function getCategoryColor(category: string, colorKey: CategoryKey): string {
  if (colorKey === 'sourceType') {
    return SOURCE_TYPE_COLORS[category] || '#6b7280';
  }
  if (colorKey === 'region') {
    return REGION_COLORS[category] || '#6b7280';
  }
  return CATEGORY_COLORS[category] || '#6b7280';
}
