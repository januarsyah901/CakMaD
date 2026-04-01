import { Settings, FileText, ArrowRightLeft } from 'lucide-react';

export default function Footer({ words, chars, charsNoSpace, syncEnabled, toggleSync, onExportModal }) {
  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-white dark:bg-dark-800 shadow-sm border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 font-medium z-10 w-full">
      <div className="flex items-center space-x-4">
        <span>Words: {words}</span>
        <span>Chars: {chars}</span>
        <span className="hidden sm:inline">Chars (no space): {charsNoSpace}</span>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSync}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded transition-colors ${
            syncEnabled 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Toggle Scroll Sync"
        >
          <ArrowRightLeft size={14} />
          <span className="hidden sm:inline">Scroll Sync: {syncEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onExportModal}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Settings size={14} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </footer>
  );
}
