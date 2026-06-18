import { useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordCloud } from './ReportCharts';
import { nps } from '../../data/surveyReportData';

type NpsFilter = 'all' | 'promote' | 'passive' | 'detractor';

const filters: { key: NpsFilter; label: string; color: string }[] = [
  { key: 'all', label: '전체', color: 'bg-sk-gray-800' },
  { key: 'promote', label: '추천', color: 'bg-sk-orange' },
  { key: 'passive', label: '보통', color: 'bg-sk-gray-400' },
  { key: 'detractor', label: '비추천', color: 'bg-sk-gray-500' },
];

const typeLabel: Record<string, string> = {
  promote: '추천',
  passive: '보통',
  detractor: '비추천',
};

/** 메인 화면용 — 키워드만 */
export function NpsReasonKeywords() {
  const { reason } = nps;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-sk-orange/15 bg-sk-orange-light/20 p-3">
        <p className="mb-2 text-xs font-semibold text-sk-orange">추천</p>
        <WordCloud words={reason.keywords.promote} variant="positive" compact />
      </div>
      <div className="rounded-xl border border-sk-gray-200 bg-sk-gray-25 p-3">
        <p className="mb-2 text-xs font-semibold text-sk-gray-600">보통</p>
        <WordCloud words={reason.keywords.passive} variant="negative" compact />
      </div>
      <div className="rounded-xl border border-sk-gray-200 bg-sk-gray-100 p-3">
        <p className="mb-2 text-xs font-semibold text-sk-gray-600">비추천</p>
        <WordCloud words={reason.keywords.detractor} variant="negative" compact />
      </div>
    </div>
  );
}

/** 상세 화면용 — 키워드 + 주관식 원문 */
export function NpsReasonPanel() {
  const { reason } = nps;
  const [filter, setFilter] = useState<NpsFilter>('all');
  const comments = reason.comments.filter((c) => filter === 'all' || c.type === filter);

  return (
    <div>
      <p className="mb-4 text-sm text-sk-gray-600">
        <span className="font-medium text-sk-gray-800">문항:</span> {reason.question}
      </p>

      <NpsReasonKeywords />

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-sk-gray-800">주관식 응답 원문</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f.key
                  ? `${f.color} text-white`
                  : 'border border-sk-gray-200 bg-white text-sk-gray-600 hover:border-sk-orange/30'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                (
                {f.key === 'all'
                  ? reason.comments.length
                  : reason.comments.filter((c) => c.type === f.key).length}
                )
              </span>
            </button>
          ))}
        </div>

        <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
          {comments.map((comment, idx) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-xl border p-4 ${
                comment.type === 'promote'
                  ? 'border-sk-orange/15 bg-sk-orange-light/20'
                  : comment.type === 'detractor'
                    ? 'border-sk-gray-300 bg-sk-gray-100'
                    : 'border-sk-gray-200 bg-sk-gray-25'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    comment.type === 'promote'
                      ? 'bg-sk-orange/10 text-sk-orange'
                      : 'bg-sk-gray-200 text-sk-gray-600'
                  }`}
                >
                  <MessageSquareQuote className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-sk-gray-700">"{comment.text}"</p>
                  <div className="mt-2 flex gap-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        comment.type === 'promote'
                          ? 'bg-sk-orange/10 text-sk-orange'
                          : 'bg-sk-gray-200 text-sk-gray-600'
                      }`}
                    >
                      {typeLabel[comment.type]}
                    </span>
                    <span className="inline-block rounded-full border border-sk-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-sk-gray-500">
                      {comment.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
