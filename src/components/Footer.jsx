import { AlertTriangle, ArrowLeftRight, Check, Heart, LayoutTemplate, Paintbrush } from 'lucide-react';

const item = 'inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-dark-700 dark:hover:text-gray-100 transition-colors';

export default function Footer({
  words, chars, storageError, syncEnabled, toggleSync, showSync,
  onOpenTemplateModal, onToggleCustomCss, isCustomCssOpen, hasCustomCss,
}) {
  const minutes = Math.max(1, Math.round(words / 220));

  return (
    <footer className="flex h-full w-full items-center justify-between gap-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex min-w-0 items-center gap-3 px-2 tabular-nums">
        {storageError ? (
          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400" title="Browser storage is full. Remove large images or delete old documents, then download a copy.">
            <AlertTriangle size={13} /> Not saved — storage full
          </span>
        ) : (
          <span className="inline-flex items-center gap-1" title="Saved in this browser">
            <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> Saved
          </span>
        )}
        <span>{words.toLocaleString()} words</span>
        <span className="hidden sm:inline">{chars.toLocaleString()} characters</span>
        <span className="hidden md:inline">{minutes} min read</span>
      </div>

      <div className="flex shrink-0 items-center">
        <button onClick={onOpenTemplateModal} className={item} title="New from template (Ctrl+Alt+N)">
          <LayoutTemplate size={14} /> <span className="hidden sm:inline">Templates</span>
        </button>
        <button onClick={onToggleCustomCss} className={`${item} ${isCustomCssOpen ? 'text-gray-900 dark:text-gray-100' : ''}`} title="Custom CSS for this document" aria-pressed={isCustomCssOpen}>
          <Paintbrush size={14} /> <span className="hidden sm:inline">CSS{hasCustomCss ? ' •' : ''}</span>
        </button>
        {showSync && (
          <button onClick={toggleSync} className={item} title="Scroll the preview along with the editor" aria-pressed={syncEnabled}>
            <ArrowLeftRight size={14} className={syncEnabled ? 'text-brand-600 dark:text-brand-400' : ''} />
            <span className="hidden md:inline">Scroll sync {syncEnabled ? 'on' : 'off'}</span>
          </button>
        )}
        <a href="https://saweria.co/januarsyah" target="_blank" rel="noopener noreferrer" className={item} title="Support Cak MaD">
          <Heart size={14} /> <span className="hidden lg:inline">Support</span>
        </a>
      </div>
    </footer>
  );
}
