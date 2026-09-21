import React from 'react';
import { Sparkles, FileText, Download, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLucky: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onSelectLucky }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="onboarding-modal-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 mb-2">
              <span>Class of CEK • UCHUT128</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Welcome to the Report Generator
            </h3>
            <p className="text-sm text-stone-500 mt-0.5">
              Standardize your academic activity submission in 3 simple steps.
            </p>
          </div>
          <button
            onClick={onClose}
            id="close-onboarding-btn"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Tutorial Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                Add Your Experience or Prompt
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                Type rough notes about what you did in class, or click <strong>&quot;I&#39;m Feeling Lucky&quot;</strong> to auto-generate a contextual variation matching Muhammed Shifan&#39;s submitted PDF format.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                Verify the Identical Department Layout
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                Your report automatically formats into the exact 3-paragraph structure with the official blue frame, Times New Roman typography, and maroon activity header.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                Download PDF Ready for Submission
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                Click <strong>&quot;Download PDF&quot;</strong> to export a high-resolution, print-ready document with identical margins and borders across our entire batch.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            id="modal-lucky-btn"
            onClick={() => {
              onSelectLucky();
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Try &quot;I&#39;m Feeling Lucky&quot; Now
          </button>

          <button
            type="button"
            id="modal-start-btn"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Got it, let&#39;s start</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
