import React from 'react';
import { PenLine, Eye, Download, Check } from 'lucide-react';

interface StepBarProps {
  currentStep: 1 | 2 | 3;
  onSelectStep: (step: 1 | 2 | 3) => void;
  hasGenerated: boolean;
}

export const StepBar: React.FC<StepBarProps> = ({ currentStep, onSelectStep, hasGenerated }) => {
  const steps = [
    { id: 1 as const, label: '1. Write Prompt', icon: PenLine, desc: 'Input notes or Lucky' },
    { id: 2 as const, label: '2. Review Preview', icon: Eye, desc: 'Identical formatting' },
    { id: 3 as const, label: '3. Download PDF', icon: Download, desc: 'Submission-ready' },
  ];

  return (
    <div id="three-step-navigation" className="w-full bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-stone-200">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.id < currentStep || (step.id === 1 && hasGenerated);

            return (
              <button
                key={step.id}
                id={`step-nav-btn-${step.id}`}
                onClick={() => onSelectStep(step.id)}
                className={`py-3 px-2 sm:px-4 text-left transition-colors flex items-center gap-2.5 cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-50/70 text-blue-900'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-xs font-bold truncate">{step.label}</div>
                  <div className="text-[11px] text-stone-500 truncate">{step.desc}</div>
                </div>
                <div className="sm:hidden text-xs font-semibold truncate">
                  {step.id === 1 ? 'Prompt' : step.id === 2 ? 'Preview' : 'Export'}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
