import { useRef } from 'react';
import { FilePlus, Upload } from 'lucide-react';
import { templates } from '../data/templates';
import { analytics } from '../utils/analytics';
import { timeAgo } from '../utils/timeAgo';
import { btn } from './ui/styles';

export default function EmptyStateGuidance({ documents, onOpenDoc, onCreateDoc, onImportFile, onBrowseTemplates }) {
  const fileInput = useRef(null);
  const recent = [...documents].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5);

  const createFrom = (t) => {
    analytics.track('Document Created', { source: 'empty_state_template', templateId: t.id });
    onCreateDoc(t.label, t.content);
  };

  return (
    <div className="flex flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:py-16">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No document open</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Start a blank page, open a .md file, or pick up where you left off.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => { analytics.track('Document Created', { source: 'empty_state_blank' }); onCreateDoc('Untitled', ''); }}
            className={btn.primary}
          >
            <FilePlus size={16} /> Blank document
          </button>
          <button onClick={() => fileInput.current?.click()} className={btn.secondary}>
            <Upload size={16} /> Open .md file
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".md,.markdown,.txt,text/markdown,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                analytics.track('Document Imported');
                onImportFile(file);
              }
              e.target.value = '';
            }}
          />
        </div>

        {recent.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Recent</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800">
              {recent.map((doc) => (
                <li key={doc.id}>
                  <button onClick={() => onOpenDoc(doc.id)} className="flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-700">
                    <span className="truncate text-sm text-gray-900 dark:text-gray-100">{doc.title}</span>
                    <span className="shrink-0 text-xs text-gray-500">{timeAgo(doc.updatedAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Templates</h2>
            <button onClick={onBrowseTemplates} className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Preview all
            </button>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {templates.slice(0, 6).map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => createFrom(t)}
                  className="h-full w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-4 py-3 text-left hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{t.label}</span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{t.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
