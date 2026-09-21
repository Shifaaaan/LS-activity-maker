import React, { useState } from 'react';
import { Download, Printer, Copy, Check, ZoomIn, ZoomOut, Edit3, Eye, RotateCw } from 'lucide-react';
import { ReportData } from '../types.ts';

interface PreviewToolbarProps {
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadStatus?: string;
  isEditable: boolean;
  onToggleEditable: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  reportData: ReportData;
  onToggleOrientation: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  onDownloadPdf,
  isDownloading,
  downloadStatus,
  isEditable,
  onToggleEditable,
  zoom,
  onZoomChange,
  reportData,
  onToggleOrientation,
}) => {
  const [copied, setCopied] = useState(false);
  const isLandscape = reportData.orientation === 'landscape';

  const handleCopyText = async () => {
    const fullText = [
      reportData.college,
      reportData.department,
      reportData.batch,
      `Subject code & Name: ${reportData.subjectCode}`,
      reportData.subjectName,
      `Your Name: ${reportData.studentName}`,
      `Date: ${reportData.date}`,
      reportData.activityTitle,
      '',
      ...reportData.paragraphs
    ].join('\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="preview-control-toolbar" 
      className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20"
    >
      {/* Left side: View & Edit controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Orientation Toggle: Landscape / Portrait */}
        <button
          type="button"
          id="toggle-orientation-btn"
          onClick={onToggleOrientation}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition-colors cursor-pointer border border-stone-200/80 shadow-2xs"
          title="Switch between A4 Landscape and Portrait"
        >
          <RotateCw className="w-3.5 h-3.5 text-blue-600" />
          <span>{isLandscape ? 'A4 Landscape (297×210)' : 'A4 Portrait (210×297)'}</span>
        </button>

        {/* Zoom Controls */}
        <div className="inline-flex items-center bg-stone-100/90 p-0.5 rounded-lg border border-stone-200/80 text-stone-700 text-xs">
          <button
            type="button"
            id="zoom-out-btn"
            onClick={() => onZoomChange(Math.max(0.4, zoom - 0.08))}
            className="p-1 hover:bg-white rounded-md transition-colors cursor-pointer text-stone-600"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono font-medium text-[11px] select-none text-stone-800">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            id="zoom-in-btn"
            onClick={() => onZoomChange(Math.min(1.25, zoom + 0.08))}
            className="p-1 hover:bg-white rounded-md transition-colors cursor-pointer text-stone-600"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inline Edit Toggle */}
        <button
          type="button"
          id="toggle-inline-edit-btn"
          onClick={onToggleEditable}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            isEditable
              ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
          title="Click to toggle inline text editing in the preview"
        >
          {isEditable ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <Edit3 className="w-3.5 h-3.5 text-stone-500" />}
          <span className="hidden sm:inline">{isEditable ? 'Editing On' : 'Edit Text'}</span>
        </button>

        {/* Copy Text */}
        <button
          type="button"
          id="copy-text-btn"
          onClick={handleCopyText}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
          title="Copy formatted text to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Right side: Export & Print actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          id="print-btn"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer"
          title="Print or Save via Browser dialog"
        >
          <Printer className="w-3.5 h-3.5 text-stone-600" />
          <span>Print</span>
        </button>

        <button
          type="button"
          id="download-pdf-btn"
          disabled={isDownloading}
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{downloadStatus || 'Exporting...'}</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
