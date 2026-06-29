import { createContext } from 'react';
import type { LayoutValidationIssue } from './layout/layoutFix';

export interface ExportSource {
  document: Document;
  window: Window;
  iframe: HTMLIFrameElement;
}

export interface ReportRenderContextValue {
  html: string;
  isReady: boolean;
  slideCount: number;
  validationIssues: LayoutValidationIssue[];
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  onDeckLoaded: (iframe: HTMLIFrameElement) => Promise<void>;
  prepareExportSource: () => Promise<ExportSource>;
}

export const ReportRenderContext = createContext<ReportRenderContextValue | null>(null);
