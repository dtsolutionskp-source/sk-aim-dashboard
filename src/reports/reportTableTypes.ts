/** 공공기관 보고서용 표 스펙 */
export interface ReportTableRow {
  cells: string[];
  /** 강조 열 index (오렌지) */
  highlightCol?: number;
}

export interface ReportTableSpec {
  id: string;
  title?: string;
  headers: string[];
  rows: ReportTableRow[];
}
