import React, { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

export default function FileItem({ document, isActive, onClick, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(document.title);

  const handleRenameSubmit = () => {
    if (editTitle.trim()) {
      onRename(document.id, editTitle.trim());
    } else {
      setEditTitle(document.title);
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
        isActive 
          ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-800 dark:text-brand-300 border-l-2 border-brand-500 font-medium' 
          : 'hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 border-l-2 border-transparent'
      }`}
      onClick={() => { if (!isEditing) onClick(); }}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') {
                setEditTitle(document.title);
                setIsEditing(false);
              }
            }}
            className="flex-1 min-w-0 bg-white dark:bg-dark-900 border border-brand-500 text-sm px-1.5 py-0.5 rounded outline-none text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <button onClick={handleRenameSubmit} className="p-1 hover:text-green-600 transition-colors">
            <Check size={14} />
          </button>
          <button onClick={() => { setEditTitle(document.title); setIsEditing(false); }} className="p-1 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <span className="truncate flex-1 text-sm font-medium mr-2" title={document.title}>
            {document.title}
          </span>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1" onClick={e => e.stopPropagation()}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
              title="Rename"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(document.id); }}
              className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
