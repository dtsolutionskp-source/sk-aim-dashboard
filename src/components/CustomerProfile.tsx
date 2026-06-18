import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';
import type { CustomerProfile } from '../types/customerProfile';

interface GenderBarProps {
  gender: CustomerProfile['gender'];
  compact?: boolean;
}

function GenderBar({ gender, compact }: GenderBarProps) {
  const female = gender.find((g) => g.label === '여성')?.value ?? 0;
  const male = gender.find((g) => g.label === '남성')?.value ?? 0;

  return (
    <div>
      <div className={`flex overflow-hidden rounded-full bg-sk-gray-100 ${compact ? 'h-3' : 'h-4'}`}>
        <motion.div
          className="h-full bg-sk-orange"
          initial={{ width: 0 }}
          whileInView={{ width: `${female}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="h-full bg-sk-gray-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${male}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs">
        <span className="font-medium text-sk-orange">
          여성 {female}%
          {gender.find((g) => g.label === '여성')?.count !== undefined && (
            <span className="ml-1 font-normal text-sk-gray-400">
              ({gender.find((g) => g.label === '여성')!.count!.toLocaleString()})
            </span>
          )}
        </span>
        <span className="font-medium text-sk-gray-500">
          남성 {male}%
          {gender.find((g) => g.label === '남성')?.count !== undefined && (
            <span className="ml-1 font-normal text-sk-gray-400">
              ({gender.find((g) => g.label === '남성')!.count!.toLocaleString()})
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

interface AgeChartProps {
  age: CustomerProfile['age'];
  maxValue?: number;
  showValues?: boolean;
  highlightPeak?: boolean;
}

function AgeChart({ age, maxValue, showValues = true, highlightPeak = true }: AgeChartProps) {
  const max = maxValue ?? Math.max(...age.map((a) => a.value));
  const peakValue = Math.max(...age.map((a) => a.value));

  return (
    <div className="space-y-1.5">
      {age.map((item, idx) => {
        const isPeak = highlightPeak && item.value === peakValue && item.value > 0;
        return (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-[4.5rem] shrink-0 text-right text-[10px] leading-tight sm:w-20 sm:text-[11px] ${
              isPeak ? 'font-bold text-sk-orange' : 'text-sk-gray-500'
            }`}>
              {item.label}
            </span>
            <div className="relative h-4 flex-1 overflow-hidden rounded bg-sk-gray-100">
              <motion.div
                className={`h-full rounded ${isPeak ? 'gradient-sk' : 'bg-sk-orange/50'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
              />
            </div>
            {showValues && (
              <span className={`w-8 shrink-0 text-right text-[10px] tabular-nums sm:text-xs ${
                isPeak ? 'font-bold text-sk-orange' : 'text-sk-gray-500'
              }`}>
                {item.value}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CustomerProfileViewProps {
  profile: CustomerProfile;
  variant?: 'full' | 'compact';
}

export function CustomerProfileView({ profile, variant = 'full' }: CustomerProfileViewProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'space-y-4' : 'space-y-5'}>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
          성별 분포
        </p>
        <GenderBar gender={profile.gender} compact={isCompact} />
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
          연령 분포
          <span className="ml-1.5 font-normal normal-case tracking-normal text-sk-gray-300">
            · SK 연령 체계
          </span>
        </p>
        <AgeChart age={profile.age} />
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
          주요 특징
        </p>
        <ul className="space-y-1.5">
          {profile.traits.map((trait, idx) => (
            <motion.li
              key={trait}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-2 text-xs leading-relaxed text-sk-gray-600"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sk-orange" />
              {trait}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ProfileComparisonProps {
  expected: CustomerProfile;
  actual: CustomerProfile;
}

export function ProfileComparison({ expected, actual }: ProfileComparisonProps) {
  const maxAge = Math.max(
    ...expected.age.map((a) => a.value),
    ...actual.age.map((a) => a.value),
  );

  return (
    <div className="space-y-6">
      {/* Gender comparison */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
          성별 분포 비교
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-sk-orange/15 bg-sk-orange-light/30 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sk-orange" />
              <span className="text-xs font-semibold text-sk-orange">추정</span>
            </div>
            <GenderBar gender={expected.gender} compact />
          </div>
          <div className="rounded-xl border border-sk-gray-200 bg-sk-gray-25 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sk-gray-500" />
              <span className="text-xs font-semibold text-sk-gray-700">실제</span>
            </div>
            <GenderBar gender={actual.gender} compact />
          </div>
        </div>
        <p className="mt-2 text-[11px] text-sk-gray-400">
          여성 비중: 추정 72% → 실제 58% (타겟 대비 -14%p, 가족·남성 동반 방문 증가)
        </p>
      </div>

      {/* Age comparison - overlaid bars */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
          연령 분포 비교
          <span className="ml-1.5 font-normal normal-case tracking-normal text-sk-gray-300">
            · SK 연령 체계
          </span>
        </p>
        <div className="mb-3 flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-sk-orange/70" />
            추정
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-sk-gray-400" />
            실제
          </span>
        </div>
        <div className="space-y-2">
          {expected.age.map((expItem, idx) => {
            const actItem = actual.age[idx];
            return (
              <div key={expItem.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-2 sm:grid-cols-[5rem_1fr]">
                <span className="text-right text-[10px] text-sk-gray-500 sm:text-[11px]">
                  {expItem.label}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-gray-100">
                      <motion.div
                        className="h-full rounded-full bg-sk-orange/70"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(expItem.value / maxAge) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.03, duration: 0.5 }}
                      />
                    </div>
                    <span className="w-7 text-right text-[10px] tabular-nums text-sk-orange">
                      {expItem.value}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-gray-100">
                      <motion.div
                        className="h-full rounded-full bg-sk-gray-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(actItem.value / maxAge) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.03 + 0.05, duration: 0.5 }}
                      />
                    </div>
                    <span className="w-7 text-right text-[10px] tabular-nums text-sk-gray-500">
                      {actItem.value}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trait comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-sk-orange/15 bg-sk-orange-light/20 p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sk-orange" />
            <span className="text-xs font-semibold text-sk-orange">추정 특징</span>
          </div>
          <ul className="space-y-1.5">
            {expected.traits.map((t) => (
              <li key={t} className="text-xs leading-relaxed text-sk-gray-600">· {t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-sk-gray-200 bg-sk-gray-25 p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sk-gray-500" />
            <span className="text-xs font-semibold text-sk-gray-700">실제 특징</span>
          </div>
          <ul className="space-y-1.5">
            {actual.traits.map((t) => (
              <li key={t} className="text-xs leading-relaxed text-sk-gray-600">· {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
