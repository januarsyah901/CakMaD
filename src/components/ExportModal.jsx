import React, { useState, useEffect } from 'react';
import { X, FileText, Download, CheckCircle, Eye, Settings2 } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';
import { analytics } from '../utils/analytics';
import toast from 'react-hot-toast';

export default function ExportModal({ isOpen, onClose, getPreviewRef, selectedFont, customCss }) {
  const [filename, setFilename] = useState(() => localStorage.getItem('mde_v11_pdf_filename') || 'document');
  const [paperSize, setPaperSize] = useState(() => localStorage.getItem('mde_v11_pdf_size') || 'a4');
  const [margin, setMargin] = useState(() => localStorage.getItem('mde_v11_pdf_margin') || 'Normal');
  const [includeTitle, setIncludeTitle] = useState(() => localStorage.getItem('mde_v11_pdf_title') === 'true');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      analytics.track('Export Modal Opened');
      setExportComplete(false);
    }
  }, [isOpen]);

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

    analytics.track('Export Started', { format: 'pdf', paperSize, margin });
    setIsExporting(true);
    const toastId = toast.loading('Formatting & generating PDF...');

    try {
      await new Promise(res => setTimeout(res, 60));
      await exportToPdf({
        element: el,
        filename: filename.trim() || 'document',
        paperSize,
        margin,
        includeTitle,
        selectedFont,
        customCss
      });

      analytics.track('Export Succeeded', { filename, paperSize });
      toast.success('Document ready & exported ✓', { id: toastId });
      setExportComplete(true);
      window.open('https://saweria.co/januarsyah', '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export document', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-dark-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Export Document
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your document is ready to be turned into a publication PDF
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* File Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              File Name
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-dark-900 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-gray-100 font-medium"
                placeholder="document"
              />
              <span className="bg-gray-100 dark:bg-dark-700 border border-l-0 border-gray-300 dark:border-gray-600 px-3.5 py-2 text-sm text-gray-500 dark:text-gray-400 rounded-r-lg font-mono">
                .pdf
              </span>
            </div>
          </div>

          {/* Paper Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Paper Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'a4', label: 'A4', sub: 'Standard' },
                { id: 'letter', label: 'Letter', sub: 'US Form' },
                { id: 'a3', label: 'A3', sub: 'Wide' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setPaperSize(item.id)}
                  className={`py-2 px-3 rounded-lg border text-center transition ${
                    paperSize === item.id
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margin */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Page Margins
            </label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-dark-900 gap-1 text-xs">
              {['Normal', 'Narrow', 'Wide'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMargin(m)}
                  className={`flex-1 py-1.5 rounded-md text-center transition ${
                    margin === m
                      ? 'bg-brand-500 text-white font-medium shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTitle}
                onChange={e => setIncludeTitle(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
              />
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Include automatic title cover page
              </span>
            </label>
          </div>

          {/* Ready Confirmation Banner */}
          {exportComplete ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 text-xs animate-in fade-in">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <span><strong>Document is ready to share!</strong> Your download should begin immediately.</span>
            </div>
          ) : (
            <div className="p-3 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40 rounded-xl flex items-center gap-2 text-brand-900 dark:text-brand-200 text-xs">
              <Eye size={15} className="text-brand-500 shrink-0" />
              <span>Uses current active reader font: <strong>{selectedFont}</strong></span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-3 bg-gray-50/80 dark:bg-dark-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !filename.trim()}
            className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Download size={16} /> {isExporting ? 'Preparing PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
