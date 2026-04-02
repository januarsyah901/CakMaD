import React from 'react';
import { X, Code2 } from 'lucide-react';

export default function CustomCssPanel({ isOpen, onClose, css, onCssChange }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 bottom-10 w-full sm:w-[400px] bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-40 animate-in slide-in-from-right duration-300">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-900/50">
          <div className="flex items-center gap-2">
            <Code2 className="text-blue-500" size={20} />
            <span className="font-semibold text-gray-800 dark:text-gray-100">Custom CSS — Preview Override</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
          <div className="text-xs text-info-600 dark:text-info-400 bg-info-50/50 dark:bg-info-900/10 p-3 rounded-lg border border-info-100/50 dark:border-info-900/20">
            Apply CSS to preview elements. Example:
            <code className="block mt-2 font-mono opacity-80">
              h1 {'{'} color: #3b82f6; {'}'}<br/>
              blockquote {'{'} border-left: 4px solid #10b981; {'}'}
            </code>
          </div>
          
          <div className="flex-1 min-h-0">
            <textarea
              className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-gray-300 resize-none"
              placeholder="/* Add your styles here */"
              value={css}
              onChange={(e) => onCssChange(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
            Changes are applied in real-time to the preview panel.
          </p>
        </div>
      </div>
    </div>
  );
}
