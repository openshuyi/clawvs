import type { Metadata } from 'next';
import { ChooseQuiz } from '@/components/site/choose-quiz';

export const metadata: Metadata = {
  title: 'Help Me Choose | Claw VS',
  description: '通过交互式问答快速匹配最适合你的 AI Agent 工具。',
};

export default function ChoosePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Help Me Choose</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">智选助手</h1>
        <p className="max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
          回答运行环境、隐私偏好、任务形态与网络约束四类问题，系统将返回首选工具与次选方案。
        </p>
      </header>
      <ChooseQuiz />
    </div>
  );
}
