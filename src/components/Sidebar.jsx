import React, { useState } from 'react';
import FileItem from './FileItem';
import { PlusCircle } from 'lucide-react';

export default function Sidebar({ documents, activeDocId, onCreate, onOpen, onRename, onDelete, onReorder, isVisible }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  if (!isVisible) return null;

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900 flex flex-col h-full overflow-hidden transition-all duration-300">
      <div className="p-3 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 font-bold mb-1">
          <span className="text-sm uppercase tracking-wider">Explorer</span>
          <button 
            onClick={() => onCreate('Untitled')}
            className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300"
            title="New Document"
          >
            <PlusCircle size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                transition-all duration-150 relative
                ${draggedIndex === index ? 'opacity-40 grayscale scale-95' : 'opacity-100'}
                ${dragOverIndex === index ? 'border-b-2 border-b-blue-500' : ''}
              `}
            >
              <FileItem
                document={doc}
                isActive={doc.id === activeDocId}
                onClick={() => onOpen(doc.id)}
                onRename={(id, newTitle) => onRename(id, newTitle)}
                onDelete={onDelete}
              />
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center p-4 text-gray-500 text-sm">
              No files yet.<br />Click the + icon to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
