import { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import Preview from './Preview';
import { btn } from './ui/styles';
import { templates, TEMPLATE_CATEGORIES } from '../data/templates';
import { analytics } from '../utils/analytics';

const RECENT_TEMPLATES_KEY = 'cakmad_recent_templates';

const readRecents = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_TEMPLATES_KEY)) || [];
  } catch {
    return [];
  }
};

export default function TemplateModal({ isOpen, onClose, onSelect }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [recentIds, setRecentIds] = useState(readRecents);

  useEffect(() => {
    if (isOpen) analytics.track('Template Modal Opened');
  }, [isOpen]);

  const handleSelect = (template) => {
    const next = [template.id, ...recentIds.filter((id) => id !== template.id)].slice(0, 3);
    setRecentIds(next);
    localStorage.setItem(RECENT_TEMPLATES_KEY, JSON.stringify(next));
    analytics.track('Template Selected', { templateId: template.id, category: template.category });
    onSelect(template);
    onClose();
  };

  const recentSet = new Set(recentIds);
  const visible = (activeCategory === 'all' ? templates : templates.filter((t) => t.category === activeCategory))
    // Recently used first, otherwise keep the authored order.
    .slice().sort((a, b) => (recentSet.has(b.id) ? 1 : 0) - (recentSet.has(a.id) ? 1 : 0));
  const selected = templates.find((t) => t.id === selectedId) || templates[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="New from template"
      description="Each template opens as a new document. Text in [brackets] is meant to be replaced."
      bodyClassName="p-0 flex flex-col"
      footer={
        <>
          <button onClick={onClose} className={btn.ghost}>Cancel</button>
          <button onClick={() => handleSelect(selected)} className={btn.primary}>Use “{selected.label}”</button>
        </>
      }
    >
      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700 px-5 py-2">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
              activeCategory === cat.id
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ul className="max-h-[35vh] md:max-h-none md:h-[60vh] overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2" role="listbox" aria-label="Templates">
          {visible.map((t) => {
            const isSelected = t.id === selected.id;
            return (
              <li key={t.id}>
                <button
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(t.id)}
                  onDoubleClick={() => handleSelect(t)}
                  className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-brand-50 dark:bg-brand-950/40' : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t.label}
                    {recentSet.has(t.id) && <span className="text-[11px] font-normal text-gray-500">recent</span>}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{t.description}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="h-[40vh] md:h-[60vh] overflow-y-auto bg-gray-100 dark:bg-dark-900 p-4">
          <div className="mx-auto max-w-xl origin-top rounded-sm bg-white dark:bg-dark-800 px-8 py-7 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 [&_.markdown-preview]:text-[13px] [&_.markdown-preview]:leading-6">
            <Preview content={selected.content} selectedFont="sans-serif" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
