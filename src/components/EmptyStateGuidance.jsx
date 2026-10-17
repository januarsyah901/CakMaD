import React from 'react';
import { Sparkles, FileCode, PenTool, Upload, Plus } from 'lucide-react';
import { templates } from '../data/templates';
import { analytics } from '../utils/analytics';

export default function EmptyStateGuidance({ onCreateDoc, onImportFile }) {
  const handleSelectTemplate = (templateId) => {
    const found = templates.find(t => t.id === templateId) || templates[0];
    analytics.track('Document Created', { source: 'empty_state_card', templateId: found.id });
    onCreateDoc(found.label, found.content);
  };

  const handleCreateBlank = () => {
    analytics.track('Document Created', { source: 'empty_state_blank' });
    onCreateDoc('Untitled', '');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
      {/* Title & Guidance */}
      <img 
        src="/icon.svg" 
        alt="Cak MaD Logo" 
        className="w-14 h-14 rounded-2xl shadow-sm mb-4" 
      />

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        What do you want to create today?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 mb-8 max-w-md">
        Select a starter workflow to transform your ideas or AI output into a clean, structured document.
      </p>

      {/* 4 Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
        {/* Create AI Report */}
        <button
          onClick={() => handleSelectTemplate('ai-report')}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-md transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles size={18} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            Create AI Report
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Starter layout with executive summaries, metrics, and charts.
          </p>
        </button>

        {/* Create Documentation */}
        <button
          onClick={() => handleSelectTemplate('readme')}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-md transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileCode size={18} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            Create Documentation
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Technical specs, README files, and API documentation.
          </p>
        </button>

        {/* Create Notes */}
        <button
          onClick={() => handleSelectTemplate('meeting')}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-md transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <PenTool size={18} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Create Notes
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Daily logs, meeting summaries, and action checklists.
          </p>
        </button>

        {/* Import Markdown */}
        <label className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 hover:border-brand-500 dark:hover:border-brand-400 hover:shadow-md transition group cursor-pointer block">
          <input
            type="file"
            accept=".md,.markdown,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                analytics.track('Document Imported');
                onImportFile(e.target.files[0]);
              }
            }}
          />
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Upload size={18} />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Import Markdown
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Load an existing .md file directly from your computer.
          </p>
        </label>
      </div>

      {/* Or Blank Canvas */}
      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={handleCreateBlank}
          className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition"
        >
          <Plus size={14} /> Start with a blank document
        </button>
      </div>
    </div>
  );
}
