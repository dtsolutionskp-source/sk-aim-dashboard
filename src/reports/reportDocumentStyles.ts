/** 인쇄·PDF·문서보내기용 공통 스타일 */
export const REPORT_DOCUMENT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

  @page {
    size: A4;
    margin: 18mm 20mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    font-size: 11pt;
    line-height: 1.65;
    color: #191f28;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .doc {
    max-width: 170mm;
    margin: 0 auto;
  }

  .doc-header {
    border-bottom: 2px solid #191f28;
    padding-bottom: 16px;
    margin-bottom: 24px;
    text-align: center;
  }

  .doc-header .org {
    font-size: 9pt;
    letter-spacing: 0.12em;
    color: #6b7684;
  }

  .doc-header h1 {
    margin-top: 10px;
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .doc-header .subtitle {
    margin-top: 4px;
    font-size: 13pt;
    font-weight: 500;
    color: #4e5968;
  }

  .doc-header .meta {
    margin-top: 10px;
    font-size: 9.5pt;
    color: #9aa3ad;
  }

  .section {
    margin-top: 22px;
    page-break-inside: avoid;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5pt;
    font-weight: 700;
    color: #191f28;
    margin-bottom: 10px;
  }

  .section-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    background: #191f28;
    color: #fff;
    font-size: 9pt;
    font-weight: 700;
    flex-shrink: 0;
  }

  .section p,
  .section li {
    font-size: 10.5pt;
    color: #4e5968;
  }

  .section ul {
    margin: 8px 0 0 18px;
  }

  .section li + li {
    margin-top: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 10pt;
  }

  th,
  td {
    border: 1px solid #e2e5ea;
    padding: 8px 10px;
    text-align: left;
  }

  th {
    background: #f7f8fa;
    font-weight: 600;
    color: #4e5968;
  }

  td.value {
    text-align: right;
    font-weight: 700;
    color: #f47725;
  }

  .insight-box {
    margin-top: 10px;
    padding: 12px 14px;
    border: 1px solid #ffd8bf;
    border-radius: 8px;
    background: #fff6f0;
  }

  .insight-box .label {
    font-size: 9pt;
    font-weight: 600;
    color: #f47725;
    margin-bottom: 6px;
  }

  .summary-box {
    margin-top: 10px;
    padding: 14px 16px;
    border: 1px solid #e2e5ea;
    border-radius: 8px;
    background: #f7f8fa;
  }

  .summary-box .summary-label {
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #6b7684;
    margin-bottom: 8px;
  }

  .overview-text {
    margin-top: 8px;
    font-size: 10.5pt;
    line-height: 1.75;
    color: #4e5968;
  }

  .data-source {
    margin-top: 12px;
    padding: 10px 12px;
    border-left: 3px solid #f47725;
    background: #fcfcfd;
    font-size: 9pt;
    color: #6b7684;
    line-height: 1.6;
  }

  .subsection-title {
    margin-top: 14px;
    margin-bottom: 6px;
    font-size: 10.5pt;
    font-weight: 700;
    color: #333d4b;
  }

  .material-block {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px dashed #e2e5ea;
  }

  .material-block:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  .material-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
  }

  .material-head h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #191f28;
  }

  .material-head span {
    font-size: 9pt;
    color: #9aa3ad;
    white-space: nowrap;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 12px;
  }

  .image-card {
    border: 1px solid #e2e5ea;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
  }

  .image-card img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 120px;
    object-fit: cover;
    object-position: top;
  }

  .image-caption {
    padding: 6px 8px;
    font-size: 8.5pt;
    color: #6b7684;
    text-align: center;
    background: #f7f8fa;
  }

  .doc-footer {
    margin-top: 32px;
    padding-top: 14px;
    border-top: 1px solid #e2e5ea;
    text-align: center;
    font-size: 8.5pt;
    color: #9aa3ad;
  }

  @media print {
    body {
      background: #fff;
    }
  }
`;

export function wrapReportHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>${REPORT_DOCUMENT_STYLES}</style>
</head>
<body>
  <div class="doc">
    ${body}
  </div>
</body>
</html>`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
