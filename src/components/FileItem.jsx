import { useState } from 'react';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

const action = 'rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-dark-700 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export default function FileItem({ document, isActive, onClick, onRename, onDelete, onDuplicate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(document.title);

  const startEditing = () => {
    setEditTitle(document.title);
    setIsEditing(true);
  };

  const submit = () => {
    const title = editTitle.trim();
    if (title && title !== document.title) onRename(document.id, title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="px-1 py-1">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          onFocus={(e) => e.target.select()}
          aria-label="Document name"
          className="w-full rounded border border-brand-500 bg-white dark:bg-dark-900 px-2 py-1 text-sm text-gray-900 dark:text-gray-100 outline-none"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      onDoubleClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
        if (e.key === 'F2') startEditing();
        if (e.key === 'Delete') onDelete(document.id);
      }}
      className={`group relative flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        isActive
          ? 'bg-white dark:bg-dark-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600'
          : 'hover:bg-gray-100 dark:hover:bg-dark-700/60'
      }`}
    >
      {isActive && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand-500" aria-hidden="true" />}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${isActive ? 'font-medium text-gray-900 dark:text-gray-50' : 'text-gray-700 dark:text-gray-300'}`} title={document.title}>
          {document.title}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{timeAgo(document.updatedAt)}</p>
      </div>
      <div className="hidden shrink-0 items-center group-hover:flex group-focus-within:flex" onClick={(e) => e.stopPropagation()}>
        <button onClick={startEditing} className={action} title="Rename (F2)" aria-label={`Rename ${document.title}`}>
          <Pencil size={13} />
        </button>
        <button onClick={() => onDuplicate(document.id)} className={action} title="Duplicate" aria-label={`Duplicate ${document.title}`}>
          <Copy size={13} />
        </button>
        <button onClick={() => onDelete(document.id)} className={`${action} hover:text-red-600 dark:hover:text-red-400`} title="Delete" aria-label={`Delete ${document.title}`}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
