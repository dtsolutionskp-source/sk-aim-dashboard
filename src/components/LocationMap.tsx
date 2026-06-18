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
        <div className="flex items-center justify-between rounded-lg bg-sk-gray-25 px-4 py-3 text-sm">
          <span className="text-sk-gray-500">적용 범위</span>
          <span className="text-right font-semibold text-sk-gray-800">{surveyLocationSetting.scope}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-sk-gray-25 px-4 py-3 text-sm">
          <span className="text-sk-gray-500">대상</span>
          <span className="font-semibold text-sk-gray-800">{surveyLocationSetting.target}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-sk-gray-25 px-4 py-3 text-sm">
          <span className="text-sk-gray-500">예상 도달</span>
          <span className="font-semibold text-sk-orange">
            {surveyLocationSetting.estimatedReach.toLocaleString()}명
          </span>
        </div>
      </div>
    </div>
  );
}
