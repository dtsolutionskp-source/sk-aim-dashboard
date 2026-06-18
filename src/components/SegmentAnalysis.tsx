import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Card } from './ui';
import {
  segmentAnalysis,
  topSegmentsByRank,
  type SegmentProfile,
} from '../data/segmentData';

function formatCount(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return n.toLocaleString();
}

/** 전체 세그먼트 — 기준 vs 방문객 이중 막대 */
export function SegmentComparisonChart({ segments }: { segments: SegmentProfile[] }) {
  const max = Math.max(...segments.flatMap((s) => [s.benchmarkPct, s.targetPct]));

  return (
    <div className="space-y-3">
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-sk-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm bg-sk-gray-300" />
          {segmentAnalysis.benchmarkLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm gradient-sk" />
          {segmentAnalysis.targetLabel}
        </span>
      </div>
      {segments.map((s, i) => (
        <div key={s.id} className="rounded-xl border border-sk-gray-100 bg-sk-gray-25/50 px-3 py-2.5">
          <div className="mb-2 flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-sk-gray-800">{s.label}</span>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-sk-orange">
              {s.targetPct}%
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-[10px] text-sk-gray-400">일반</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-gray-100">
                <motion.div
                  className="h-full rounded-full bg-sk-gray-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(s.benchmarkPct / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.02 }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-sk-gray-500">
                {s.benchmarkPct}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-[10px] font-medium text-sk-orange">방문객</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sk-gray-100">
                <motion.div
                  className="h-full rounded-full gradient-sk"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(s.targetPct / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[10px] font-semibold tabular-nums text-sk-orange">
                {s.targetPct}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** 관심사 순위 */
export function SegmentRankList({
  segments,
  selectedId,
  onSelect,
}: {
  segments: SegmentProfile[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {segments.map((s, idx) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
            selectedId === s.id
              ? 'border-sk-orange/40 bg-sk-orange-light/40 shadow-sm'
              : 'border-sk-gray-100 bg-white hover:border-sk-orange/20 hover:bg-sk-orange-light/20'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              idx < 3 ? 'gradient-sk text-white' : 'bg-sk-gray-100 text-sk-gray-500'
            }`}
          >
            {idx + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sk-gray-800">{s.label}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-sk-orange">
                {s.targetPct}%
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-sk-gray-400">
              일반 {s.benchmarkPct}% · 모수 {formatCount(s.count)}명
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

function CompareStrip({
  label,
  female,
  male,
  variant,
}: {
  label: string;
  female: number;
  male: number;
  variant: 'benchmark' | 'target';
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium text-sk-gray-500">{label}</p>
      <div className="flex h-3 overflow-hidden rounded-full bg-sk-gray-100">
        <div
          className={`h-full ${variant === 'target' ? 'bg-sk-orange' : 'bg-sk-gray-400'}`}
          style={{ width: `${female}%` }}
        />
        <div className="h-full bg-sk-gray-200" style={{ width: `${male}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-sk-gray-500">
        <span>♀ {female}%</span>
        <span>♂ {male}%</span>
      </div>
    </div>
  );
}

function CompareAgeBars({
  label,
  data,
  variant,
}: {
  label: string;
  data: { label: string; value: number }[];
  variant: 'benchmark' | 'target';
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div>
      <p className="mb-2 text-[10px] font-medium text-sk-gray-500">{label}</p>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[10px] text-sk-gray-500">{d.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sk-gray-100">
              <div
                className={`h-full rounded-full ${variant === 'target' ? 'gradient-sk' : 'bg-sk-gray-400'}`}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-sk-gray-500">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SegmentDetailPanel({ segment }: { segment: SegmentProfile }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 rounded-xl border border-sk-gray-100 bg-sk-gray-25 px-4 py-3">
        <span className="rounded-lg bg-white px-2.5 py-1 text-xs text-sk-gray-600">
          일반 {segment.benchmarkPct}%
        </span>
        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-sk-orange">
          방문객 {segment.targetPct}%
        </span>
        <span className="rounded-lg bg-white px-2.5 py-1 text-xs text-sk-gray-600">
          모수 {formatCount(segment.count)}명
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
          <p className="mb-3 text-xs font-bold text-sk-gray-700">성별 비교</p>
          <div className="space-y-4">
            <CompareStrip
              label={segmentAnalysis.benchmarkLabel}
              female={segment.benchmarkGender.female}
              male={segment.benchmarkGender.male}
              variant="benchmark"
            />
            <CompareStrip
              label={segmentAnalysis.targetLabel}
              female={segment.gender.female}
              male={segment.gender.male}
              variant="target"
            />
          </div>
        </div>
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
          <p className="mb-3 text-xs font-bold text-sk-gray-700">연령 분포 비교</p>
          <div className="space-y-4">
            <CompareAgeBars
              label={segmentAnalysis.benchmarkLabel}
              data={segment.benchmarkAge}
              variant="benchmark"
            />
            <CompareAgeBars
              label={segmentAnalysis.targetLabel}
              data={segment.age}
              variant="target"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SegmentAnalysisView() {
  const [selectedId, setSelectedId] = useState(topSegmentsByRank[0]?.id ?? 'food');
  const selected = useMemo(
    () => segmentAnalysis.segments.find((s) => s.id === selectedId) ?? segmentAnalysis.segments[0],
    [selectedId],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 p-4">
          <p className="flex items-center gap-1.5 text-xs text-sk-gray-500">
            <Users className="h-3.5 w-3.5" />
            방문객 규모
          </p>
          <p className="mt-1 text-2xl font-bold text-sk-orange">
            {segmentAnalysis.totalVisitors.toLocaleString()}
            <span className="ml-1 text-sm font-medium">명</span>
          </p>
        </div>
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
          <p className="text-xs text-sk-gray-500">관심사 세그먼트</p>
          <p className="mt-1 text-2xl font-bold text-sk-gray-800">{segmentAnalysis.segments.length}개</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="관심사 순위" subtitle="축제 방문객 점유율 순 · 클릭 시 하단 상세">
          <SegmentRankList
            segments={topSegmentsByRank}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Card>

        <Card title="일반 기준 비교" subtitle="일반 vs 축제 방문객 점유율">
          <SegmentComparisonChart segments={topSegmentsByRank} />
        </Card>
      </div>

      <Card title="세그먼트 상세" subtitle="성별·연령 — 일반 기준과 비교">
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-medium text-sk-gray-500">관심사 선택</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full max-w-md rounded-xl border border-sk-gray-200 bg-white px-4 py-2.5 text-sm text-sk-gray-800 focus:border-sk-orange focus:outline-none focus:ring-2 focus:ring-sk-orange/20"
          >
            {topSegmentsByRank.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({s.targetPct}%)
              </option>
            ))}
          </select>
        </div>
        {selected && <SegmentDetailPanel segment={selected} />}
      </Card>
    </div>
  );
}
