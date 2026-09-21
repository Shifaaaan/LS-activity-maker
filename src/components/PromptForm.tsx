import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Calendar, 
  BookOpen, 
  School, 
  Check, 
  Sliders,
  Layers,
  ArrowRight,
  Hash
} from 'lucide-react';
import { ReportData } from '../types.ts';
import { PROMPT_IDEAS, INITIAL_TEMPLATE_REPORT } from '../data/presets.ts';

interface PromptFormProps {
  data: ReportData;
  prompt: string;
  onPromptChange: (val: string) => void;
  onDataChange: (newData: Partial<ReportData>) => void;
  onGenerate: (overridePrompt?: string) => void;
  onLucky: () => void;
  onResetToTemplate: () => void;
  isGenerating: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  data,
  prompt,
  onPromptChange,
  onDataChange,
  onGenerate,
  onLucky,
  onResetToTemplate,
  isGenerating,
}) => {
  // Mode for Card 2: 'standard' or 'custom'
  const [formatMode, setFormatMode] = useState<'standard' | 'custom'>('standard');

  const handleResetCommonFormats = () => {
    onDataChange({
      college: INITIAL_TEMPLATE_REPORT.college,
      department: INITIAL_TEMPLATE_REPORT.department,
      batch: INITIAL_TEMPLATE_REPORT.batch,
      subjectCode: INITIAL_TEMPLATE_REPORT.subjectCode,
      subjectName: INITIAL_TEMPLATE_REPORT.subjectName,
      date: INITIAL_TEMPLATE_REPORT.date,
      activityTitle: INITIAL_TEMPLATE_REPORT.activityTitle,
    });
    setFormatMode('standard');
  };

  return (
    <div id="prompt-form-container" className="space-y-4 text-stone-900">
      
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: 1ST INPUT IS STUDENT NAME (Prominent & Apple Styled)
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="student-name-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              1
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Student Identity
            </span>
          </div>
          <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            First Step
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          What is your full name?
        </h3>
        <p className="text-xs text-stone-500 mb-3.5">
          Enter your name as it should appear in the submitted college report.
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <User className="w-4 h-4 text-stone-500" />
          </div>
          <input
            id="student-name-input"
            type="text"
            value={data.studentName}
            onChange={(e) => onDataChange({ studentName: e.target.value })}
            placeholder="e.g. Muhammed Shifan"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white text-sm font-medium text-stone-900 border border-stone-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 rounded-xl outline-none transition-all placeholder:text-stone-400"
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500 px-0.5">
          <span>Live preview on document:</span>
          <span className="font-semibold text-stone-800 font-serif">
            Your Name: {data.studentName || 'Not entered yet'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: COMMON FORMATS CUSTOMIZATION QUESTION
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="common-formats-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              2
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Common Formats
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            CEK Batch-B
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Do you want to change anything from the common formats?
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          All reports default to official CEK Department of Computer Science Batch-B variables.
        </p>

        {/* Apple-style Segmented Control */}
        <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 mb-4 text-xs font-medium text-stone-600">
          <button
            type="button"
            id="format-mode-standard-btn"
            onClick={() => setFormatMode('standard')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              formatMode === 'standard'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>Keep Standard Defaults</span>
          </button>

          <button
            type="button"
            id="format-mode-custom-btn"
            onClick={() => setFormatMode('custom')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              formatMode === 'custom'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-stone-600" />
            <span>Customize Formats</span>
          </button>
        </div>

        {/* Standard View: Notion-like Property summary */}
        {formatMode === 'standard' ? (
          <div className="bg-[#fbfbfd] rounded-xl border border-stone-200/70 p-3.5 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">College:</span>
                <span className="font-semibold text-stone-800 truncate max-w-[150px]" title={data.college}>
                  CE Karunagappally
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">Department:</span>
                <span className="font-semibold text-stone-800">Computer Science</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">Batch:</span>
                <span className="font-semibold text-stone-800">{data.batch}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">Subject:</span>
                <span className="font-semibold text-stone-800">{data.subjectCode}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">Date:</span>
                <span className="font-semibold text-stone-800">{data.date}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-stone-100">
                <span className="text-stone-500">Orientation:</span>
                <span className="font-semibold text-blue-700">A4 Landscape</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Activity: {data.activityTitle}</span>
              <button
                type="button"
                onClick={() => setFormatMode('custom')}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
              >
                Change variables →
              </button>
            </div>
          </div>
        ) : (
          /* Custom View: Inputs for ONLY the common variables currently in the app */
          <div className="space-y-3 pt-1 animate-in fade-in duration-150">
            {/* College Name */}
            <div>
              <label htmlFor="var-college" className="block text-[11px] font-medium text-stone-600 mb-1">
                College Name
              </label>
              <input
                id="var-college"
                type="text"
                value={data.college}
                onChange={(e) => onDataChange({ college: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-serif"
              />
            </div>

            {/* Department & Batch */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="var-department" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Department
                </label>
                <input
                  id="var-department"
                  type="text"
                  value={data.department}
                  onChange={(e) => onDataChange({ department: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-serif"
                />
              </div>
              <div>
                <label htmlFor="var-batch" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Batch
                </label>
                <input
                  id="var-batch"
                  type="text"
                  value={data.batch}
                  onChange={(e) => onDataChange({ batch: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-serif"
                />
              </div>
            </div>

            {/* Subject Code & Subject Name */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label htmlFor="var-subject-code" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Subject Code
                </label>
                <input
                  id="var-subject-code"
                  type="text"
                  value={data.subjectCode}
                  onChange={(e) => onDataChange({ subjectCode: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-mono"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="var-subject-name" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Subject Name
                </label>
                <input
                  id="var-subject-name"
                  type="text"
                  value={data.subjectName}
                  onChange={(e) => onDataChange({ subjectName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-serif"
                />
              </div>
            </div>

            {/* Date & Activity Title */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1">
                <label htmlFor="var-date" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Date
                </label>
                <input
                  id="var-date"
                  type="text"
                  value={data.date}
                  onChange={(e) => onDataChange({ date: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="var-activity-title" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Activity Title
                </label>
                <input
                  id="var-activity-title"
                  type="text"
                  value={data.activityTitle}
                  onChange={(e) => onDataChange({ activityTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs text-stone-900 border border-stone-200 rounded-lg outline-none focus:border-blue-600 transition-all font-serif"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                id="reset-common-formats-btn"
                onClick={handleResetCommonFormats}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to standard Batch-B</span>
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('standard')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: SESSION REFLECTION & PROMPT INPUT
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="prompt-input-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              3
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Session Reflection
            </span>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            {prompt.length > 0 ? `${prompt.length} chars` : 'Optional notes'}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            What would you like to write about?
          </h3>
          <p className="text-xs text-stone-500">
            Type your notes or experience. The tool formats it into the exact 3-paragraph college reflection layout.
          </p>
        </div>

        <textarea
          id="user-prompt-textarea"
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="For example: We had 50 students in groups of 10. I practiced introduction with teammates, worked on voice clarity, and learned to avoid starting with 'Myself'..."
          className="w-full text-xs sm:text-sm text-stone-900 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 rounded-xl p-3.5 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none transition-all placeholder:text-stone-400 resize-y min-h-[90px]"
        />

        {/* Notion-style prompt starter chips */}
        <div>
          <div className="text-[11px] font-medium text-stone-500 mb-2 flex items-center gap-1">
            <span>Quick starters:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_IDEAS.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                id={`prompt-chip-${idx}`}
                onClick={() => onPromptChange(idea.prompt)}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer text-left"
              >
                {idea.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apple Style Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            id="generate-formatted-btn"
            disabled={isGenerating}
            onClick={() => onGenerate()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Formatting to Standard...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Format Into Department PDF Style</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="feeling-lucky-btn"
            disabled={isGenerating}
            onClick={onLucky}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-200 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Auto-generate content using the original PDF context"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>I&#39;m Feeling Lucky</span>
          </button>
        </div>
      </div>
    </div>
  );
};
