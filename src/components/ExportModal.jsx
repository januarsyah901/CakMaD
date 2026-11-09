import { useEffect, useRef, useState } from 'react';
import { Check, Download, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './ui/Modal';
import Preview from './Preview';
import { btn, input, label, segment, segmentGroup } from './ui/styles';
import { analytics } from '../utils/analytics';
import { fontLabel } from '../data/fonts';

const PAPER = [
  { id: 'a4', label: 'A4', size: '210 × 297 mm', ratio: 297 / 210, width: 210 },
  { id: 'letter', label: 'Letter', size: '8.5 × 11 in', ratio: 279.4 / 215.9, width: 215.9 },
  { id: 'a3', label: 'A3', size: '297 × 420 mm', ratio: 420 / 297, width: 297 },
];
const MARGINS = { Narrow: 10, Normal: 20, Wide: 30 };

const SUPPORT_URL = 'https://saweria.co/januarsyah';
const safeName = (s) => (s || '').replace(/[\\/:*?"<>|]+/g, '').trim();

export default function ExportModal({ isOpen, onClose, content, docTitle, selectedFont, customCss }) {
  // Mounted only while open, so initial state is the reset state.
  const [filename, setFilename] = useState(() => safeName(docTitle) || 'document');
  const [paperSize, setPaperSize] = useState(() => localStorage.getItem('mde_v11_pdf_size') || 'a4');
  const [margin, setMargin] = useState(() => localStorage.getItem('mde_v11_pdf_margin') || 'Normal');
  const [includeTitle, setIncludeTitle] = useState(() => localStorage.getItem('mde_v11_pdf_title') === 'true');
  const [status, setStatus] = useState('idle'); // idle | exporting | done
  const previewRef = useRef(null);

  useEffect(() => {
    analytics.track('Export Modal Opened');
  }, []);

  useEffect(() => {
    localStorage.setItem('mde_v11_pdf_size', paperSize);
    localStorage.setItem('mde_v11_pdf_margin', margin);
    localStorage.setItem('mde_v11_pdf_title', String(includeTitle));
  }, [paperSize, margin, includeTitle]);

  const paper = PAPER.find((p) => p.id === paperSize) || PAPER[0];
  const name = safeName(filename);

  const handleExport = async () => {
    if (!previewRef.current || !name) return;
    analytics.track('Export Started', { format: 'pdf', paperSize, margin });
    setStatus('exporting');
    try {
      // html2canvas + jsPDF are heavy; load them on first export.
      const { exportToPdf } = await import('../utils/exportPdf');
      await exportToPdf({
        element: previewRef.current,
        filename: name,
        paperSize,
        margin,
        includeTitle,
        selectedFont,
        customCss,
      });
      analytics.track('Export Succeeded', { paperSize });
      setStatus('done');
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed. Try again, or check the browser console.');
      setStatus('idle');
    }
  };

  // Page thumbnail: margins drawn to scale.
  const thumbW = 108;
  const thumbH = Math.round(thumbW * paper.ratio);
  const inset = (MARGINS[margin] / paper.width) * thumbW;

  const footer = status === 'done' ? (
    <>
      <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className={`${btn.ghost} mr-auto`}>
        <Heart size={15} /> Support Cak MaD
      </a>
      <button onClick={handleExport} className={btn.secondary}>Download again</button>
      <button onClick={onClose} className={btn.primary} data-autofocus>Done</button>
    </>
  ) : (
    <>
      <button onClick={onClose} className={btn.ghost}>Cancel</button>
      <button onClick={handleExport} disabled={status === 'exporting' || !name} className={btn.primary}>
        <Download size={16} /> {status === 'exporting' ? 'Generating…' : 'Download PDF'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export PDF" footer={footer}>
      {/* Offscreen copy of the document, so export works even with the preview pane hidden. */}
      <div aria-hidden="true" className="pointer-events-none fixed -left-[10000px] top-0 w-[800px]">
        <Preview ref={previewRef} content={content} selectedFont={selectedFont} customCss={customCss} />
      </div>

      {status === 'done' ? (
        <div className="flex items-start gap-3 py-2">
          <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Check size={16} />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-gray-100">{name}.pdf downloaded</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {paper.label}, {margin.toLowerCase()} margins{includeTitle ? ', with cover page' : ''}. Check your downloads folder.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-5">
          <div className="hidden sm:flex w-[132px] shrink-0 flex-col items-center gap-2 rounded-md bg-gray-100 dark:bg-dark-900 py-4">
            <div
              className="relative bg-white shadow-sm ring-1 ring-gray-200 transition-all"
              style={{ width: thumbW, height: thumbH }}
              aria-hidden="true"
            >
              <div className="absolute border border-dashed border-brand-500/60" style={{ inset }}>
                <div className="space-y-1 p-1">
                  <div className="h-1.5 w-3/4 rounded-sm bg-gray-300" />
                  {Array.from({ length: Math.max(3, Math.floor((thumbH - 2 * inset) / 9) - 2) }).map((_, i) => (
                    <div key={i} className="h-1 rounded-sm bg-gray-200" style={{ width: `${90 - ((i * 17) % 30)}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{paper.size}</span>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <label htmlFor="pdf-name" className={label}>File name</label>
              <div className="flex">
                <input
                  id="pdf-name"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleExport(); }}
                  className={`${input} rounded-r-none`}
                  spellCheck={false}
                />
                <span className="flex items-center rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-700 px-3 font-mono text-sm text-gray-500">.pdf</span>
              </div>
            </div>

            <div>
              <span className={label}>Paper</span>
              <div className={segmentGroup} role="radiogroup" aria-label="Paper size">
                {PAPER.map((p) => (
                  <button key={p.id} role="radio" aria-checked={paperSize === p.id} onClick={() => setPaperSize(p.id)} className={segment(paperSize === p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className={label}>Margins</span>
              <div className={segmentGroup} role="radiogroup" aria-label="Margins">
                {Object.entries(MARGINS).map(([m, mm]) => (
                  <button key={m} role="radio" aria-checked={margin === m} onClick={() => setMargin(m)} className={segment(margin === m)} title={`${mm} mm`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={includeTitle} onChange={(e) => setIncludeTitle(e.target.checked)} className="h-4 w-4 rounded accent-brand-500" />
              Add a cover page with the title and date
            </label>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Font: {fontLabel(selectedFont)}{customCss?.trim() ? ' · custom CSS applied' : ''}. Change the font from the toolbar.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
