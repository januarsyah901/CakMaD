import { X } from 'lucide-react';
import { btn } from './ui/styles';

const SNIPPETS = [
  { label: 'Serif headings', css: ".markdown-preview h1, .markdown-preview h2 { font-family: 'Playfair Display', serif; }" },
  { label: 'Justify text', css: '.markdown-preview p { text-align: justify; }' },
  { label: 'Larger text', css: '.markdown-preview { font-size: 17px; line-height: 1.8; }' },
  { label: 'No H2 rule', css: '.markdown-preview h2 { border-bottom: none; }' },
  { label: 'Striped tables', css: '.markdown-preview tr:nth-child(even) td { background: rgba(127, 127, 127, 0.08); }' },
];

export default function CustomCssPanel({ isOpen, onClose, css, onCssChange }) {
  if (!isOpen) return null;

  const add = (snippet) => onCssChange(css.trim() ? `${css.trimEnd()}\n${snippet}\n` : `${snippet}\n`);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    // Tab inserts indentation instead of leaving the field.
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart: s, selectionEnd: end } = el;
      onCssChange(css.slice(0, s) + '  ' + css.slice(end));
      requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
    }
  };

  return (
    <aside
      aria-label="Custom CSS"
      className="fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 shadow-xl sm:w-[380px] modal-panel"
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Custom CSS</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Applies to this document's preview and PDF only.</p>
        </div>
        <button onClick={onClose} className={`${btn.icon} -mr-1`} aria-label="Close custom CSS">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        {SNIPPETS.map((s) => (
          <button
            key={s.label}
            onClick={() => add(s.css)}
            title={s.css}
            className="rounded-md border border-gray-200 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-400"
          >
            + {s.label}
          </button>
        ))}
      </div>

      <textarea
        autoFocus
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-gray-50 dark:bg-dark-900 p-4 font-mono text-[13px] leading-6 text-gray-800 dark:text-gray-200 outline-none"
        placeholder={'.markdown-preview h1 {\n  color: #1e3a8a;\n}'}
        value={css}
        onChange={(e) => onCssChange(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-2.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">Scope rules with <code className="font-mono">.markdown-preview</code></span>
        <button onClick={() => onCssChange('')} disabled={!css} className="text-xs font-medium text-gray-600 hover:text-red-600 disabled:opacity-40 dark:text-gray-400">
          Clear
        </button>
      </div>
    </aside>
  );
}
