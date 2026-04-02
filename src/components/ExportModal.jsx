import { useState, useEffect } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';
import toast from 'react-hot-toast';

export default function ExportModal({ isOpen, onClose, getPreviewRef, selectedFont }) {
  const [filename, setFilename] = useState(() => localStorage.getItem('mde_v11_pdf_filename') || 'document');
  const [paperSize, setPaperSize] = useState(() => localStorage.getItem('mde_v11_pdf_size') || 'a4');
  const [margin, setMargin] = useState(() => localStorage.getItem('mde_v11_pdf_margin') || 'Normal');
  const [includeTitle, setIncludeTitle] = useState(() => localStorage.getItem('mde_v11_pdf_title') === 'true');
  const [isExporting, setIsExporting] = useState(false);

  // Save changes to localstorage when they change
  useEffect(() => {
    localStorage.setItem('mde_v11_pdf_filename', filename);
    localStorage.setItem('mde_v11_pdf_size', paperSize);
    localStorage.setItem('mde_v11_pdf_margin', margin);
    localStorage.setItem('mde_v11_pdf_title', includeTitle.toString());
  }, [filename, paperSize, margin, includeTitle]);

  if (!isOpen) return null;

  const handleExport = async () => {
    const el = getPreviewRef();
    if (!el) {
      toast.error('Preview element not found');
      return;
    }
    
    setIsExporting(true);
    const toastId = toast.loading('Generating PDF...');
    
    try {
      await new Promise(res => setTimeout(res, 50));
      await exportToPdf({ element: el, filename, paperSize, margin, includeTitle, selectedFont });
      toast.success('PDF exported ✓', { id: toastId });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to export', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden p-4">
      <div 
        className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText size={20} /> Export as PDF
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">File Name</label>
            <div className="flex items-center">
              <input
                type="text"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                placeholder="document"
              />
              <span className="bg-gray-100 dark:bg-dark-700 border border-l-0 border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 rounded-r-md">.pdf</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Paper Size</label>
            <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 p-1 bg-gray-50 dark:bg-dark-900 gap-1 w-full text-sm">
              {['a4', 'letter', 'a3'].map((size) => (
                <button
                  key={size}
                  onClick={() => setPaperSize(size)}
                  className={`flex-1 py-1.5 px-3 rounded text-center transition ${
                    paperSize === size
                    ? 'bg-blue-600 text-white shadow-sm font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Margin</label>
            <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 p-1 bg-gray-50 dark:bg-dark-900 gap-1 w-full text-sm">
              {['Normal', 'Narrow', 'Wide'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMargin(m)}
                  className={`flex-1 py-1.5 px-3 rounded text-center transition ${
                    margin === m
                    ? 'bg-blue-600 text-white shadow-sm font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={includeTitle}
              onChange={e => setIncludeTitle(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Include auto title page</span>
          </label>
        </div>

        <div className="flex items-center justify-end px-5 py-4 border-t border-gray-200 dark:border-gray-700 gap-3 bg-gray-50 dark:bg-dark-900/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !filename.trim()}
            className="px-4 py-2 flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
          >
            <Download size={16} /> {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
