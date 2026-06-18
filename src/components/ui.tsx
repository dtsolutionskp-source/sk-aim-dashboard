import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedNumber } from './motion';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  highlight?: boolean;
  index?: number;
  decimals?: number;
}

export default function KpiCard({
  label,
  value,
  unit,
  change,
  changeLabel,
  highlight,
  index = 0,
  decimals,
}: KpiCardProps) {
  const isNumeric = typeof value === 'number';
  const formattedValue = isNumeric ? value : value;
  const animDecimals = decimals ?? (isNumeric && !Number.isInteger(value as number) ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:p-6 ${
        highlight
          ? 'border-sk-orange/25 ring-1 ring-sk-orange/10'
          : 'border-sk-gray-200/80'
      }`}
    >
      {highlight && (
        <div className="absolute inset-x-0 top-0 h-0.5 gradient-sk" />
      )}
      <p className="text-xs font-medium tracking-wide text-sk-gray-500 sm:text-sm">{label}</p>
      <div className="mt-3 flex items-end gap-1.5">
        <span
          className={`text-3xl font-bold leading-none tracking-tight sm:text-4xl ${
            highlight ? 'text-sk-orange' : 'text-sk-gray-800'
          }`}
        >
          {isNumeric ? <AnimatedNumber value={value as number} decimals={animDecimals} /> : formattedValue}
        </span>
        {unit && (
          <span className="mb-1 text-sm font-medium text-sk-gray-400">{unit}</span>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              change > 0
                ? 'bg-emerald-50 text-emerald-700'
                : change < 0
                  ? 'bg-red-50 text-red-600'
                  : 'bg-sk-gray-100 text-sk-gray-500'
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : change < 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && <span className="text-xs text-sk-gray-400">{changeLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  variant?: 'default' | 'elevated' | 'accent';
  noPadding?: boolean;
}

export function Card({
  title,
  subtitle,
  children,
  className = '',
  action,
  variant = 'default',
  noPadding = false,
}: CardProps) {
  const variantStyles = {
    default: 'border-sk-gray-200/80 bg-white shadow-card',
    elevated: 'border-sk-gray-200/60 bg-white shadow-elevated',
    accent: 'border-sk-orange/20 bg-white shadow-card ring-1 ring-sk-orange/5',
  };

  const overflowClass = className.includes('overflow-visible') ? 'overflow-visible' : 'overflow-hidden';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-2xl border ${variantStyles[variant]} ${overflowClass} ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-col gap-3 border-b border-sk-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div>
            {title && <h3 className="text-base font-semibold text-sk-gray-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-sk-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5 sm:p-6'}>{children}</div>
    </motion.div>
  );
}

interface ProgressItemProps {
  label: string;
  value: number;
  count?: number;
  index?: number;
  muted?: boolean;
}

export function ProgressItem({ label, value, count, index = 0, muted }: ProgressItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-sk-gray-700">{label}</span>
        <span className="tabular-nums text-sk-gray-600">
          {value}%
          {count !== undefined && (
            <span className="ml-1.5 font-normal text-sk-gray-400">({count.toLocaleString()})</span>
          )}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-sk-gray-100">
        <motion.div
          className={`h-full rounded-full ${muted ? 'bg-sk-gray-400' : 'gradient-sk'}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  active?: boolean;
  tooltip?: string;
}

export function Tag({ children, active, tooltip }: TagProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const tooltipWidth = 288;
    const padding = 16;
    let left = rect.left + rect.width / 2;
    left = Math.max(tooltipWidth / 2 + padding, Math.min(left, window.innerWidth - tooltipWidth / 2 - padding));
    setPos({ top: rect.top - 10, left });
  }, []);

  const tagClass = `inline-flex cursor-default items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border border-sk-orange/20 bg-sk-orange-light text-sk-orange'
      : 'border border-sk-gray-200 bg-white text-sk-gray-600'
  }`;

  if (tooltip) {
    return (
      <>
        <motion.span
          ref={ref}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => {
            updatePosition();
            setShow(true);
          }}
          onMouseLeave={() => setShow(false)}
          className={tagClass}
        >
          {children}
        </motion.span>
        {createPortal(
          show ? (
            <div
              role="tooltip"
              style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -100%)',
                zIndex: 99999,
              }}
              className="pointer-events-none w-72 rounded-xl border border-sk-gray-200 bg-white p-3.5 text-xs leading-relaxed text-sk-gray-600 shadow-elevated"
            >
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-sk-gray-200 bg-white" />
              {tooltip}
            </div>
          ) : null,
          document.body,
        )}
      </>
    );
  }

  return (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={tagClass}
    >
      {children}
    </motion.span>
  );
}

interface RankListProps {
  items: { rank?: number; label: string; value: number; pct?: number; slug?: string }[];
  onItemClick?: (item: { rank?: number; label: string; value: number; pct?: number; slug?: string }) => void;
}

export function RankList({ items, onItemClick }: RankListProps) {
  return (
    <div className="space-y-1">
      {items.map((item, idx) => {
        const rank = item.rank ?? idx + 1;
        const isTop = rank <= 3;
        const clickable = Boolean(onItemClick);
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04, duration: 0.35 }}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onItemClick!(item) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onItemClick!(item);
                    }
                  }
                : undefined
            }
            className={`flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors ${
              clickable ? 'cursor-pointer hover:bg-sk-orange-light/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-orange' : 'hover:bg-sk-gray-50'
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isTop ? 'gradient-sk text-white shadow-sm' : 'bg-sk-gray-100 text-sk-gray-500'
              }`}
            >
              {rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-sk-gray-700">{item.label}</span>
                <span className="shrink-0 tabular-nums text-sk-gray-600">
                  {item.value.toLocaleString()}
                  {item.pct !== undefined && (
                    <span className="ml-1 text-sk-gray-400">({item.pct}%)</span>
                  )}
                </span>
              </div>
              {item.pct !== undefined && (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sk-gray-100">
                  <motion.div
                    className="h-full rounded-full bg-sk-orange/60"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(item.pct * 4, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.04 }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

export function StatBox({ label, value, sub, highlight }: StatBoxProps) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition-colors sm:p-5 ${
        highlight
          ? 'border-sk-orange/20 bg-sk-orange-light/50'
          : 'border-sk-gray-100 bg-sk-gray-25'
      }`}
    >
      <p className={`text-2xl font-bold sm:text-3xl ${highlight ? 'text-sk-orange' : 'text-sk-gray-800'}`}>
        {value}
      </p>
      <p className="mt-1.5 text-sm font-medium text-sk-gray-700">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-sk-gray-400">{sub}</p>}
    </div>
  );
}

interface SectionLabelProps {
  children: ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
      {children}
    </p>
  );
}
