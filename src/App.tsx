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
import { cleanStudentNotesAndTags, formatTopicsToStudentPhrase } from './utils/textUtils.ts';
import { generateCombinatoricReport } from './utils/reportGenerator.ts';

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
    
    // Warn if name is empty
    if (!reportData.studentName.trim()) {
      showNotification('Please enter your name in the Name field first.', 'info');
      // Scroll to name card if needed
      document.getElementById('student-name-input')?.focus();
      return;
    }

    setIsGenerating(true);
    showNotification('Generating personalized report grounded in class activity...', 'info');

    try {
      const res = await fetch(`/api/generate?t=${Date.now()}`, {
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
          gotChance: reportData.gotChance,
          topicsDiscussed: reportData.topicsDiscussed,
          customDetails: activePrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      if (result.paragraphs && Array.isArray(result.paragraphs)) {
        setReportData(prev => ({
          ...prev,
          paragraphs: result.paragraphs.map((p: string) => cleanStudentNotesAndTags(p)),
          activityTitle: result.activityTitle || prev.activityTitle,
        }));
        setHasGenerated(true);
        setCurrentStep(2);
        showNotification('Personalized report generated with unique variation!', 'success');
      }
    } catch (err) {
      console.warn('API error, applying combinatoric unique generation:', err);
      
      const dynamicReport = generateCombinatoricReport({
        date: reportData.date,
        studentName: reportData.studentName,
        activityTitle: reportData.activityTitle,
        gotChance: reportData.gotChance,
        topicsDiscussed: reportData.topicsDiscussed,
        customDetails: activePrompt,
        prompt: activePrompt,
      });

      setReportData(prev => ({
        ...prev,
        paragraphs: dynamicReport.paragraphs,
      }));
      setHasGenerated(true);
      setCurrentStep(2);
      showNotification('Generated fresh personalized academic reflection.', 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  // "I am feeling lucky" button handler
  const handleLucky = async () => {
    setIsGenerating(true);
    showNotification('Auto-generating an authentic personalized student report...', 'info');

    // Sample student profiles for quick discovery
    const sampleNames = ['Abhishek S', 'Ananya Nair', 'Rahul R', 'Kavya Krishna', 'Fathima Salim', 'Siddharth M'];
    const randomName = reportData.studentName.trim() || sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomGotChance = Math.random() > 0.4; // 60% chance spoke, 40% chance group prep
    const sampleTopics = randomGotChance 
      ? [['Software Engineer', 'Problem Solving', 'Strengths'], ['Entrepreneur', 'Creativity', 'Future Goals'], ['Communication', 'Technology', 'Hobbies']][Math.floor(Math.random() * 3)]
      : [];
    const generatedPromptText = randomGotChance
      ? `I spoke about ${sampleTopics.join(', ')}, my coding interests, and practicing clear pacing without hesitation.`
      : 'Participated actively in group practice and helped peers with phrasing.';

    setPrompt(generatedPromptText);
    setReportData(prev => ({
      ...prev,
      studentName: randomName,
      gotChance: randomGotChance,
      topicsDiscussed: sampleTopics
    }));

    try {
      const res = await fetch(`/api/generate?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: randomName,
          date: reportData.date || '22-09-2026',
          activityTitle: reportData.activityTitle,
          gotChance: randomGotChance,
          topicsDiscussed: sampleTopics,
          customDetails: generatedPromptText,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result = await res.json();
      if (result.paragraphs && Array.isArray(result.paragraphs)) {
        setReportData(prev => ({
          ...prev,
          studentName: randomName,
          gotChance: randomGotChance,
          topicsDiscussed: sampleTopics,
          paragraphs: result.paragraphs.map((p: string) => cleanStudentNotesAndTags(p)),
          activityTitle: result.activityTitle || prev.activityTitle,
        }));
        setHasGenerated(true);
        setCurrentStep(2);
        showNotification(`Generated report for ${randomName}!`, 'success');
      }
    } catch (err) {
      console.warn('Lucky API fallback:', err);
      const dynamicReport = generateCombinatoricReport({
        date: reportData.date || '22-09-2026',
        studentName: randomName,
        activityTitle: reportData.activityTitle,
        gotChance: randomGotChance,
        topicsDiscussed: sampleTopics,
        customDetails: generatedPromptText,
      });

      setReportData(prev => ({ 
        ...prev, 
        studentName: randomName,
        gotChance: randomGotChance,
        topicsDiscussed: sampleTopics,
        paragraphs: dynamicReport.paragraphs
      }));
      setHasGenerated(true);
      setCurrentStep(2);
      showNotification(`Lucky report generated for ${randomName}!`, 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToTemplate = () => {
    setReportData({
      ...INITIAL_TEMPLATE_REPORT,
      orientation: reportData.orientation || 'portrait'
    });
    setPrompt('');
    showNotification('Reset form fields to blank.', 'info');
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    
    setIsDownloading(true);
    setCurrentStep(3);
    setDownloadStatus('Preparing PDF...');

    const rawStudentName = reportData.studentName.trim();
    const safeStudentName = rawStudentName 
      ? rawStudentName.replace(/\s+/g, '_').replace(/[\\/:*?"<>|]/g, '') 
      : 'student_name';
    const fileName = `${safeStudentName} (activity 1.1).pdf`;

    try {
      const success = await exportElementToPdf(
        documentRef.current,
        fileName,
        (status) => setDownloadStatus(status),
        reportData.orientation || 'portrait'
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
                onRegenerate={() => handleGenerate()}
                isGenerating={isGenerating}
                onToggleTeacherSignature={() => setReportData(prev => ({ ...prev, showTeacherSignature: !prev.showTeacherSignature }))}
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
