import React from 'react';

export default function DropZone({ onDrop, children }) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.md') || file.type === 'text/markdown' || file.type === 'text/plain') {
        onDrop(file);
      }
    }
  };

  return (
    <div 
      className="relative flex-1 flex h-full w-full overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 z-50 flex items-center justify-center border-4 border-blue-500 border-dashed m-2 rounded-lg pointer-events-none transition-all">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 rounded-xl shadow-2xl text-lg font-medium text-blue-600 dark:text-blue-400">
            Drop .md file to open
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
