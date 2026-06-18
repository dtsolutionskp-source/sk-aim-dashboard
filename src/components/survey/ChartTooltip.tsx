import { useState, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TOTAL_RESPONDENTS, toCount } from '../../data/surveyReportData';

interface ChartTooltipProps {
  label: string;
  value: number;
  total?: number;
  unit?: '%' | '점';
  className?: string;
  children: ReactNode;
}

export function ChartTooltip({
  label,
  value,
  total = TOTAL_RESPONDENTS,
  unit = '%',
  className = '',
  children,
}: ChartTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ x: rect.left + rect.width / 2, y: rect.top });
    setVisible(true);
  };

  const count = unit === '%' ? toCount(value, total) : null;

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        className={`cursor-default ${className}`}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-full rounded-lg border border-sk-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: pos.x, top: pos.y - 8 }}
          >
            <p className="font-semibold text-sk-gray-800">{label}</p>
            <p className="mt-0.5 text-sk-gray-600">
              {unit === '%' ? (
                <>
                  <span className="font-bold text-sk-orange">{value}%</span>
                  <span className="mx-1 text-sk-gray-300">·</span>
                  <span>{count}명</span>
                </>
              ) : (
                <span className="font-bold text-sk-orange">{value.toFixed(1)}점</span>
              )}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
