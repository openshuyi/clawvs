import { primaryCategories, toolTags, tools, type PrimaryCategory, type ToolProfile, type ToolSlug, type ToolTag } from '@/lib/tools';

export const arenaToolOrder = ['openclaw', 'openinterpreter', 'plandex', 'anthropic-computer-use', 'crewai'] as const;

export type ArenaToolSlug = (typeof arenaToolOrder)[number];
export { tools };
export type { ToolProfile, ToolSlug };
export { primaryCategories, toolTags };
export type { PrimaryCategory, ToolTag };

export const siteStats = [
  `已收录 ${tools.length} 个核心产品（开源 9 / 商业 8）`,
  '竞品调研覆盖 299 个相关产品',
  '覆盖 Computer Use / Code Agent / 多 Agent 协作',
  '支持 Stars、语言、地域与开源状态筛选',
];

export type ComparisonRow = {
  label: string;
  detail: string;
  values: Record<ArenaToolSlug, string>;
};

export const comparisonRows: ComparisonRow[] = [
  {
    label: '权限等级',
    detail: 'Root / Shell / Desktop 控制范围',
    values: {
      openclaw: 'Shell + Desktop',
      openinterpreter: 'Shell 为主',
      plandex: 'Shell + 计划执行',
      'anthropic-computer-use': 'Desktop 为主',
      crewai: '编排层 + 工具调用',
    },
  },
  {
    label: '连接性',
    detail: '是否依赖外部服务与隧道',
    values: {
      openclaw: '可选 Discord + Tailscale',
      openinterpreter: '本地直连',
      plandex: '本地/远端可选',
      'anthropic-computer-use': '依赖官方 API',
      crewai: '依赖模型 API',
    },
  },
  {
    label: '模型兼容性',
    detail: '主流模型支持广度',
    values: {
      openclaw: 'GPT-4o / Claude / DeepSeek',
      openinterpreter: 'GPT-4o / Claude / Local',
      plandex: 'GPT-4o / Claude / DeepSeek',
      'anthropic-computer-use': 'Claude 系列',
      crewai: '多模型 + 自定义',
    },
  },
  {
    label: '部署难度',
    detail: '从本地到团队落地复杂度',
    values: {
      openclaw: '中等',
      openinterpreter: '低',
      plandex: '中等',
      'anthropic-computer-use': '中高',
      crewai: '中等',
    },
  },
  {
    label: '离线能力',
    detail: '是否支持 Local-first',
    values: {
      openclaw: '部分支持',
      openinterpreter: '支持',
      plandex: '支持',
      'anthropic-computer-use': '不支持',
      crewai: '支持',
    },
  },
  {
    label: '安全治理',
    detail: '权限审计与操作边界',
    values: {
      openclaw: '细粒度策略',
      openinterpreter: '依赖本地策略',
      plandex: '任务级控制',
      'anthropic-computer-use': '平台级控制',
      crewai: '流程级策略',
    },
  },
  {
    label: '任务成功率',
    detail: '复杂任务实测成功率',
    values: {
      openclaw: '86%',
      openinterpreter: '79%',
      plandex: '83%',
      'anthropic-computer-use': '88%',
      crewai: '81%',
    },
  },
  {
    label: '平均耗时',
    detail: '复杂任务执行平均分钟',
    values: {
      openclaw: '7.8 分钟',
      openinterpreter: '6.2 分钟',
      plandex: '9.4 分钟',
      'anthropic-computer-use': '6.9 分钟',
      crewai: '8.6 分钟',
    },
  },
];

export const promptSimulation = {
  prompt: '帮我找出当前目录下最大的 5 个文件并压缩。',
  outputs: [
    {
      tool: 'OpenClaw',
      steps: ['扫描目录', '按体积排序', '生成压缩包', '写入执行日志'],
      command: 'find . -type f -print0 | xargs -0 du -b | sort -nr | head -5',
      risk: '需要校验压缩目标路径权限',
    },
    {
      tool: 'OpenInterpreter',
      steps: ['解释任务', '组装 shell 命令', '输出可执行建议'],
      command: 'du -ah . | sort -rh | head -n 5 && tar -czf top5.tar.gz <files>',
      risk: '需要人工确认 <files> 替换结果',
    },
    {
      tool: 'Plandex',
      steps: ['拆分计划', '执行体积统计', '校验结果并压缩'],
      command: 'plan: scan -> select -> archive -> verify',
      risk: '计划层校验增加少量延迟',
    },
  ],
};

export const gfwMatrix = [
  { name: 'OpenClaw', status: '需要代理', reason: '部分连接链路依赖海外服务' },
  { name: 'OpenInterpreter', status: '直连可用', reason: '本地运行优先，无强制海外依赖' },
  { name: 'Plandex', status: '直连可用', reason: '本地模式可离线执行主要能力' },
  { name: 'Anthropic Computer Use', status: '强依赖海外服务', reason: '核心能力依赖官方云 API' },
  { name: 'CrewAI', status: '直连可用', reason: '编排层本地可运行，模型可替换' },
] as const;

export const logItems = [
  {
    title: 'OpenClaw 新增 Windows 桌面控制稳定通道',
    category: '功能更新',
    date: '2026-03-20',
    impact: '跨平台自动化任务稳定性显著提升',
    action: '优先升级桌面驱动并回归权限策略',
  },
  {
    title: 'Plandex 发布大规模任务恢复机制',
    category: '版本解读',
    date: '2026-03-18',
    impact: '长链路任务中断恢复成本下降',
    action: '为关键流程启用 checkpoint 模式',
  },
  {
    title: 'CrewAI 推出企业审计流水集成',
    category: '生态事件',
    date: '2026-03-15',
    impact: '多 Agent 行为可观测性增强',
    action: '将审计事件接入 SIEM 平台',
  },
  {
    title: 'Anthropic Computer Use 扩展到更多 GUI 场景',
    category: '重大变化',
    date: '2026-03-13',
    impact: '界面自动化覆盖率提升，但成本仍偏高',
    action: '仅在高价值流程试点，控制 API 成本',
  },
];

export type QuizOption = {
  label: string;
  value: string;
  weight: Record<ArenaToolSlug, number>;
};

export type QuizQuestion = {
  id: string;
  title: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'runtime',
    title: '你主要在哪种环境运行 Agent？',
    options: [
      {
        label: '个人 Mac / 开发机',
        value: 'personal',
        weight: {
          openclaw: 2,
          openinterpreter: 4,
          plandex: 3,
          'anthropic-computer-use': 2,
          crewai: 2,
        },
      },
      {
        label: '云服务器 / 团队集群',
        value: 'server',
        weight: {
          openclaw: 4,
          openinterpreter: 2,
          plandex: 4,
          'anthropic-computer-use': 3,
          crewai: 4,
        },
      },
    ],
  },
  {
    id: 'privacy',
    title: '你对本地隐私与离线能力是否敏感？',
    options: [
      {
        label: '非常敏感，优先本地运行',
        value: 'local',
        weight: {
          openclaw: 3,
          openinterpreter: 4,
          plandex: 4,
          'anthropic-computer-use': 1,
          crewai: 3,
        },
      },
      {
        label: '可接受云端能力换效率',
        value: 'cloud',
        weight: {
          openclaw: 3,
          openinterpreter: 2,
          plandex: 3,
          'anthropic-computer-use': 4,
          crewai: 3,
        },
      },
    ],
  },
  {
    id: 'workflow',
    title: '你的任务更偏向哪一种？',
    options: [
      {
        label: '桌面与系统自动化',
        value: 'desktop',
        weight: {
          openclaw: 4,
          openinterpreter: 2,
          plandex: 2,
          'anthropic-computer-use': 4,
          crewai: 2,
        },
      },
      {
        label: '多步骤开发与编排',
        value: 'orchestration',
        weight: {
          openclaw: 3,
          openinterpreter: 2,
          plandex: 4,
          'anthropic-computer-use': 2,
          crewai: 4,
        },
      },
    ],
  },
  {
    id: 'network',
    title: '你的网络环境限制如何？',
    options: [
      {
        label: '限制较多，尽量直连',
        value: 'strict',
        weight: {
          openclaw: 2,
          openinterpreter: 4,
          plandex: 4,
          'anthropic-computer-use': 1,
          crewai: 4,
        },
      },
      {
        label: '可配置代理与外网',
        value: 'open',
        weight: {
          openclaw: 4,
          openinterpreter: 2,
          plandex: 3,
          'anthropic-computer-use': 4,
          crewai: 3,
        },
      },
    ],
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
