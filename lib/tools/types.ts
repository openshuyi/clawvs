export type ToolSlug = string;

export const primaryCategories = [
  'OpenClaw 生态',
  'Computer Use / 桌面自动化',
  'Code Agent / 开发助手',
  '通用任务执行 Agent',
  '多 Agent 协作框架',
  '应用平台 / 工作流平台',
] as const;

export type PrimaryCategory = (typeof primaryCategories)[number];

export const toolTags = [
  '桌面控制',
  'Shell 执行',
  '代码生成',
  '工作流编排',
  '多角色协作',
  'RAG',
  '插件生态',
  '开源',
  '闭源',
  '云服务',
  '自部署',
  '本地优先',
  '研发提效',
  '运营自动化',
  '企业流程',
  '个人助手',
  'MVP 原型',
] as const;

export type ToolTag = (typeof toolTags)[number];

export type ToolProfile = {
  slug: ToolSlug;
  name: string;
  tagline: string;
  summary: string;
  vendor: string;
  sourceType: '开源' | '闭源';
  region: '国内' | '海外' | '全球';
  primaryCategory: PrimaryCategory;
  tags: ToolTag[];
  homepageUrl: string;
  githubUrl: string | null;
  docsUrl: string | null;
  githubStars: number | null;
  primaryLanguage: string | null;
  pricing: string;
  license: string;
  focus: string;
  deployment: string;
  modelSupport: string[];
  connectivity: string[];
  scenarios: string[];
  gfwStatus: '直连可用' | '需要代理' | '强依赖海外服务';
  pitfalls: string[];
  benchmark: {
    successRate: number;
    avgDurationMin: number;
    retries: number;
  };
  community: {
    stars: string;
    release: string;
    trend: string;
  };
  rating: {
    security: number;
    speed: number;
    flexibility: number;
    stability: number;
    docs: number;
  };
};
