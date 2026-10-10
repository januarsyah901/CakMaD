import { useRef } from 'react';
import { FileText, Settings, Upload, Download, ArrowRightLeft, Heart } from 'lucide-react';

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
         <a 
           href="https://saweria.co/januarsyah" 
           target="_blank" 
           rel="noopener noreferrer"
           className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition"
           title="Buy me a martabak"
         >
           <Heart size={12} fill="currentColor" />
           <span className="hidden sm:inline text-[9px]">Buy Me a Martabak</span>
         </a>
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
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Toggle Scroll Sync"
        >
          <ArrowRightLeft size={14} />
          <span className="hidden md:inline">Sync: {syncEnabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onExportModal}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-600 transition text-white font-semibold shadow-sm"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </footer>
  );
}
