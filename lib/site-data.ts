export const siteStats = [
  '已收录 42 个 Agent 工具',
  '今日更新 2 个版本',
  '本周新增 8 条兼容性结论',
  '实测任务累计 1,280 次',
];

export type ToolSlug =
  | 'openclaw'
  | 'openinterpreter'
  | 'plandex'
  | 'anthropic-computer-use'
  | 'crewai';

export type ToolProfile = {
  slug: ToolSlug;
  name: string;
  tagline: string;
  summary: string;
  focus: string;
  deployment: string;
  modelSupport: string[];
  connectivity: string[];
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

export const tools: ToolProfile[] = [
  {
    slug: 'openclaw',
    name: 'OpenClaw',
    tagline: '桌面 + Shell 的全栈自动化 Agent',
    summary: '适合需要真实操作系统控制能力的自动化团队。',
    focus: '桌面控制、命令执行、跨流程编排',
    deployment: 'Docker 与脚本化部署都可行，云端需处理网络出口策略。',
    modelSupport: ['GPT-4o', 'Claude 3.5', 'DeepSeek R1'],
    connectivity: ['可选 Discord 通道', 'Tailscale 内网穿透', '本地 Agent 网关'],
    gfwStatus: '需要代理',
    pitfalls: [
      '海外网络波动时首次连接耗时较高',
      '桌面权限需要额外加固审计策略',
      '混合云场景建议拆分执行与调度节点',
    ],
    benchmark: {
      successRate: 86,
      avgDurationMin: 7.8,
      retries: 1.3,
    },
    community: {
      stars: '18.4k',
      release: 'v0.19.2',
      trend: '近 30 天活跃提交稳定增长',
    },
    rating: {
      security: 8.2,
      speed: 8.4,
      flexibility: 9.1,
      stability: 8.1,
      docs: 7.8,
    },
  },
  {
    slug: 'openinterpreter',
    name: 'OpenInterpreter',
    tagline: '命令行优先的个人 AI 终端助手',
    summary: '上手快，适合单机开发辅助和脚本型任务。',
    focus: '本地命令执行、代码解释、轻量自动化',
    deployment: '本地 pip 安装最便捷，企业化治理能力中等。',
    modelSupport: ['GPT-4o', 'Claude 3.5', '本地 LLM'],
    connectivity: ['本地运行', '可选云模型 API'],
    gfwStatus: '直连可用',
    pitfalls: [
      '复杂多步骤任务时需要人工分段引导',
      '长期运行会话需手动管理上下文',
      '团队协作能力弱于编排型框架',
    ],
    benchmark: {
      successRate: 79,
      avgDurationMin: 6.2,
      retries: 1.9,
    },
    community: {
      stars: '57.2k',
      release: 'v0.5.6',
      trend: '社区热度高，生态插件丰富',
    },
    rating: {
      security: 7.5,
      speed: 8.6,
      flexibility: 7.9,
      stability: 7.4,
      docs: 8.3,
    },
  },
  {
    slug: 'plandex',
    name: 'Plandex',
    tagline: '面向复杂开发任务的计划驱动 Agent',
    summary: '强调任务分解和长链路执行的一致性。',
    focus: '多阶段计划、代码库级重构、任务恢复',
    deployment: 'CLI 安装快，团队部署需要配置统一状态存储。',
    modelSupport: ['GPT-4o', 'Claude 3.5', 'DeepSeek R1'],
    connectivity: ['本地模式', '远程执行节点'],
    gfwStatus: '直连可用',
    pitfalls: [
      '计划层级过深时执行时间拉长',
      '首次接入需要定义项目级约束模板',
      '并行任务策略需要经验调参',
    ],
    benchmark: {
      successRate: 83,
      avgDurationMin: 9.4,
      retries: 1.4,
    },
    community: {
      stars: '13.7k',
      release: 'v1.11.0',
      trend: '企业用户增长明显',
    },
    rating: {
      security: 8.1,
      speed: 7.5,
      flexibility: 8.9,
      stability: 8.3,
      docs: 7.7,
    },
  },
  {
    slug: 'anthropic-computer-use',
    name: 'Anthropic Computer Use',
    tagline: '模型原生桌面操作能力',
    summary: '交互能力强，适合复杂 GUI 自动化原型验证。',
    focus: '视觉理解、界面操作、跨应用流程',
    deployment: '主要依赖云端能力，私有化路径受限。',
    modelSupport: ['Claude 3.5', 'Claude Sonnet 系列'],
    connectivity: ['Anthropic API', '云端推理'],
    gfwStatus: '强依赖海外服务',
    pitfalls: [
      '网络策略和成本控制是关键风险',
      '受服务区域与合规条件限制',
      '离线场景适配困难',
    ],
    benchmark: {
      successRate: 88,
      avgDurationMin: 6.9,
      retries: 1.2,
    },
    community: {
      stars: '官方能力集成',
      release: '2026-Q1 更新',
      trend: '企业试点增长快',
    },
    rating: {
      security: 8.4,
      speed: 8.9,
      flexibility: 8.1,
      stability: 8.2,
      docs: 8.0,
    },
  },
  {
    slug: 'crewai',
    name: 'CrewAI',
    tagline: '多 Agent 协作编排框架',
    summary: '适合搭建角色化、多任务分工的企业工作流。',
    focus: '角色分工、任务路由、流程治理',
    deployment: 'Python 生态友好，生产环境建议容器化。',
    modelSupport: ['GPT-4o', 'Claude 3.5', 'Gemini', '本地 LLM'],
    connectivity: ['本地或云端均可', '可接入企业内部工具'],
    gfwStatus: '直连可用',
    pitfalls: [
      '流程设计不当会引起链路冗余',
      '多角色提示词治理成本较高',
      '可观测性体系需要额外建设',
    ],
    benchmark: {
      successRate: 81,
      avgDurationMin: 8.6,
      retries: 1.6,
    },
    community: {
      stars: '31.5k',
      release: 'v0.88.1',
      trend: '企业编排场景热度持续提升',
    },
    rating: {
      security: 8.0,
      speed: 7.8,
      flexibility: 9.0,
      stability: 7.9,
      docs: 8.1,
    },
  },
];

export type ComparisonRow = {
  label: string;
  detail: string;
  values: Record<ToolSlug, string>;
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
  weight: Record<ToolSlug, number>;
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

export const arenaToolOrder: ToolSlug[] = [
  'openclaw',
  'openinterpreter',
  'plandex',
  'anthropic-computer-use',
  'crewai',
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
