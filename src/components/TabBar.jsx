import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onNewTab, onReorder }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const resetDrag = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex h-9 w-full shrink-0 items-stretch overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-900" role="tablist" aria-label="Open documents">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            draggable
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
            onClick={() => onTabClick(tab.id)}
            // Middle click closes, like a browser tab.
            onAuxClick={(e) => { if (e.button === 1) { e.preventDefault(); onTabClose(tab.id); } }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const next = tabs[(index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
                onTabClick(next.id);
              }
            }}
            title={tab.title}
            className={`group relative flex min-w-[7rem] max-w-[12rem] cursor-pointer select-none items-center gap-1 border-r border-gray-200 dark:border-gray-700 pl-3 pr-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 ${
              isActive
                ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-white dark:after:bg-dark-800 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-brand-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800/60 hover:text-gray-900 dark:hover:text-gray-200'
            } ${draggedIndex === index ? 'opacity-40' : ''} ${dragOverIndex === index ? 'shadow-[inset_-2px_0_0_theme(colors.brand.500)]' : ''}`}
          >
            <span className="flex-1 truncate">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
              className={`shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-dark-700 dark:hover:text-gray-100 ${isActive ? '' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
              aria-label={`Close ${tab.title}`}
              title="Close (middle-click)"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <button
        onClick={onNewTab}
        className="flex shrink-0 items-center px-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-dark-800 dark:hover:text-gray-100"
        title="New document"
        aria-label="New document"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
