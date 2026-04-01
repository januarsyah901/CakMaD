import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';

export default function ExportButton({ getPreviewRef }) {
  const [filename, setFilename] = useState('document');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const el = getPreviewRef();
    if (!el) return;
    
    setIsExporting(true);
    try {
      // Small timeout to allow state to settle
      await new Promise(res => setTimeout(res, 50));
      exportToPdf(el, filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-dark-800 rounded-lg shadow-sm px-3 py-1.5 border border-gray-200 dark:border-gray-600">
      <FileText size={16} className="text-gray-500 dark:text-gray-400" />
      <input
        type="text"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="bg-transparent text-sm w-24 sm:w-32 focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder="filename"
      />
      <span className="text-sm text-gray-500 dark:text-gray-400 select-none">.pdf</span>
      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
      <button
        onClick={handleExport}
        disabled={isExporting || !filename.trim()}
        className="flex items-center gap-1 text-sm font-medium px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors"
      >
        <Download size={14} />
        <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
      </button>
    </div>
  );
}
