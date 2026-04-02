import React from 'react';
import { X, FileText, Zap } from 'lucide-react';
import { templates } from '../data/templates';

export default function TemplateModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Zap className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">Pick a Template</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Jumpstart your work with a pre-built layout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-full transition-all text-gray-500 dark:text-gray-400 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="group relative flex flex-col items-start text-left p-5 bg-gray-50 dark:bg-dark-900/50 border border-transparent hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.98]"
              >
                <div className="mb-4 p-2.5 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="text-blue-500 dark:text-blue-400" size={24} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.label}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  Use this template →
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50/50 dark:bg-dark-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-xl transition-all active:scale-95"
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
