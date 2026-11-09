import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import FileItem from './FileItem';
import { btn } from './ui/styles';

export default function Sidebar({
  documents, activeDocId, onCreate, onOpen, onRename, onDelete, onDuplicate,
  onReorder, isVisible, isMobile, onClose,
}) {
  const [query, setQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (!isVisible) return null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? documents.filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
    : documents;
  // Reordering only makes sense on the full, unfiltered list.
  const canReorder = !q;

  const resetDrag = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <aside
      aria-label="Documents"
      className={`${isMobile ? 'fixed inset-y-0 left-0 z-30 shadow-xl' : 'relative shrink-0'} flex h-full w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-800`}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Documents <span className="ml-1 font-normal normal-case tracking-normal">{documents.length}</span>
        </h2>
        <div className="flex items-center">
          <button onClick={() => onCreate('Untitled')} className={`${btn.icon} p-1.5`} title="New document" aria-label="New document">
            <Plus size={17} />
          </button>
          {isMobile && (
            <button onClick={onClose} className={`${btn.icon} p-1.5`} aria-label="Close sidebar">
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {documents.length > 3 && (
        <div className="relative px-3 pb-2">
          <Search size={14} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') setQuery(''); }}
            placeholder="Search documents"
            aria-label="Search documents"
            className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900 py-1.5 pl-7 pr-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}

      <ul className="min-h-0 flex-1 space-y-px overflow-y-auto px-2 pb-2">
        {filtered.map((doc) => {
          const index = documents.indexOf(doc);
          return (
            <li
              key={doc.id}
              draggable={canReorder}
              onDragStart={(e) => { setDraggedIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={(e) => {
                if (draggedIndex === null) return;
                e.preventDefault();
                e.stopPropagation();
                if (draggedIndex !== index) setDragOverIndex(index);
              }}
              onDrop={(e) => {
                if (draggedIndex === null) return;
                e.preventDefault();
                e.stopPropagation();
                if (draggedIndex !== index) onReorder(draggedIndex, index);
                resetDrag();
              }}
              onDragEnd={resetDrag}
              className={`relative ${draggedIndex === index ? 'opacity-40' : ''} ${dragOverIndex === index ? 'after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-brand-500' : ''}`}
            >
              <FileItem
                document={doc}
                isActive={doc.id === activeDocId}
                onClick={() => onOpen(doc.id)}
                onRename={onRename}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-gray-500">
            {q ? `No documents match “${query}”.` : 'No documents yet.'}
          </li>
        )}
      </ul>

      <p className="border-t border-gray-200 dark:border-gray-700 px-3 py-2 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
        Stored in this browser only.
      </p>
    </aside>
  );
}
