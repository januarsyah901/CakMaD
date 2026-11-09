import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { btn } from './styles';

/**
 * Dialog shell used by every modal: Esc and backdrop click close it,
 * focus moves into the dialog and returns to the trigger afterwards.
 */
export default function Modal({ isOpen, onClose, title, description, size = 'md', footer, children, bodyClassName = 'p-5' }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', onKey, true);
    // Focus the first field if there is one, otherwise the panel itself.
    const panel = panelRef.current;
    const first = panel?.querySelector('[data-autofocus]') ||
      [...(panel?.querySelectorAll('input, textarea, select') || [])]
        .find((el) => !el.disabled && !el.closest('[aria-hidden="true"]'));
    (first || panel)?.focus();
    return () => {
      window.removeEventListener('keydown', onKey, true);
      previous?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const width = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-950/50 p-0 sm:p-4 modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`modal-panel flex max-h-[92vh] w-full ${width} flex-col overflow-hidden rounded-t-xl sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 shadow-xl focus:outline-none`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          <button onClick={onClose} className={`${btn.icon} -mr-2 -mt-1`} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900/40 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
