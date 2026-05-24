type QuestionAnswer = {
  label?: string;
  question: string;
  answer: string;
};

function parseQuestionAnswer(entry: string): QuestionAnswer | null {
  // Supports patterns like:
  // Q1. Question text A: Answer text
  // Q: Question text A: Answer text
  const match = entry.match(/^\s*(Q\d*)[\).:\-]?\s*(.+?)\s+A:\s+(.+)$/i);
  if (!match) return null;

  const label = match[1]?.trim();
  const question = match[2]?.trim();
  const answer = match[3]?.trim();
  if (!question || !answer) return null;

  return { label, question, answer };
}

export function QuestionAnswerRenderer({ items }: { items: string[] }) {
  const parsed = items.map(parseQuestionAnswer);
  const validCount = parsed.filter(Boolean).length;

  // Auto-detect interview style only when most entries are parseable Q/A.
  const shouldRenderInterview = items.length > 0 && validCount / items.length >= 0.6;

  if (!shouldRenderInterview) {
    return (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-xl border border-(--border) bg-(--bg-surface) px-5 py-4 min-w-0 text-sm text-(--text-2) flex items-start gap-2 leading-relaxed"
          >
            <span className="text-(--accent-fg) mt-1 shrink-0">•</span>
            <span className="min-w-0 flex-1 wrap-anywhere whitespace-normal">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {parsed.map((qa, index) => {
        if (!qa) return null;

        return (
          <article
            key={index}
            className="rounded-xl border border-(--border) bg-(--bg-surface) overflow-hidden"
          >
            <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-(--border) bg-(--bg-elevated)">
              <span className="inline-flex items-center rounded-full border border-(--border) bg-(--bg-surface) px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-(--text-2)">
                {qa.label ?? `Q${index + 1}`}
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-(--text-3)">
                Interview Prompt
              </span>
            </header>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-(--text-3)">
                Question
              </p>
              <p className="mt-1.5 text-sm font-medium text-(--text-1) leading-relaxed wrap-anywhere">
                {qa.question}
              </p>
            </div>

            <div className="px-5 py-4 border-t border-(--border) bg-(--bg-elevated)">
              <p className="text-xs font-semibold tracking-wider uppercase text-(--text-3)">
                Answer
              </p>
              <p className="mt-1.5 text-sm text-(--text-2) leading-relaxed wrap-anywhere">
                {qa.answer}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
