import React, { forwardRef } from 'react';
import { ReportData } from '../types.ts';

interface DocumentSheetProps {
  data: ReportData;
  isEditable?: boolean;
  onUpdateParagraph?: (index: number, text: string) => void;
  scale?: number;
}

const FONT_TIMES = "'Times New Roman', Times, 'Tinos', 'Liberation Serif', serif";

export const DocumentSheet = forwardRef<HTMLDivElement, DocumentSheetProps>(
  ({ data, isEditable = false, onUpdateParagraph, scale = 1 }, ref) => {
    const isLandscape = data.orientation === 'landscape';
    const studentDisplayName = data.studentName?.trim() ? data.studentName : '____________________';
    const currentBorderColor = data.borderColor || '#234994';
    const currentHeadingColor = data.headingColor || '#800020';

    return (
      <div 
        className="flex justify-center items-start select-text"
        style={{ 
          transformOrigin: 'top center',
        }}
      >
        {/* Exact A4 Sheet: 210mm x 297mm (Portrait) or 297mm x 210mm (Landscape) */}
        <div
          ref={ref}
          id="academic-report-sheet"
          className="report-page-sheet text-black font-academic relative flex flex-col justify-between shrink-0"
          style={{
            width: isLandscape ? '297mm' : '210mm',
            height: isLandscape ? '210mm' : '297mm',
            aspectRatio: isLandscape ? '297 / 210' : '210 / 297',
            boxSizing: 'border-box',
            padding: isLandscape ? '10mm 12mm' : '12mm 14mm',
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {/* Custom / Selected Inner Border (Default 3.5px solid #234994) */}
          <div
            id="report-navy-border"
            className="w-full h-full flex flex-col justify-between"
            style={{
              border: `3.5px solid ${currentBorderColor}`,
              boxSizing: 'border-box',
              padding: isLandscape ? '8mm 10mm 6mm 10mm' : '10mm 12mm 8mm 12mm',
              overflow: 'hidden',
            }}
          >
            {/* Top Content Block: Header, Subject, Student, Title, and Paragraphs */}
            <div className="w-full">
              {/* College, Department, Batch */}
              <div className="text-center space-y-0.5">
                <h1 
                  id="report-college-name"
                  className={`${isLandscape ? 'text-[13.5pt]' : 'text-[15pt]'} leading-tight font-bold tracking-wide uppercase underline decoration-1 underline-offset-3`}
                  style={{ 
                    fontFamily: FONT_TIMES,
                    color: data.title1Color || '#234994'
                  }}
                >
                  {data.college}
                </h1>

                <h2 
                  id="report-department-name"
                  className={`${isLandscape ? 'text-[11pt]' : 'text-[12pt]'} leading-tight font-bold tracking-normal uppercase underline decoration-1 underline-offset-3 pt-0.5`}
                  style={{ 
                    fontFamily: FONT_TIMES,
                    color: data.title2Color || '#234994'
                  }}
                >
                  {data.department}
                </h2>

                <h3 
                  id="report-batch-name"
                  className={`${isLandscape ? 'text-[10pt]' : 'text-[11pt]'} leading-tight font-bold tracking-wider uppercase mt-3.5 text-black`}
                  style={{ fontFamily: FONT_TIMES }}
                >
                  {data.batch}
                </h3>
              </div>

              {/* Subject & Student Info */}
              {isLandscape ? (
                <>
                  <div className="flex items-start justify-between mt-2.5 text-black text-[10pt] leading-tight px-1" style={{ fontFamily: FONT_TIMES }}>
                    <div className="space-y-0.5">
                      <p id="report-student-name" className="font-bold">
                        Your Name: {studentDisplayName}
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

                  {/* Activity Title (Landscape: Left-Aligned) */}
                  <div className="text-left mt-2">
                    <h4 
                      id="report-activity-title"
                      className="text-[11pt] leading-snug font-bold uppercase underline decoration-1 underline-offset-2"
                      style={{ 
                        color: currentHeadingColor,
                        fontFamily: FONT_TIMES,
                        textDecorationColor: currentHeadingColor
                      }}
                    >
                      {data.activityTitle}
                    </h4>
                  </div>
                </>
              ) : (
                <>
                  {/* Subject Code & Name (Centered, Bold, Black) */}
                  <div className="text-center mt-3 space-y-0.5 text-black">
                    <p 
                      id="report-subject-code"
                      className="text-[11pt] leading-tight font-bold"
                      style={{ fontFamily: FONT_TIMES }}
                    >
                      Subject code & Name: {data.subjectCode}
                    </p>
                    <p 
                      id="report-subject-title"
                      className="text-[11pt] leading-tight font-bold"
                      style={{ fontFamily: FONT_TIMES }}
                    >
                      {data.subjectName}
                    </p>
                  </div>

                  {/* Student Name & Date (Left Aligned, Bold, Black) */}
                  {/* 3 lines gap above the name and 3 lines gap below the date */}
                  <div 
                    className="space-y-0.5 text-black text-left"
                    style={{ marginTop: '48pt', marginBottom: '48pt' }}
                  >
                    <p 
                      id="report-student-name"
                      className="text-[11pt] leading-tight font-bold"
                      style={{ fontFamily: FONT_TIMES }}
                    >
                      Your Name: {studentDisplayName}
                    </p>
                    <p 
                      id="report-submission-date"
                      className="text-[11pt] leading-tight font-bold"
                      style={{ fontFamily: FONT_TIMES }}
                    >
                      Date: {data.date}
                    </p>
                  </div>

                  {/* Activity Title (Left Aligned, Maroon, Underlined) */}
                  <div className="text-left">
                    <h4 
                      id="report-activity-title"
                      className="text-[11.5pt] leading-snug font-bold uppercase underline decoration-1 underline-offset-2"
                      style={{ 
                        color: currentHeadingColor,
                        fontFamily: FONT_TIMES,
                        textDecorationColor: currentHeadingColor
                      }}
                    >
                      {data.activityTitle}
                    </h4>
                  </div>
                </>
              )}

              {/* Reflection Paragraphs: Start directly after Activity Title with an enter-key shift (mt-2.5), 12pt Times New Roman, 1.5 line height, Justified */}
              <div 
                id="report-body-block"
                className={`w-full text-black ${isLandscape ? 'mt-2' : 'mt-2.5'}`}
              >
                {data.paragraphs.map((para, idx) => (
                  <div key={idx} className="relative group">
                    {isEditable ? (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateParagraph?.(idx, e.currentTarget.textContent || '')}
                        id={`report-paragraph-editable-${idx}`}
                        className="text-[12pt] text-black transition-colors outline-none focus:bg-blue-50/50 hover:bg-amber-50/40 p-1 -m-1 rounded cursor-text"
                        style={{
                          fontFamily: FONT_TIMES,
                          fontSize: '12pt',
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                          lineHeight: 1.5,
                          marginBottom: idx < data.paragraphs.length - 1 ? (isLandscape ? '8pt' : '10.5pt') : '0',
                        }}
                      >
                        {para}
                      </div>
                    ) : (
                      <p
                        id={`report-paragraph-${idx}`}
                        className="text-[12pt] text-black"
                        style={{
                          fontFamily: FONT_TIMES,
                          fontSize: '12pt',
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                          lineHeight: 1.5,
                          marginBottom: idx < data.paragraphs.length - 1 ? (isLandscape ? '8pt' : '10.5pt') : '0',
                        }}
                      >
                        {para}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Block: Teacher's Remarks (Left with dotted line) & Teacher's Signature (Right with solid line) */}
            {data.showTeacherSignature !== false && (
              <div 
                id="report-footer-block"
                className="w-full flex justify-between items-end pt-4 pb-0.5"
                style={{ fontFamily: FONT_TIMES }}
              >
                {/* Teacher's Remarks with dotted line */}
                <div className="text-left">
                  <p className="text-[10.5pt] font-bold text-black tracking-wide">
                    Teacher's Remarks:
                  </p>
                  <div className="w-56 sm:w-64 border-b border-dotted border-stone-400 mt-3.5" />
                </div>

                {/* Teacher's Signature with solid line */}
                <div className="text-center">
                  <div className="w-44 sm:w-48 border-b border-black mb-1" />
                  <p className="text-[10.5pt] font-bold text-black tracking-wide">
                    Teacher's Signature
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DocumentSheet.displayName = 'DocumentSheet';

