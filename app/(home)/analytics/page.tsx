import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const metadata = {
  title: '多维分析 | Claw VS',
  description: 'AI Agent 多维度可视化数据分析，基于能力雷达图与社区分布散点图。',
};

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="ui-title text-3xl font-bold md:text-4xl">多维可视化分析</h1>
        <p className="ui-subtitle mt-2 text-sm md:text-base max-w-3xl">
          基于实测数据与多维评分，通过专业图表全方位对比各大 AI Agent 的核心能力，洞察开源社区的最新技术生态与发展趋势。
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
