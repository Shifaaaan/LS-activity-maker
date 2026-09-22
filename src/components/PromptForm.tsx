import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  User, 
  Check, 
  Sliders, 
  Mic, 
  MicOff, 
  Tag, 
  Palette,
  GraduationCap,
  School,
  ChevronDown,
  ChevronUp,
  Pipette,
  PenLine
} from 'lucide-react';
import { ReportData } from '../types.ts';
import { 
  CHANCE_SUGGESTIONS, 
  INITIAL_TEMPLATE_REPORT,
  BORDER_COLORS,
  HEADING_COLORS,
  TITLE_COLORS,
  DESIGN_TEMPLATES
} from '../data/presets.ts';

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
  isGenerating,
}) => {
  // Common format section open state - OPEN by default as requested!
  const [isCommonFormatOpen, setIsCommonFormatOpen] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // gotChance state: true | false | null
  const gotChance = data.gotChance ?? null;

  const handleSelectChance = (choice: boolean) => {
    onDataChange({ gotChance: choice });
  };

  // Toggle topic suggestion into topicsDiscussed
  const handleToggleSuggestion = (tagText: string) => {
    const existingTopics = data.topicsDiscussed || [];
    let updatedTopics: string[];
    if (existingTopics.includes(tagText)) {
      updatedTopics = existingTopics.filter(t => t !== tagText);
    } else {
      updatedTopics = [...existingTopics, tagText];
    }
    onDataChange({ topicsDiscussed: updatedTopics });
  };

  const handleResetCommonFormats = () => {
    onDataChange({
      college: INITIAL_TEMPLATE_REPORT.college,
      department: INITIAL_TEMPLATE_REPORT.department,
      batch: INITIAL_TEMPLATE_REPORT.batch,
      subjectCode: INITIAL_TEMPLATE_REPORT.subjectCode,
      subjectName: INITIAL_TEMPLATE_REPORT.subjectName,
      date: INITIAL_TEMPLATE_REPORT.date,
      activityTitle: INITIAL_TEMPLATE_REPORT.activityTitle,
      title1Color: INITIAL_TEMPLATE_REPORT.title1Color || '#000000',
      title2Color: INITIAL_TEMPLATE_REPORT.title2Color || '#000000',
      orientation: 'portrait',
    });
  };

  return (
    <div id="prompt-form-container" className="space-y-4 text-stone-900">
      
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: NAME INPUT (Clean Chatbot Style, No Pre-fill)
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="student-name-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              1
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Student Name
            </span>
          </div>
          <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Required
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Enter your name
        </h3>
        <p className="text-xs text-stone-500 mb-3">
          Type your full name as you want it to appear in your official submitted report.
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <User className="w-4 h-4 text-stone-500" />
          </div>
          <input
            id="student-name-input"
            type="text"
            value={data.studentName}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onChange={(e) => onDataChange({ studentName: e.target.value })}
            placeholder={isInputFocused ? "" : "Enter your name"}
            autoComplete="off"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white text-sm font-medium text-stone-900 border border-stone-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 rounded-xl outline-none transition-all placeholder:text-stone-400"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-0.5">
          <span>Appears on document as:</span>
          <span className="font-semibold text-stone-800 font-serif">
            {data.studentName.trim() ? `Your Name: ${data.studentName}` : 'Your Name: ____________________'}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 px-0.5">
          <span>Saved PDF file name:</span>
          <span className="font-mono text-[10.5px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {data.studentName.trim() ? `${data.studentName.trim().replace(/\s+/g, '_').replace(/[\\/:*?"<>|]/g, '')} (activity 1.1).pdf` : 'student_name (activity 1.1).pdf'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: COMMON FORMAT & COLLEGE HEADERS (Open by default, simple UI)
          Title 1: College of Engineering Karunagappally (+ Color options)
          Title 2: Department of Computer Science (+ Color options)
          Batch, Date, Activity Title
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="common-formats-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              2
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Common Format & Titles
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Batch-B Default
            </span>
            <button
              type="button"
              onClick={() => setIsCommonFormatOpen(!isCommonFormatOpen)}
              className="text-stone-400 hover:text-stone-700 transition-colors p-1"
              title={isCommonFormatOpen ? "Collapse section" : "Expand section"}
            >
              {isCommonFormatOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              College, Department & Common Format
            </h3>
            <p className="text-xs text-stone-500">
              Institutional header texts and color styling for Title 1 and Title 2.
            </p>
          </div>
        </div>

        {isCommonFormatOpen && (
          <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
            {/* Title 1: College of Engineering Karunagappally */}
            <div className="bg-stone-50/70 rounded-xl p-3 border border-stone-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Title 1 (College Name)</span>
                </label>
                <span className="text-[10px] font-mono text-stone-500">
                  {data.title1Color || '#000000'}
                </span>
              </div>
              
              <input
                id="college-title-input"
                type="text"
                value={data.college}
                onChange={(e) => onDataChange({ college: e.target.value })}
                placeholder="COLLEGE OF ENGINEERING KARUNAGAPPALLY"
                className="w-full px-3 py-2 bg-white text-xs font-bold tracking-wide uppercase border border-stone-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-2 shadow-2xs"
                style={{ color: data.title1Color || '#000000' }}
              />

              {/* Title 1 Color Choices */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10.5px] text-stone-500 font-medium mr-0.5">Color:</span>
                {TITLE_COLORS.map((tc) => {
                  const isSelected = (data.title1Color || '#000000').toLowerCase() === tc.hex.toLowerCase();
                  return (
                    <button
                      key={tc.id}
                      type="button"
                      id={`title1-color-${tc.id}`}
                      onClick={() => onDataChange({ title1Color: tc.hex })}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white border-stone-900 shadow-2xs text-stone-900 ring-1 ring-stone-900 font-semibold'
                          : 'bg-white border-stone-200/90 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                        style={{ backgroundColor: tc.hex }} 
                      />
                      <span>{tc.name}</span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-stone-900" />}
                    </button>
                  );
                })}
                {/* Custom Color Picker */}
                <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-medium bg-white border border-stone-200/90 text-stone-600 cursor-pointer hover:border-stone-400">
                  <Pipette className="w-2.5 h-2.5 text-stone-500" />
                  <span>Custom</span>
                  <input
                    type="color"
                    value={data.title1Color || '#000000'}
                    onChange={(e) => onDataChange({ title1Color: e.target.value })}
                    className="w-3.5 h-3.5 p-0 border-0 cursor-pointer rounded overflow-hidden"
                  />
                </label>
              </div>
            </div>

            {/* Title 2: Department of Computer Science */}
            <div className="bg-stone-50/70 rounded-xl p-3 border border-stone-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-blue-600" />
                  <span>Title 2 (Department Name)</span>
                </label>
                <span className="text-[10px] font-mono text-stone-500">
                  {data.title2Color || '#000000'}
                </span>
              </div>
              
              <input
                id="department-title-input"
                type="text"
                value={data.department}
                onChange={(e) => onDataChange({ department: e.target.value })}
                placeholder="DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING"
                className="w-full px-3 py-2 bg-white text-xs font-bold tracking-normal uppercase border border-stone-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-2 shadow-2xs"
                style={{ color: data.title2Color || '#000000' }}
              />

              {/* Title 2 Color Choices */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10.5px] text-stone-500 font-medium mr-0.5">Color:</span>
                {TITLE_COLORS.map((tc) => {
                  const isSelected = (data.title2Color || '#000000').toLowerCase() === tc.hex.toLowerCase();
                  return (
                    <button
                      key={tc.id}
                      type="button"
                      id={`title2-color-${tc.id}`}
                      onClick={() => onDataChange({ title2Color: tc.hex })}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white border-stone-900 shadow-2xs text-stone-900 ring-1 ring-stone-900 font-semibold'
                          : 'bg-white border-stone-200/90 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" 
                        style={{ backgroundColor: tc.hex }} 
                      />
                      <span>{tc.name}</span>
                      {isSelected && <Check className="w-2.5 h-2.5 text-stone-900" />}
                    </button>
                  );
                })}
                {/* Custom Color Picker */}
                <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-medium bg-white border border-stone-200/90 text-stone-600 cursor-pointer hover:border-stone-400">
                  <Pipette className="w-2.5 h-2.5 text-stone-500" />
                  <span>Custom</span>
                  <input
                    type="color"
                    value={data.title2Color || '#000000'}
                    onChange={(e) => onDataChange({ title2Color: e.target.value })}
                    className="w-3.5 h-3.5 p-0 border-0 cursor-pointer rounded overflow-hidden"
                  />
                </label>
              </div>
            </div>

            {/* Batch & Submission Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Batch
                </label>
                <input
                  id="batch-input"
                  type="text"
                  value={data.batch}
                  onChange={(e) => onDataChange({ batch: e.target.value })}
                  placeholder="BATCH-B"
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs font-medium text-stone-900 border border-stone-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Submission Date
                </label>
                <input
                  id="date-input"
                  type="text"
                  value={data.date}
                  onChange={(e) => onDataChange({ date: e.target.value })}
                  placeholder="22-09-2026"
                  className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs font-medium text-stone-900 border border-stone-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                  Activity held: <span className="font-semibold text-stone-700">19-09-2026</span> • Submission: <span className="font-semibold text-stone-700">{data.date || '22-09-2026'}</span>
                </p>
              </div>
            </div>

            {/* Activity Title */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Activity Title
              </label>
              <input
                id="activity-title-input"
                type="text"
                value={data.activityTitle}
                onChange={(e) => onDataChange({ activityTitle: e.target.value })}
                placeholder="GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)"
                className="w-full px-3 py-2 bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-xs font-medium text-stone-900 border border-stone-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Reset to standard button */}
            <div className="flex justify-between items-center pt-1 text-xs">
              <span className="text-[11px] text-stone-400">
                Paper: A4 Portrait (210×297mm)
              </span>
              <button
                type="button"
                id="reset-common-format-btn"
                onClick={handleResetCommonFormats}
                className="text-[11px] font-medium text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-stone-100 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Standard Format</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: DID YOU GET A CHANCE TO INTRODUCE YOURSELF? (Yes / No)
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="chance-selection-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              3
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Speaking Opportunity
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            3 per group
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Did you get a chance to introduce yourself?
        </h3>
        <p className="text-xs text-stone-500 mb-3.5">
          The teacher randomly selected 3 students from each of the 6 roll-number groups to present on stage.
        </p>

        {/* Big, Simple YES / NO Buttons for first-time users */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            id="chance-yes-btn"
            onClick={() => handleSelectChance(true)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              gotChance === true
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-stone-50/80 hover:bg-stone-100/70 border-stone-200/90 text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-stone-900">
                <Mic className={`w-4 h-4 ${gotChance === true ? 'text-blue-600' : 'text-stone-500'}`} />
                <span>Yes</span>
              </div>
              {gotChance === true && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              I was chosen to introduce myself in front of the class.
            </p>
          </button>

          <button
            type="button"
            id="chance-no-btn"
            onClick={() => handleSelectChance(false)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              gotChance === false
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-stone-50/80 hover:bg-stone-100/70 border-stone-200/90 text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-stone-900">
                <MicOff className={`w-4 h-4 ${gotChance === false ? 'text-blue-600' : 'text-stone-500'}`} />
                <span>No</span>
              </div>
              {gotChance === false && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              I practiced with my group, but was not selected to speak on stage.
            </p>
          </button>
        </div>

        {/* ── SUB-SECTION A: IF YES (What did you talk about? + Smart Suggestions) ── */}
        {gotChance === true && (
          <div className="space-y-3 pt-2 border-t border-stone-100 animate-in fade-in duration-150">
            <div>
              <label htmlFor="user-prompt-textarea" className="block text-xs font-semibold text-stone-900 mb-1">
                What did you talk about?
              </label>
              <p className="text-[11px] text-stone-500 mb-2">
                Click any keywords you touched on, or type details below:
              </p>

              {/* 10–15 Smart Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {CHANCE_SUGGESTIONS.map((tag, idx) => {
                  const isSelected = (data.topicsDiscussed || []).includes(tag);
                  return (
                    <button
                      key={idx}
                      type="button"
                      id={`suggestion-chip-${idx}`}
                      onClick={() => handleToggleSuggestion(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white font-medium shadow-2xs'
                          : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200/60'
                      }`}
                    >
                      <Tag className="w-2.5 h-2.5 opacity-70" />
                      <span>{tag}</span>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </button>
                  );
                })}
              </div>

              <textarea
                id="user-prompt-textarea"
                rows={3}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="e.g. I spoke about my coding projects, goal to work in tech, and learning to speak with clearer pacing..."
                className="w-full text-xs text-stone-900 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 rounded-xl p-3 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none transition-all placeholder:text-stone-400 resize-y"
              />
            </div>
          </div>
        )}

        {/* ── SUB-SECTION B: IF NO (Anything you want to mention? Optional) ── */}
        {gotChance === false && (
          <div className="space-y-2 pt-2 border-t border-stone-100 animate-in fade-in duration-150">
            <label htmlFor="user-prompt-textarea" className="block text-xs font-semibold text-stone-900">
              Anything you want to mention? <span className="font-normal text-stone-400">(Optional)</span>
            </label>
            <p className="text-[11px] text-stone-500">
              The report will naturally state you participated actively in group preparation and peer rehearsal. Add any personal notes if you wish:
            </p>
            <textarea
              id="user-prompt-textarea"
              rows={2}
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="e.g. I helped coordinate our group's practice time and worked on replacing informal phrasing like 'Myself'..."
              className="w-full text-xs text-stone-900 bg-stone-50 hover:bg-stone-100/50 focus:bg-white border border-stone-200 rounded-xl p-3 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 outline-none transition-all placeholder:text-stone-400 resize-y"
            />
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4: DESIGN & TEMPLATES (Border Colors, Heading Colors, Presets)
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="design-templates-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              4
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Border & Document Style
            </span>
          </div>
          <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
            <Palette className="w-3 h-3" />
            <span>Templates</span>
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Select Design & Color Theme
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Choose a preset template or customize your document border and activity heading colors.
        </p>

        {/* Quick Style Templates */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Preset Templates
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DESIGN_TEMPLATES.map((tmpl) => {
              const isSelected = 
                (data.borderColor || '#234994') === tmpl.borderColor &&
                (data.headingColor || '#800020') === tmpl.headingColor;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  id={`design-template-${tmpl.id}`}
                  onClick={() => onDataChange({ borderColor: tmpl.borderColor, headingColor: tmpl.headingColor })}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-600' 
                      : 'border-stone-200/80 bg-stone-50/50 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: tmpl.borderColor }}
                        title={`Border: ${tmpl.borderColor}`}
                      />
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: tmpl.headingColor }}
                        title={`Heading: ${tmpl.headingColor}`}
                      />
                    </div>
                    {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                  </div>
                  <span className="text-[11px] font-semibold text-stone-900 block truncate leading-tight">
                    {tmpl.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Border Colors Selection */}
        <div className="mb-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
              Border Color <span className="text-stone-400 font-normal">(6 Options)</span>
            </label>
            <span className="font-mono text-[10px] text-stone-500">
              Active: {data.borderColor || '#234994'}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BORDER_COLORS.map((bc) => {
              const isSelected = (data.borderColor || '#234994') === bc.hex;
              return (
                <button
                  key={bc.id}
                  type="button"
                  id={`border-color-btn-${bc.id}`}
                  onClick={() => onDataChange({ borderColor: bc.hex })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-stone-900 bg-stone-50 shadow-2xs ring-1 ring-stone-900' 
                      : 'border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded-full shadow-xs flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: bc.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
                  </div>
                  <span className="text-[10px] font-medium text-stone-700 text-center leading-tight truncate w-full">
                    {bc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Heading Colors Selection */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
              Activity Heading Color <span className="text-stone-400 font-normal">(3 Options)</span>
            </label>
            <span className="font-mono text-[10px] text-stone-500">
              Active: {data.headingColor || '#800020'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {HEADING_COLORS.map((hc) => {
              const isSelected = (data.headingColor || '#800020') === hc.hex;
              return (
                <button
                  key={hc.id}
                  type="button"
                  id={`heading-color-btn-${hc.id}`}
                  onClick={() => onDataChange({ headingColor: hc.hex })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-stone-900 bg-stone-50 shadow-2xs ring-1 ring-stone-900' 
                      : 'border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded-full shadow-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: hc.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[11px] font-semibold text-stone-900 block truncate">
                      {hc.name}
                    </span>
                    <span className="text-[9.5px] font-mono text-stone-400 block truncate">
                      {hc.hex}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 5: TEACHER'S REMARKS & SIGNATURE FOOTER
          Includes Teacher's Remarks (dotted line) on left and Teacher's Signature (solid line) on right
          ───────────────────────────────────────────────────────────── */}
      <div 
        id="teacher-signature-card" 
        className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold">
              5
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Teacher's Remarks & Signature
            </span>
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
            data.showTeacherSignature !== false
              ? 'text-blue-700 bg-blue-50 border-blue-200 font-semibold' 
              : 'text-stone-600 bg-stone-100 border-stone-200'
          }`}>
            {data.showTeacherSignature !== false ? 'Standard Format: Enabled' : 'Omitted'}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Teacher's Remarks & Signature Footer
        </h3>
        <p className="text-xs text-stone-500 mb-3.5">
          Controls the bottom footer inside the border: Teacher's Remarks with dotted line on the left, and Teacher's Signature with solid line on the right.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            id="teacher-signature-yes-btn"
            onClick={() => onDataChange({ showTeacherSignature: true })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              data.showTeacherSignature !== false
                ? 'border-blue-600 bg-blue-50/60 shadow-2xs ring-1 ring-blue-600'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
              data.showTeacherSignature !== false ? 'border-blue-600 bg-blue-600 text-white' : 'border-stone-400 bg-white'
            }`}>
              {data.showTeacherSignature !== false && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5 text-blue-600" />
                <span>Yes, include Footer (Standard)</span>
              </span>
              <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                Includes Teacher's Remarks (dotted line) & Signature (solid line) at the bottom.
              </span>
            </div>
          </button>

          <button
            type="button"
            id="teacher-signature-no-btn"
            onClick={() => onDataChange({ showTeacherSignature: false })}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              data.showTeacherSignature === false
                ? 'border-blue-600 bg-blue-50/60 shadow-2xs ring-1 ring-blue-600'
                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
              data.showTeacherSignature === false ? 'border-blue-600 bg-blue-600 text-white' : 'border-stone-400 bg-white'
            }`}>
              {data.showTeacherSignature === false && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block">
                No, leave bottom blank
              </span>
              <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                Leaves the bottom 15–20% completely empty with no footer lines.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRIMARY GENERATE BUTTONS
          ───────────────────────────────────────────────────────────── */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          id="generate-formatted-btn"
          disabled={isGenerating}
          onClick={() => onGenerate()}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Generating Personalized Report...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Personalized Report</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="feeling-lucky-btn"
          disabled={isGenerating}
          onClick={onLucky}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-200 active:scale-[0.99] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          title="Auto-generate a random authentic student report"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>I&#39;m Feeling Lucky</span>
        </button>
      </div>

    </div>
  );
};
