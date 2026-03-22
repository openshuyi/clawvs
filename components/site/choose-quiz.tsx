'use client';

import { useMemo, useState } from 'react';
import { arenaToolOrder, getTool, quizQuestions, type ArenaToolSlug } from '@/lib/site-data';
import Link from 'next/link';

type Answers = Record<string, string>;

export function ChooseQuiz() {
  const [answers, setAnswers] = useState<Answers>({});

  const ranking = useMemo(() => {
    const scoreMap = Object.fromEntries(arenaToolOrder.map((slug) => [slug, 0])) as Record<ArenaToolSlug, number>;

    for (const question of quizQuestions) {
      const selectedValue = answers[question.id];
      if (!selectedValue) continue;

      const selectedOption = question.options.find((option) => option.value === selectedValue);
      if (!selectedOption) continue;

      for (const [slug, score] of Object.entries(selectedOption.weight) as [ArenaToolSlug, number][]) {
        scoreMap[slug] += score;
      }
    }

    return Object.entries(scoreMap)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, score]) => ({ slug: slug as ArenaToolSlug, score }));
  }, [answers]);

  const completed = Object.keys(answers).length === quizQuestions.length;
  const top = ranking[0];
  const runnerUp = ranking[1];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="ui-panel space-y-4 rounded-xl p-5 md:p-6">
        {quizQuestions.map((question, index) => (
          <div key={question.id} className="space-y-3 border-b border-border-color pb-5 last:border-0 last:pb-0">
            <p className="text-sm text-text-muted">问题 {index + 1}</p>
            <h3 className="text-base font-semibold text-text-primary md:text-lg">{question.title}</h3>
            <div className="grid gap-2">
              {question.options.map((option) => {
                const active = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                      active
                        ? 'border-accent-cyan bg-accent-cyan-soft text-accent-cyan'
                        : 'border-border-color bg-transparent text-text-secondary hover:border-accent-cyan'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="ui-panel-strong rounded-xl p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-accent-orange">推荐结果</p>
        {completed && top ? (
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-sm text-text-secondary">首选</p>
              <h3 className="text-2xl font-semibold text-text-primary">{getTool(top.slug)?.name}</h3>
              <p className="mt-2 text-sm text-text-secondary">{getTool(top.slug)?.summary}</p>
            </div>
            {runnerUp ? (
              <div className="rounded-lg border border-border-color bg-[color:color-mix(in_oklab,var(--bg-surface)_74%,transparent)] p-3">
                <p className="text-xs text-text-muted">次选</p>
                <p className="text-sm font-medium text-text-primary">{getTool(runnerUp.slug)?.name}</p>
              </div>
            ) : null}
            <div className="space-y-2 text-sm text-text-secondary">
              <p>推荐依据：运行环境、隐私偏好、工作流类型与网络限制综合评分。</p>
              <p>建议先在沙箱环境验证权限策略，再进入生产流程。</p>
            </div>
            <Link
              href={`/tools/${top.slug}`}
              className="ui-btn-cyan inline-flex rounded-md px-3 py-2 text-sm font-medium transition hover:brightness-110"
            >
              查看完整档案
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            <p>完成全部问答后，系统会生成首选工具与次选工具。</p>
            <p>当前进度：{Object.keys(answers).length + '/' + quizQuestions.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
