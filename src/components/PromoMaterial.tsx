import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Image, MousePointerClick, Eye, Calendar } from 'lucide-react';
import type { PromoMaterial, PromoMaterialId } from '../data/mockData';

interface PromoMaterialSelectorProps {
  materials: PromoMaterial[];
  selectedId: PromoMaterialId;
  onSelect: (id: PromoMaterialId) => void;
}

export function PromoMaterialSelector({ materials, selectedId, onSelect }: PromoMaterialSelectorProps) {
  return (
    <div className="-mx-1 mobile-scroll-x overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:pb-0">
      <div className="flex min-w-min gap-2.5 sm:grid sm:min-w-0 sm:grid-cols-3 sm:gap-3">
        {materials.map((material, i) => {
          const isSelected = material.id === selectedId;
          const clickRate = material.stats.impressions
            ? ((material.stats.clicks / material.stats.impressions) * 100).toFixed(1)
            : material.stats.sent > 0
              ? ((material.stats.clicks / material.stats.sent) * 100).toFixed(1)
              : null;

          return (
            <motion.button
              key={material.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(material.id)}
              className={`w-[min(240px,72vw)] shrink-0 rounded-xl border p-4 text-left transition-all sm:w-auto ${
                isSelected
                  ? 'border-sk-orange/40 bg-sk-orange-light shadow-sm ring-1 ring-sk-orange/20'
                  : 'border-sk-gray-200/80 bg-white hover:border-sk-gray-300 hover:shadow-sm'
              }`}
            >
            <p className={`font-semibold ${isSelected ? 'text-sk-orange' : 'text-sk-gray-800'}`}>
              {material.title}
            </p>
            <p className="mt-1 text-xs text-sk-gray-500">{material.description}</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-sk-gray-400">
              <Calendar className="h-3 w-3" />
              {material.schedule.label} {material.schedule.period}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-sk-gray-500">
              {material.stats.sent > 0 && <span>발송 {material.stats.sent.toLocaleString()}</span>}
              {material.stats.clicks > 0 && <span>클릭 {material.stats.clicks.toLocaleString()}</span>}
              {material.stats.impressions && (
                <span>노출 {material.stats.impressions.toLocaleString()}</span>
              )}
              {clickRate && (
                <span className="font-semibold text-sk-orange">클릭율 {clickRate}%</span>
              )}
            </div>
          </motion.button>
        );
      })}
      </div>
    </div>
  );
}

function ImagePreviewCard({
  preview,
  index,
}: {
  preview: PromoMaterial['previews'][number];
  index: number;
}) {
  const isNotification = preview.type === 'notification';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-sk-gray-25 shadow-card"
    >
      <div className="flex items-center gap-2 border-b border-sk-gray-200/60 bg-white px-4 py-3">
        {isNotification ? (
          <Bell className="h-4 w-4 text-sk-orange" />
        ) : (
          <Image className="h-4 w-4 text-sk-orange" />
        )}
        <span className="text-sm font-semibold text-sk-gray-700">{preview.label}</span>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-6">
        <div
          className={`overflow-hidden rounded-xl shadow-elevated ${
            isNotification || preview.type === 'app'
              ? 'max-w-[280px]'
              : preview.type === 'flyer'
                ? 'max-w-[320px]'
                : 'w-full max-w-lg'
          }`}
        >
          <img
            src={preview.image}
            alt={preview.label}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

interface PromoPreviewProps {
  material: PromoMaterial;
}

export function PromoPreview({ material }: PromoPreviewProps) {
  const clickRate = material.stats.impressions
    ? ((material.stats.clicks / material.stats.impressions) * 100).toFixed(1)
    : material.stats.sent > 0
      ? ((material.stats.clicks / material.stats.sent) * 100).toFixed(1)
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={material.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-sk-gray-800">{material.title}</h4>
            <p className="text-sm text-sk-gray-500">{material.description}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-sk-orange">
              <Calendar className="h-3.5 w-3.5" />
              {material.schedule.label} · {material.schedule.period}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-sk-gray-500">
            {material.stats.sent > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-sk-gray-25 px-3 py-1.5">
                <Bell className="h-3.5 w-3.5" />
                발송 <strong className="text-sk-gray-700">{material.stats.sent.toLocaleString()}</strong>
              </span>
            )}
            {material.stats.clicks > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-sk-gray-25 px-3 py-1.5">
                <MousePointerClick className="h-3.5 w-3.5" />
                클릭 <strong className="text-sk-gray-700">{material.stats.clicks.toLocaleString()}</strong>
              </span>
            )}
            {material.stats.impressions && (
              <span className="flex items-center gap-1.5 rounded-full bg-sk-gray-25 px-3 py-1.5">
                <Eye className="h-3.5 w-3.5" />
                노출 <strong className="text-sk-gray-700">{material.stats.impressions.toLocaleString()}</strong>
              </span>
            )}
            {clickRate && (
              <span className="flex items-center gap-1.5 rounded-full bg-sk-orange-light px-3 py-1.5 font-semibold text-sk-orange">
                클릭율 {clickRate}%
              </span>
            )}
          </div>
        </div>

        <div
          className={`grid gap-5 ${
            material.previews.length > 1 ? 'grid-cols-1 md:grid-cols-2' : ''
          }`}
        >
          {material.previews.map((preview, idx) => (
            <ImagePreviewCard key={preview.label} preview={preview} index={idx} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
