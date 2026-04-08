import React, { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

export default function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onNewTab, onReorder }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Create a ghost image if needed, but default is fine
    // e.dataTransfer.setDragImage(e.target, 0, 0);
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
    <div className="flex items-end h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1e1e1e] overflow-x-auto w-full no-scrollbar relative shrink-0">
      <div className="flex h-[36px] min-w-max mt-auto items-end space-x-0.5 px-0.5 relative z-10 w-full">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={tab.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => onTabClick(tab.id)}
              className={`
                group flex items-center h-full px-3 py-1 text-sm border-t border-l border-r rounded-t-lg
                cursor-pointer transition-all duration-150 relative min-w-32 max-w-48
                ${isActive 
                  ? 'bg-white dark:bg-dark-900 border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 font-medium z-10 shadow-[0_-2px_0_0_#3b82f6] shadow-[0_1px_0_0_white] dark:shadow-[0_1px_0_0_#111827]' 
                  : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2d2d2d] hover:text-gray-900 dark:hover:text-gray-200 -mb-[1px]'}
                ${isDragging ? 'opacity-40 grayscale scale-95' : 'opacity-100'}
                ${isDragOver ? 'border-r-2 border-r-blue-500 z-20' : ''}
              `}
            >
              <div 
                className={`w-2 h-2 rounded-full mr-2 shrink-0 ${isActive ? 'bg-blue-500' : 'bg-transparent'}`} 
              />
              <span className="truncate flex-1 select-none" title={tab.title}>
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={`
                  ml-2 p-1 rounded-md shrink-0 transition-colors
                  ${isActive ? 'opacity-100 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800' : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-300 dark:hover:bg-[#404040]'}
                `}
                title="Close Tab"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        
        <button
          onClick={onNewTab}
          className="ml-2 mb-[3px] p-1.5 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2d2d2d] transition"
          title="New Document"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
