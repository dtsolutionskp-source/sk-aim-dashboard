import { useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';
import { freeResponse } from '../../data/surveyReportData';

type Filter = 'all' | 'positive' | 'negative';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'positive', label: '긍정' },
  { key: 'negative', label: '부정' },
];

export function FreeResponsePanel({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<Filter>('all');
  const comments = freeResponse.comments.filter(
    (c) => filter === 'all' || c.sentiment === filter,
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f.key
                ? f.key === 'positive'
                  ? 'bg-sk-orange text-white'
                  : f.key === 'negative'
                    ? 'bg-sk-gray-600 text-white'
                    : 'bg-sk-gray-800 text-white'
                : 'border border-sk-gray-200 bg-white text-sk-gray-600 hover:border-sk-orange/30'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({f.key === 'all'
                ? freeResponse.comments.length
                : freeResponse.comments.filter((c) => c.sentiment === f.key).length}
              )
            </span>
          </button>
        ))}
      </div>

      <div className={`space-y-3 overflow-y-auto pr-1 ${compact ? 'max-h-64' : 'max-h-[480px]'}`}>
        {comments.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`rounded-xl border p-4 ${
              comment.sentiment === 'positive'
                ? 'border-sk-orange/15 bg-sk-orange-light/20'
                : 'border-sk-gray-200 bg-sk-gray-25'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  comment.sentiment === 'positive'
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
                      comment.sentiment === 'positive'
                        ? 'bg-sk-orange/10 text-sk-orange'
                        : 'bg-sk-gray-200 text-sk-gray-600'
                    }`}
                  >
                    {comment.sentiment === 'positive' ? '긍정' : '부정'}
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
  );
}
