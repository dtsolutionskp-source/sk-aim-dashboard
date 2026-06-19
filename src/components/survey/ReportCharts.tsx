import type { ReactNode } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { ChartTooltip } from './ChartTooltip';
import { TOTAL_RESPONDENTS, toCount } from '../../data/surveyReportData';
import { saveSurveyScroll } from '../../utils/surveyScroll';

/* ── Donut Chart ── */
interface DonutItem {
  label: string;
  value: number;
  color?: string;
}

export function DonutChart({
  data,
  size = 160,
  total = TOTAL_RESPONDENTS,
}: {
  data: DonutItem[];
  size?: number;
  total?: number;
}) {
  const sum = data.reduce((s, d) => s + d.value, 0);
  const r = 40;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  const defaultColors = ['#f47725', '#ff8c42', '#ffc078', '#adb5bd', '#dee2e6'];
  const [hovered, setHovered] = useState<{
    label: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const segments = data.reduce<
    Array<DonutItem & { dash: number; offset: number; color: string }>
  >((list, d, i) => {
    const pct = d.value / sum;
    const dash = pct * circ;
    const offset = list.reduce((sumOffset, seg) => sumOffset + seg.dash, 0);
    list.push({
      ...d,
      dash,
      offset,
      color: d.color ?? defaultColors[i % defaultColors.length],
    });
    return list;
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative">
        <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0 -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f3f5" strokeWidth="14" />
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
              strokeDashoffset={-seg.offset}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={(e) => {
                const rect = (e.target as SVGCircleElement).getBoundingClientRect();
                setHovered({ label: seg.label, value: seg.value, x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-sk-gray-800">{total.toLocaleString()}</span>
          <span className="text-[10px] text-sk-gray-400">명</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {segments.map((seg) => (
          <ChartTooltip key={seg.label} label={seg.label} value={seg.value} total={total}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: seg.color }} />
                <span className="text-sk-gray-700">{seg.label}</span>
              </span>
              <span className="font-semibold tabular-nums text-sk-gray-800">{seg.value}%</span>
            </div>
          </ChartTooltip>
        ))}
      </div>
      {hovered &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-full rounded-lg border border-sk-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: hovered.x, top: hovered.y - 8 }}
          >
            <p className="font-semibold text-sk-gray-800">{hovered.label}</p>
            <p className="mt-0.5 text-sk-gray-600">
              <span className="font-bold text-sk-orange">{hovered.value}%</span>
              <span className="mx-1 text-sk-gray-300">·</span>
              <span>{toCount(hovered.value, total)}명</span>
            </p>
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ── Horizontal Bar Chart ── */
export function HBarChart({
  data,
  maxValue = 100,
  showScore,
  total = TOTAL_RESPONDENTS,
}: {
  data: { label: string; value: number; score?: number }[];
  maxValue?: number;
  showScore?: boolean;
  total?: number;
}) {
  const max = showScore ? 5 : maxValue;
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => {
        const pct = showScore ? ((d.score ?? d.value) / max) * 100 : (d.value / max) * 100;
        const display = showScore ? (d.score ?? d.value) : d.value;
        return (
          <ChartTooltip
            key={d.label}
            label={d.label}
            value={display}
            total={total}
            unit={showScore ? '점' : '%'}
            className="w-full"
          >
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-sk-gray-700">{d.label}</span>
                <span className="font-semibold tabular-nums text-sk-gray-800">
                  {showScore ? display.toFixed(1) : `${display}%`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sk-gray-100">
                <motion.div
                  className="h-full rounded-full gradient-sk"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
              </div>
            </div>
          </ChartTooltip>
        );
      })}
    </div>
  );
}

/* ── Vertical Bar Chart ── */
export function VBarChart({
  data,
  total = TOTAL_RESPONDENTS,
}: {
  data: { label: string; value: number }[];
  total?: number;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="mobile-scroll-x -mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex min-w-[280px] items-end justify-between gap-1.5 sm:min-w-0" style={{ height: 160 }}>
      {data.map((d, i) => (
        <ChartTooltip key={d.label} label={d.label} value={d.value} total={total}>
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-semibold tabular-nums text-sk-gray-600">{d.value}%</span>
            <motion.div
              className="w-full rounded-t-md gradient-sk"
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.value / max) * 120}px` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              style={{ minHeight: 4 }}
            />
            <span className="mt-1 max-w-[3.5rem] text-center text-[9px] leading-tight text-sk-gray-500 sm:max-w-none">{d.label}</span>
          </div>
        </ChartTooltip>
      ))}
      </div>
    </div>
  );
}

/* ── 점수 강조 (막대 없이 숫자만) ── */
export function ScoreHighlight({
  value,
  max = 5,
  label = '전체 평균',
  unit = '점',
}: {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 px-6 py-10 text-center">
      <p className="text-xs font-medium text-sk-gray-500">{label}</p>
      <p className="mt-3 text-5xl font-bold tabular-nums tracking-tight text-sk-orange">
        {value.toFixed(1)}
      </p>
      <p className="mt-2 text-sm text-sk-gray-500">
        {max.toFixed(1)}{unit} 만점
      </p>
    </div>
  );
}

/* ── Gauge ── */
export function GaugeChart({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = (value / max) * 100;
  const angle = (pct / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" width={160} height={90}>
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#f1f3f5" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 65 A 50 50 0 0 1 110 65"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 157} 157`}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f47725" />
            <stop offset="100%" stopColor="#ea002c" />
          </linearGradient>
        </defs>
        <text x="60" y="58" textAnchor="middle" fontSize="18" fontWeight="700" fill="#191f28">
          {value}
        </text>
        <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#868e96">
          / {max}.0
        </text>
      </svg>
      {label && <p className="text-sm font-medium text-sk-gray-600">{label}</p>}
    </div>
  );
}

function isGenderCategory(items: { label: string }[]) {
  return items.length <= 2 && items.every((i) => i.label === '남성' || i.label === '여성');
}

function GenderStrip({ female, male }: { female: number; male: number }) {
  return (
    <div className="mt-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-sk-gray-100">
        <motion.div
          className="h-full bg-sk-orange"
          initial={{ width: 0 }}
          whileInView={{ width: `${female}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        />
        <motion.div
          className="h-full bg-sk-gray-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${male}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium">
        <span className="text-sk-orange">♀ 여성 {female}%</span>
        <span className="text-sk-gray-500">♂ 남성 {male}%</span>
      </div>
    </div>
  );
}

function AgeBreakdownRow({
  series,
  ageVals,
  total,
}: {
  series: { label: string; color: string; values: number[] }[];
  ageVals: number[];
  total: number;
}) {
  const ageSum = ageVals.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="mt-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-sk-gray-100">
        {series.map((s, si) => {
          const segPct = (ageVals[si] / ageSum) * 100;
          return (
            <div
              key={s.label}
              className="h-full"
              style={{
                width: `${segPct}%`,
                backgroundColor: s.color,
                minWidth: segPct > 0 ? 2 : 0,
              }}
              title={`${s.label} ${Math.round(segPct)}% (${toCount(Math.round(ageVals[si]), total)}명)`}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        {series.map((s, si) => {
          const pct = Math.round((ageVals[si] / ageSum) * 100);
          return (
            <span key={s.label} className="text-[10px] text-sk-gray-500">
              <span style={{ color: s.color }}>●</span> {s.label} {pct}%
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── 평균 + 연령별 막대 (요약: 평균만 / 상세: 연령 포함) ── */
export function AvgWithAgeChart({
  items,
  series,
  genderSeries,
  showAgeBreakdown = true,
  showScore = false,
  maxScore = 5,
  total = TOTAL_RESPONDENTS,
}: {
  items: { label: string; overall: number }[];
  series: { label: string; color: string; values: number[] }[];
  genderSeries?: { label: string; color: string; values: number[] }[];
  showAgeBreakdown?: boolean;
  showScore?: boolean;
  maxScore?: number;
  total?: number;
}) {
  const scaleMax = showScore ? maxScore : 100;
  const formatVal = (v: number) => (showScore ? v.toFixed(1) : `${v}%`);
  const barPct = (v: number) => (showScore ? (v / scaleMax) * 100 : v);

  return (
    <div>
      {showAgeBreakdown && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-sk-gray-25 px-4 py-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-sk-orange">
            <span className="h-2.5 w-5 rounded-sm gradient-sk" />
            전체 평균
          </span>
          <span className="text-sk-gray-300">|</span>
          {series.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-xs text-sk-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-5">
        {items.map((item, pi) => {
          const ageVals = series.map((s) => s.values[pi] ?? 0);
          const female = genderSeries?.find((g) => g.label === '여성')?.values[pi] ?? 52;
          const male = genderSeries?.find((g) => g.label === '남성')?.values[pi] ?? 100 - female;

          return (
          <div key={item.label} className="border-b border-sk-gray-100 pb-5 last:border-0 last:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-sk-gray-800">{item.label}</span>
              <ChartTooltip
                label={item.label}
                value={item.overall}
                total={total}
                unit={showScore ? '점' : '%'}
              >
                <span className="cursor-default text-sm font-bold text-sk-orange">
                  {formatVal(item.overall)}
                </span>
              </ChartTooltip>
            </div>

            <div className={`w-full overflow-hidden rounded-md bg-sk-gray-100 ${showAgeBreakdown ? 'h-5' : 'h-4'}`}>
              <motion.div
                className="h-full rounded-md gradient-sk"
                initial={{ width: 0 }}
                whileInView={{ width: `${barPct(item.overall)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: pi * 0.04 }}
              />
            </div>

            {genderSeries && <GenderStrip female={female} male={male} />}

            {showAgeBreakdown && (
              <AgeBreakdownRow series={series} ageVals={ageVals} total={total} />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

/** @deprecated alias — use AvgWithAgeChart */
export const VisitPurposeChart = AvgWithAgeChart;

/* ── 프로파일용 막대 (하단: 성별 · 연령) ── */
export function ProfileStackedChart({
  items,
  series,
  genderSeries,
  showAgeBreakdown = true,
  showGender,
  genderInBar = false,
  /** @deprecated use showAgeBreakdown */
  showAgeStack,
  total = TOTAL_RESPONDENTS,
}: {
  items: { label: string; overall: number }[];
  series: { label: string; color: string; values: number[] }[];
  genderSeries?: { label: string; color: string; values: number[] }[];
  showAgeBreakdown?: boolean;
  showGender?: boolean;
  genderInBar?: boolean;
  showAgeStack?: boolean;
  total?: number;
}) {
  const showAge = showAgeStack !== undefined ? showAgeStack : showAgeBreakdown;
  const showGenderRow =
    !genderInBar && (showGender ?? (!!genderSeries && !isGenderCategory(items)));

  return (
    <div>
      {showAge && (
        <div className="mb-4 flex flex-wrap gap-3 rounded-xl bg-sk-gray-25 px-4 py-3">
          {series.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-xs text-sk-gray-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-5">
        {items.map((item, pi) => {
          const ageVals = series.map((s) => s.values[pi] ?? 0);
          const female = genderSeries?.find((g) => g.label === '여성')?.values[pi] ?? 50;
          const male = genderSeries?.find((g) => g.label === '남성')?.values[pi] ?? 100 - female;

          return (
            <div key={item.label}>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold text-sk-gray-800">{item.label}</span>
                <div className="flex items-center gap-2">
                  {genderInBar && genderSeries && (
                    <span className="text-[10px] font-medium text-sk-gray-500">
                      <span className="text-sk-orange">♀{female}%</span>
                      <span className="mx-1 text-sk-gray-300">·</span>
                      <span>♂{male}%</span>
                    </span>
                  )}
                  <span className="font-bold text-sk-orange">{item.overall}%</span>
                </div>
              </div>

              <div className="relative h-7 w-full overflow-hidden rounded-md bg-sk-gray-100">
                <motion.div
                  className={`absolute inset-y-0 left-0 h-full overflow-hidden rounded-md ${genderInBar ? 'flex' : ''}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.overall}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: pi * 0.04 }}
                >
                  {genderInBar && genderSeries ? (
                    <>
                      <div className="h-full bg-sk-orange" style={{ width: `${female}%` }} />
                      <div className="h-full bg-sk-gray-400" style={{ width: `${male}%` }} />
                    </>
                  ) : (
                    <div className="h-full w-full gradient-sk" />
                  )}
                </motion.div>
              </div>

              {showGenderRow && <GenderStrip female={female} male={male} />}

              {showAge && (
                <AgeBreakdownRow series={series} ageVals={ageVals} total={total} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── NPS Chart ── */
export function NpsChart({
  promote,
  passive,
  detractor,
  score,
  total = TOTAL_RESPONDENTS,
  compact = false,
}: {
  promote: number;
  passive: number;
  detractor: number;
  score: number;
  total?: number;
  compact?: boolean;
}) {
  const segments = [
    { label: '추천', value: promote, color: '#f47725' },
    { label: '보통', value: passive, color: '#adb5bd' },
    { label: '비추천', value: detractor, color: '#868e96' },
  ];

  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 border-sk-orange/25 bg-sk-orange-light/30">
            <span className="text-[9px] font-medium text-sk-gray-500">NPS</span>
            <span className="text-xl font-bold text-sk-orange">+{score}</span>
          </div>
          <div className="flex-1">
            <div className="flex h-3 overflow-hidden rounded-full">
              {segments.map((s) => (
                <div key={s.label} className="h-full" style={{ width: `${s.value}%`, background: s.color }} />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-center">
              {segments.map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-sk-gray-500">{s.label}</p>
                  <p className="text-sm font-bold" style={{ color: s.color }}>
                    {s.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-sk-orange/20 bg-sk-orange-light/30">
          <span className="text-xs font-medium text-sk-gray-500">NPS</span>
          <span className="text-3xl font-bold text-sk-orange">+{score}</span>
        </div>
      </div>

      <div className="space-y-2">
        {segments.map((s) => (
          <ChartTooltip key={s.label} label={s.label} value={s.value} total={total}>
            <div className="rounded-lg border border-sk-gray-100 bg-sk-gray-25 px-3 py-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-sk-gray-800">{s.label}</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: s.color }}>
                  {s.value}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sk-gray-200">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-1 text-right text-[10px] text-sk-gray-400">{toCount(s.value, total)}명</p>
            </div>
          </ChartTooltip>
        ))}
      </div>
    </div>
  );
}

/* ── Word Cloud ── */
export function WordCloud({
  words,
  variant,
  compact = false,
}: {
  words: { word: string; weight: number }[];
  variant: 'positive' | 'negative';
  compact?: boolean;
}) {
  const sizeMap = compact ? [10, 11, 12, 14, 16] : [12, 14, 16, 20, 26];
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1.5 rounded-xl bg-sk-gray-25 ${
        compact ? 'min-h-[72px] p-3' : 'min-h-[120px] p-5'
      }`}
    >
      {words.map((w) => (
        <span
          key={w.word}
          className={`font-semibold leading-none ${
            variant === 'positive' ? 'text-sk-orange' : 'text-sk-gray-500'
          }`}
          style={{ fontSize: sizeMap[w.weight - 1] ?? 14, opacity: 0.5 + w.weight * 0.1 }}
        >
          {w.word}
        </span>
      ))}
    </div>
  );
}

/* ── Report Section wrapper ── */
export function ReportSection({
  number,
  title,
  subtitle,
  summary,
  detailPath,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  summary?: string | readonly string[];
  detailPath?: string;
  children: ReactNode;
}) {
  const summaryLines = summary ? (Array.isArray(summary) ? summary : [summary]) : [];

  return (
    <section className="rounded-2xl border border-sk-gray-200/80 bg-white shadow-card">
      <div className="border-b border-sk-gray-100 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sk-gray-800 text-xs font-bold text-white">
              {number}
            </span>
            <div>
              <h3 className="text-base font-bold text-sk-gray-800">{title}</h3>
              {subtitle && <p className="text-xs text-sk-gray-500">{subtitle}</p>}
            </div>
          </div>
          {detailPath && <DetailLink to={detailPath} />}
        </div>
        {summaryLines.length > 0 && (
          <div className="mt-3 rounded-lg border border-sk-orange/15 bg-sk-orange-light/25 px-4 py-2.5">
            {summaryLines.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-sk-gray-700">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

/* ── Detail Link ── */
export function DetailLink({ to, label = '상세 분석 보기' }: { to: string; label?: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        saveSurveyScroll();
        navigate(to);
      }}
      className="flex shrink-0 items-center gap-1 rounded-lg border border-sk-gray-200 px-3 py-1.5 text-xs font-medium text-sk-gray-600 transition-all hover:border-sk-orange/30 hover:text-sk-orange"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </button>
  );
}

/* ── Back Button ── */
export function BackToSurvey() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) navigate(-1);
        else navigate('/survey');
      }}
      className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-sk-gray-200 bg-white px-4 py-2 text-sm font-medium text-sk-gray-700 shadow-sm transition-all hover:border-sk-orange/30 hover:text-sk-orange"
    >
      <ArrowLeft className="h-4 w-4" />
      만족도 조사 결과로 돌아가기
    </button>
  );
}

/* ── Insight Box ── */
export function InsightBox({ items, title = '요약' }: { items: string[]; title?: string }) {
  return (
    <div className="rounded-xl border border-sk-orange/15 bg-sk-orange-light/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-sk-orange">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-sk-gray-700">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Cross Analysis Group ── */
export function CrossAnalysisGroup({
  groups,
  total = TOTAL_RESPONDENTS,
  showScore,
}: {
  groups: { group: string; items: { label: string; value: number; score?: number }[] }[];
  total?: number;
  showScore?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <div key={g.group} className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-sk-orange">{g.group}</p>
          <div className="space-y-2">
            {g.items.map((item) => {
              const display = showScore ? (item.score ?? item.value) : item.value;
              return (
                <ChartTooltip
                  key={item.label}
                  label={`${g.group} · ${item.label}`}
                  value={display}
                  total={total}
                  unit={showScore ? '점' : '%'}
                >
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-sk-gray-600">{item.label}</span>
                      <span className="font-semibold text-sk-gray-800">
                        {showScore ? display.toFixed(1) : `${display}%`}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sk-gray-200">
                      <div
                        className="h-full rounded-full bg-sk-orange/70"
                        style={{ width: `${showScore ? (display / 5) * 100 : display}%` }}
                      />
                    </div>
                  </div>
                </ChartTooltip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Score Table ── */
export function ScoreTable({ data }: { data: { label: string; score: number }[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-sk-gray-200 bg-sk-gray-25">
          <th className="px-4 py-2.5 text-left font-semibold text-sk-gray-600">프로그램</th>
          <th className="px-4 py-2.5 text-right font-semibold text-sk-gray-600">만족도</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-sk-gray-25/50'}>
            <td className="px-4 py-2.5 text-sk-gray-700">{row.label}</td>
            <td className="px-4 py-2.5 text-right font-bold text-sk-orange">{row.score.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Tag List ── */
export function TagList({ items, variant }: { items: string[]; variant: 'positive' | 'negative' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            variant === 'positive' ? 'bg-sk-orange-light text-sk-orange' : 'bg-sk-gray-100 text-sk-gray-600'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* ── Sub Card ── */
export function SubCard({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-sk-gray-100 bg-white p-5 ${className}`}>
      <p className="font-semibold text-sk-gray-800">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-sk-gray-500">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
