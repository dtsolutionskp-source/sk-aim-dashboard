import { surveyLocationSetting } from '../data/mockData';

export default function LocationMap() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-sk-gray-200 shadow-sm">
        <img
          src={surveyLocationSetting.mapImage}
          alt="해오름시 중앙공원 일대 위치 설정 지도"
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="space-y-2">
        {[
          { label: '적용 범위', value: surveyLocationSetting.scope },
          { label: '대상', value: surveyLocationSetting.target },
          {
            label: '예상 도달',
            value: `${surveyLocationSetting.estimatedReach.toLocaleString()}명`,
            highlight: true,
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 rounded-lg bg-sk-gray-25 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
          >
            <span className="shrink-0 text-sk-gray-500">{row.label}</span>
            <span
              className={`font-semibold sm:text-right ${
                row.highlight ? 'text-sk-orange' : 'text-sk-gray-800'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
