import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, HelpCircle, FileText, CheckCircle2, RotateCcw, AlertCircle, ArrowRight, RotateCw, Eye } from 'lucide-react';
import { ReportData } from './types.ts';
import { INITIAL_TEMPLATE_REPORT } from './data/presets.ts';
import { DocumentSheet } from './components/DocumentSheet.tsx';
import { PromptForm } from './components/PromptForm.tsx';
import { StepBar } from './components/StepBar.tsx';
import { PreviewToolbar } from './components/PreviewToolbar.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { exportElementToPdf } from './utils/pdfExport.ts';

export default function App() {
  const [reportData, setReportData] = useState<ReportData>(INITIAL_TEMPLATE_REPORT);
  const [prompt, setPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [isEditable, setIsEditable] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const isLandscape = reportData.orientation === 'landscape';

  // Dynamic zoom fitted for A4 Landscape
  const [zoom, setZoom] = useState(0.72);

  // Onboarding modal state - auto open on first visit
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem('cek_onboarding_viewed');
    } catch {
      return true;
    }
  });

  const documentRef = useRef<HTMLDivElement>(null);

  // Responsive zoom sizing for A4 Landscape
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (isLandscape) {
        if (width < 640) {
          setZoom(0.36); // Mobile screen fit for 297mm
        } else if (width < 1024) {
          setZoom(0.52); // Tablet
        } else if (width < 1440) {
          setZoom(0.68); // Laptop
        } else {
          setZoom(0.80); // Desktop
        }
      } else {
        if (width < 640) {
          setZoom(0.48);
        } else if (width < 1024) {
          setZoom(0.68);
        } else if (width < 1440) {
          setZoom(0.82);
        } else {
          setZoom(0.95);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLandscape]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('cek_onboarding_viewed', 'true');
    } catch {
      // ignore
    }
  };

  const handleDataChange = (newData: Partial<ReportData>) => {
    setReportData(prev => ({ ...prev, ...newData }));
  };

  const handleToggleOrientation = () => {
    const nextOrientation = reportData.orientation === 'portrait' ? 'landscape' : 'portrait';
    setReportData(prev => ({
      ...prev,
      orientation: nextOrientation
    }));
    showNotification(
      `Orientation changed to A4 ${nextOrientation === 'landscape' ? 'Landscape (297×210mm)' : 'Portrait (210×297mm)'}`,
      'info'
    );
  };

  const handleUpdateParagraph = (index: number, text: string) => {
    setReportData(prev => {
      const nextParagraphs = [...prev.paragraphs];
      nextParagraphs[index] = text;
      return { ...prev, paragraphs: nextParagraphs };
    });
  };

  // Call backend API to format the prompt according to exact PDF style
  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = (overridePrompt ?? prompt).trim();
    if (!activePrompt) {
      showNotification('Please enter a prompt or notes about your session first.', 'info');
      return;
    }

    setIsGenerating(true);
    showNotification('Formatting your report according to department guidelines...', 'info');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          studentName: reportData.studentName,
          date: reportData.date,
          activityTitle: reportData.activityTitle,
          college: reportData.college,
          department: reportData.department,
          batch: reportData.batch,
          subjectCode: reportData.subjectCode,
          subjectName: reportData.subjectName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      if (result.paragraphs && Array.isArray(result.paragraphs)) {
        setReportData(prev => ({
          ...prev,
          paragraphs: result.paragraphs,
          activityTitle: result.activityTitle || prev.activityTitle,
        }));
        setHasGenerated(true);
        setCurrentStep(2);
        showNotification('Report formatted to exact department layout!', 'success');
      }
    } catch (err) {
      console.warn('API error, applying client-side template formatting:', err);
      const cleanPrompt = activePrompt.endsWith('.') ? activePrompt : activePrompt + '.';
      setReportData(prev => ({
        ...prev,
        paragraphs: [
          `On ${prev.date}, our Ma’am conducted a group formation and self-introduction activity for Batch-B. There were 50 students present, divided into groups of 10. We were given 15–20 minutes for preparation, after which 3 students were randomly selected from each group to introduce themselves.`,
          `During this activity, ${cleanPrompt} Our group members supported one another, practiced delivery pacing, and refined our introduction statements.`,
          `Through this activity, I learned that we should not begin an introduction with “Myself”; instead, we should use phrases like “I am” or “My name is.” I also learned how to present our strengths and weaknesses appropriately, especially in interviews. Overall, the activity improved my understanding of effective self-introduction and increased my confidence through practice.`
        ]
      }));
      setHasGenerated(true);
      setCurrentStep(2);
      showNotification('Formatted into 3-paragraph academic reflection structure.', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  // "I am feeling lucky" button handler
  const handleLucky = async () => {
    setIsGenerating(true);
    showNotification('Generating an authentic variation using template PDF context...', 'info');

    try {
      const res = await fetch('/api/lucky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: reportData.studentName,
          date: reportData.date,
          activityTitle: reportData.activityTitle,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      if (result.paragraphs && Array.isArray(result.paragraphs)) {
        setReportData(prev => ({
          ...prev,
          paragraphs: result.paragraphs,
          activityTitle: result.activityTitle || prev.activityTitle,
        }));
        if (result.generatedPrompt) {
          setPrompt(result.generatedPrompt);
        }
        setHasGenerated(true);
        setCurrentStep(2);
        showNotification('Lucky variation generated and loaded into preview!', 'success');
      }
    } catch (err) {
      console.warn('Lucky API fallback:', err);
      const luckyVariation = [
        `On ${reportData.date}, our Ma’am conducted a group formation and self-introduction activity for Batch-B. There were 50 students present, divided into groups of 10. We were given 15–20 minutes for preparation, after which 3 students were randomly selected from each group to introduce themselves.`,
        `I was chosen from our group to deliver my introduction before the entire class. Speaking to my peers, I shared my technical interests, passion for engineering, and career aspirations. The initial rehearsal with our group gave me the poise to speak clearly without hesitation.`,
        `Through this activity, I learned the critical value of non-verbal communication, including eye contact and open posture. Ma’am gave helpful guidance on voice projection and avoiding casual phrasing like “Myself”. Overall, the exercise enhanced my confidence and readiness for formal interactions.`
      ];
      setReportData(prev => ({ ...prev, paragraphs: luckyVariation }));
      setPrompt('Selected from group to deliver introduction before the class, shared background and goals, received feedback on posture and avoiding "Myself".');
      setHasGenerated(true);
      setCurrentStep(2);
      showNotification('Template variation loaded into preview!', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToTemplate = () => {
    setReportData({
      ...INITIAL_TEMPLATE_REPORT,
      orientation: reportData.orientation || 'landscape'
    });
    setPrompt('Rehearsed introduction with group of 10 students, was not picked for main stage, learned to avoid "Myself" and structure strengths and weaknesses for interviews.');
    showNotification('Restored to original submitted PDF template content.', 'info');
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    
    setIsDownloading(true);
    setCurrentStep(3);
    setDownloadStatus('Preparing PDF...');

    const safeName = reportData.studentName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';
    const fileName = `CEK_Report_${safeName}_Activity_1_1.pdf`;

    try {
      const success = await exportElementToPdf(
        documentRef.current,
        fileName,
        (status) => setDownloadStatus(status),
        reportData.orientation || 'landscape'
      );

      if (success) {
        showNotification(`PDF downloaded: ${fileName}`, 'success');
      } else {
        showNotification('PDF print dialog opened for direct saving.', 'info');
      }
    } catch (e) {
      console.error('PDF generation error', e);
      showNotification('Opened browser print window to save as PDF.', 'info');
      window.print();
    } finally {
      setIsDownloading(false);
      setDownloadStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 antialiased">
      {/* Top Navbar: Apple / Notion Minimalist Aesthetic */}
      <header className="bg-white/80 backdrop-blur-md border-b border-black/[0.06] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#234994] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 font-serif">
              CEK
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight truncate">
                  College Report Generator
                </h1>
                <span className="hidden sm:inline text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  A4 {isLandscape ? 'Landscape' : 'Portrait'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate hidden sm:block">
                College of Engineering Karunagappally • Department of Computer Science
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="tutorial-guide-btn"
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>Guide</span>
            </button>

            <button
              type="button"
              id="header-download-btn"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3-Step Navigation Bar */}
      <StepBar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        hasGenerated={hasGenerated}
      />

      {/* Toast Notification */}
      {notification && (
        <div 
          id="status-notification-toast"
          className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-lg border text-xs font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : notification.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700'
                : 'bg-stone-900 text-stone-100 border-stone-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Mobile View Switcher Tabs */}
        <div className="lg:hidden flex rounded-xl bg-stone-200/80 p-1 mb-4 text-xs font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              currentStep === 1 ? 'bg-white text-stone-900 font-semibold shadow-2xs' : 'hover:text-stone-900'
            }`}
          >
            1. Input & Details
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              currentStep >= 2 ? 'bg-white text-stone-900 font-semibold shadow-2xs' : 'hover:text-stone-900'
            }`}
          >
            2. Live A4 Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Cards (Step 1: Name 1st, Common Formats Question, Prompt Box) */}
          <div className={`lg:col-span-5 space-y-4 ${currentStep >= 2 ? 'hidden lg:block' : 'block'}`}>
            <PromptForm
              data={reportData}
              prompt={prompt}
              onPromptChange={setPrompt}
              onDataChange={handleDataChange}
              onGenerate={handleGenerate}
              onLucky={handleLucky}
              onResetToTemplate={handleResetToTemplate}
              isGenerating={isGenerating}
            />

            {/* Department Consistency Guarantee Note */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-xs space-y-1.5">
              <div className="font-semibold text-stone-800 flex items-center gap-1.5 text-[11.5px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Identical Document Guarantee</span>
              </div>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Matches the submitted standard with navy border (<code className="font-mono text-stone-700">#234994</code>), maroon heading (<code className="font-mono text-stone-700">#800020</code>), Times New Roman font, and exact A4 aspect ratio.
              </p>
            </div>
          </div>

          {/* Right Column: PDF Preview Stage (Step 2 & Step 3) */}
          <div className={`lg:col-span-7 flex flex-col ${currentStep === 1 ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
              {/* Preview Toolbar with Orientation & Zoom */}
              <PreviewToolbar
                onDownloadPdf={handleDownloadPdf}
                isDownloading={isDownloading}
                downloadStatus={downloadStatus}
                isEditable={isEditable}
                onToggleEditable={() => setIsEditable(!isEditable)}
                zoom={zoom}
                onZoomChange={setZoom}
                reportData={reportData}
                onToggleOrientation={handleToggleOrientation}
              />

              {/* Exact A4 Aspect Ratio Document Canvas Container */}
              <div 
                id="document-canvas-container"
                className="bg-[#f0f0f2] p-4 sm:p-6 lg:p-8 overflow-auto min-h-[520px] flex justify-center items-start print-document-container transition-all"
              >
                {/* Fixed Aspect Ratio Wrapper: Locks exact A4 ratio 297/210 for Landscape and 210/297 for Portrait */}
                <div 
                  className="transition-transform duration-100 origin-top flex justify-center items-start"
                  style={{ 
                    width: isLandscape ? `${297 * zoom}mm` : `${210 * zoom}mm`, 
                    height: isLandscape ? `${210 * zoom}mm` : `${297 * zoom}mm`,
                    aspectRatio: isLandscape ? '297 / 210' : '210 / 297',
                    maxWidth: '100%',
                  }}
                >
                  <DocumentSheet
                    ref={documentRef}
                    data={reportData}
                    isEditable={isEditable}
                    onUpdateParagraph={handleUpdateParagraph}
                    scale={zoom}
                  />
                </div>
              </div>

              {/* Bottom Status Bar inside preview card */}
              <div className="bg-stone-50/80 border-t border-stone-200/80 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[11px]">
                    A4 {isLandscape ? 'Landscape (297×210mm • 1.414:1)' : 'Portrait (210×297mm • 1:1.414)'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleOrientation}
                    className="text-stone-600 hover:text-stone-900 cursor-pointer flex items-center gap-1 font-medium text-[11px]"
                  >
                    <RotateCw className="w-3 h-3 text-stone-500" />
                    <span>Switch to {isLandscape ? 'Portrait' : 'Landscape'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Download Final PDF</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Onboarding Tutorial Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        onSelectLucky={handleLucky}
      />
    </div>
  );
}
