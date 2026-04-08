import { useRef } from 'react';
import { FileText, Settings, Upload, Download, ArrowRightLeft } from 'lucide-react';

export default function Footer({ 
  words, chars, charsNoSpace, syncEnabled, toggleSync, onExportModal, 
  onSaveMd, onOpenMd, onOpenTemplateModal, onToggleCustomCss 
}) {
  const fileInputRef = useRef(null);

  const handleOpenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onOpenMd(file);
    }
    // clear input
    e.target.value = '';
  };

  return (
    <footer className="flex flex-wrap items-center justify-between px-4 py-2 bg-white dark:bg-dark-800 shadow-sm border-t border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium z-10 w-full gap-2">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <span className="text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Cak MaD</span>
        <span className="hidden xs:inline">Words: {words}</span>
        <span className="hidden xs:inline">Chars: {chars}</span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 text-gray-500 overflow-x-auto no-scrollbar">
        <button
          onClick={onOpenTemplateModal}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Choose Template"
        >
          <FileText size={14} />
          <span className="hidden md:inline">Templates</span>
        </button>

        <button
          onClick={onToggleCustomCss}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Custom CSS Preview"
        >
          <Settings size={14} />
          <span className="hidden md:inline">Custom CSS</span>
        </button>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

        <button
          onClick={handleOpenClick}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Open .md file"
        >
          <Upload size={14} />
          <span className="hidden lg:inline">Open</span>
        </button>
        <input 
          type="file" 
          accept=".md,.txt,text/markdown,text/plain" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        <button
          onClick={onSaveMd}
          className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Save as .md file"
        >
          <Download size={14} />
          <span className="hidden lg:inline">Save</span>
        </button>

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
          <span className="hidden md:inline">Sync: {syncEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onExportModal}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </footer>
  );
}
