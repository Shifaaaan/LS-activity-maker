import React, { forwardRef } from 'react';
import { ReportData } from '../types.ts';

interface DocumentSheetProps {
  data: ReportData;
  isEditable?: boolean;
  onUpdateParagraph?: (index: number, text: string) => void;
  scale?: number;
}

export const DocumentSheet = forwardRef<HTMLDivElement, DocumentSheetProps>(
  ({ data, isEditable = false, onUpdateParagraph, scale = 1 }, ref) => {
    const isLandscape = data.orientation === 'landscape';

    return (
      <div 
        className="flex justify-center items-start select-text"
        style={{ 
          transformOrigin: 'top center',
        }}
      >
        {/* Exact A4 Sheet: 297mm x 210mm (Landscape) or 210mm x 297mm (Portrait) */}
        <div
          ref={ref}
          id="academic-report-sheet"
          className="report-page-sheet text-black font-academic relative flex flex-col justify-between shrink-0"
          style={{
            width: isLandscape ? '297mm' : '210mm',
            height: isLandscape ? '210mm' : '297mm',
            aspectRatio: isLandscape ? '297 / 210' : '210 / 297',
            boxSizing: 'border-box',
            padding: isLandscape ? '10mm 12mm' : '16mm 16mm',
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* Exact Navy Blue Inner Border - 3.5px solid #234994 matching Muhammed Shifan's submitted document */}
          <div
            id="report-navy-border"
            className="w-full h-full flex-1 flex flex-col justify-between"
            style={{
              border: '3.5px solid #234994',
              boxSizing: 'border-box',
              padding: isLandscape ? '10mm 12mm 8mm 12mm' : '16mm 14mm 14mm 14mm',
              overflow: 'hidden',
            }}
          >
            {/* Top Block: College Header, Subject & Student Info */}
            <div className="w-full">
              {/* College, Department, Batch */}
              <div className="text-center space-y-0.5">
                <h1 
                  id="report-college-name"
                  className={`${isLandscape ? 'text-[15pt]' : 'text-[17pt]'} leading-tight font-bold tracking-wide uppercase underline decoration-1 underline-offset-3 text-black`}
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {data.college}
                </h1>

                <h2 
                  id="report-department-name"
                  className={`${isLandscape ? 'text-[12pt]' : 'text-[14pt]'} leading-tight font-bold tracking-normal uppercase underline decoration-1 underline-offset-3 pt-0.5 text-black`}
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {data.department}
                </h2>

                <h3 
                  id="report-batch-name"
                  className={`${isLandscape ? 'text-[11pt]' : 'text-[12.5pt]'} leading-tight font-bold tracking-wider uppercase pt-0.5 text-black`}
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {data.batch}
                </h3>
              </div>

              {/* Subject & Student Info Bar: In Landscape, clean two-column; in Portrait, stacked */}
              {isLandscape ? (
                <div className="flex items-start justify-between mt-4 text-black text-[10pt] leading-tight px-1" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                  <div className="space-y-0.5">
                    <p id="report-student-name" className="font-bold">
                      Your Name: {data.studentName}
                    </p>
                    <p id="report-submission-date" className="font-bold">
                      Date: {data.date}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p id="report-subject-code" className="font-bold">
                      Subject code & Name: {data.subjectCode}
                    </p>
                    <p id="report-subject-title" className="font-bold">
                      {data.subjectName}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Subject Code & Name (Centered) */}
                  <div className="text-center mt-6 space-y-0.5 text-black">
                    <p 
                      id="report-subject-code"
                      className="text-[11pt] leading-normal font-bold"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      Subject code & Name: {data.subjectCode}
                    </p>
                    <p 
                      id="report-subject-title"
                      className="text-[11pt] leading-normal font-bold"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      {data.subjectName}
                    </p>
                  </div>

                  {/* Student Name & Date (Left Aligned) */}
                  <div className="mt-7 space-y-1 text-black">
                    <p 
                      id="report-student-name"
                      className="text-[11pt] leading-normal font-bold"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      Your Name: {data.studentName}
                    </p>
                    <p 
                      id="report-submission-date"
                      className="text-[11pt] leading-normal font-bold"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      Date: {data.date}
                    </p>
                  </div>
                </>
              )}

              {/* Activity Title (Dark Maroon Red #800020, Uppercase, Underlined) */}
              <div className={isLandscape ? 'mt-3.5' : 'mt-6'}>
                <h4 
                  id="report-activity-title"
                  className={`${isLandscape ? 'text-[10.5pt]' : 'text-[11.5pt]'} leading-snug font-bold uppercase underline decoration-1 underline-offset-2`}
                  style={{ 
                    color: '#800020',
                    fontFamily: "'Times New Roman', Times, serif",
                    textDecorationColor: '#800020'
                  }}
                >
                  {data.activityTitle}
                </h4>
              </div>
            </div>

            {/* Three Academic Reflection Paragraphs (Justified Text, 10.5pt/11pt, 1.5 line spacing) */}
            <div className={`text-black flex-1 flex flex-col justify-around ${isLandscape ? 'my-3 space-y-2' : 'my-5 space-y-4'}`}>
              {data.paragraphs.map((para, idx) => (
                <div key={idx} className="relative group">
                  {isEditable ? (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onUpdateParagraph?.(idx, e.currentTarget.textContent || '')}
                      id={`report-paragraph-editable-${idx}`}
                      className={`${isLandscape ? 'text-[10pt] leading-[1.48]' : 'text-[11pt] leading-[1.58]'} text-black text-justify transition-colors outline-none focus:bg-blue-50/50 hover:bg-amber-50/40 p-1 -m-1 rounded cursor-text`}
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                      }}
                    >
                      {para}
                    </div>
                  ) : (
                    <p
                      id={`report-paragraph-${idx}`}
                      className={`${isLandscape ? 'text-[10pt] leading-[1.48]' : 'text-[11pt] leading-[1.58]'} text-black text-justify`}
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                      }}
                    >
                      {para}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Subtle verification footer note within bottom of document page */}
            <div className="pt-2 text-center shrink-0">
              <span 
                className="text-[7pt] font-sans tracking-wider"
                style={{ color: '#78716c' }}
              >
                CEK Department of Computer Science • Official Activity Report Format ({isLandscape ? 'A4 Landscape' : 'A4 Portrait'})
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DocumentSheet.displayName = 'DocumentSheet';

