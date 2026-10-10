import React, { useState } from 'react';
import { X, Sparkles, Edit3, Eye, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { analytics } from '../utils/analytics';

const STEPS = [
  {
    number: '1',
    title: 'Paste your Markdown',
    desc: 'Copy raw Markdown from ChatGPT, Claude, DeepSeek, or any AI assistant into the editor.',
    icon: Sparkles
  },
  {
    number: '2',
    title: 'Edit your content',
    desc: 'Refine sections, add tables, math formulas ($E=mc^2$), and diagrams with live syntax tools.',
    icon: Edit3
  },
  {
    number: '3',
    title: 'Preview your document',
    desc: 'Switch fonts (Poppins, Lora, Fira Code) and view clean typography before exporting.',
    icon: Eye
  },
  {
    number: '4',
    title: 'Export beautifully',
    desc: 'Generate clean, publication-ready PDFs with custom margins and paper sizes in one click.',
    icon: Download
  }
];

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleFinish = () => {
    analytics.track('Onboarding Completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700/80 text-center relative bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20">
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 mb-3">
            <Sparkles size={24} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to Cak MaD
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create beautiful documents from Markdown in 4 easy steps.
          </p>
        </div>

        {/* Stepper Cards */}
        <div className="p-6 space-y-3.5">
          {STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.number}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-50/80 dark:bg-dark-900/60 border border-gray-100 dark:border-gray-700/60"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs shrink-0 mt-0.5">
                  {step.number}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-2 bg-gray-50/50 dark:bg-dark-900/40 border-t border-gray-100 dark:border-gray-700/60">
          <button
            onClick={handleFinish}
            className="w-full py-3 px-5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-medium text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            Start Editing
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
