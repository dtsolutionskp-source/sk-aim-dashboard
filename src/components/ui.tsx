import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  highlight?: boolean;
}

export default function KpiCard({ label, value, unit, change, changeLabel, highlight }: KpiCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
        highlight ? 'border-sk-orange/30 ring-1 ring-sk-orange/10' : 'border-sk-gray-200'
      }`}
    >
      <p className="text-sm font-medium text-sk-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${highlight ? 'text-sk-orange' : 'text-sk-gray-800'}`}>
          {formattedValue}
        </span>
        {unit && <span className="text-sm text-sk-gray-500">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {change > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          ) : change < 0 ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-sk-gray-400" />
          )}
          <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-sk-gray-500'}>
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && <span className="text-sk-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', action }: CardProps) {
  return (
    <div className={`rounded-xl border border-sk-gray-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-sk-gray-100 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-sk-gray-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-sk-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

interface ProgressItemProps {
  label: string;
  value: number;
  count?: number;
  color?: string;
}

export function ProgressItem({ label, value, count, color = 'bg-sk-orange' }: ProgressItemProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-sk-gray-700">{label}</span>
        <span className="font-medium text-sk-gray-800">
          {value}%
          {count !== undefined && (
            <span className="ml-1 font-normal text-sk-gray-400">({count.toLocaleString()})</span>
          )}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-sk-gray-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  active?: boolean;
}

export function Tag({ children, active }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        active
          ? 'bg-sk-orange-light text-sk-orange border border-sk-orange/20'
          : 'bg-sk-gray-100 text-sk-gray-600'
      }`}
    >
      {children}
    </span>
  );
}

interface RankListProps {
  items: { rank?: number; label: string; value: number; pct?: number }[];
}

export function RankList({ items }: RankListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.label} className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              (item.rank ?? idx + 1) <= 3
                ? 'bg-sk-orange text-white'
                : 'bg-sk-gray-100 text-sk-gray-600'
            }`}
          >
            {item.rank ?? idx + 1}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-sk-gray-700">{item.label}</span>
              <span className="text-sk-gray-600">
                {item.value.toLocaleString()}
                {item.pct !== undefined && (
                  <span className="ml-1 text-sk-gray-400">({item.pct}%)</span>
                )}
              </span>
            </div>
            {item.pct !== undefined && (
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sk-gray-100">
                <div
                  className="h-full rounded-full bg-sk-orange/70"
                  style={{ width: `${Math.min(item.pct * 4, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
