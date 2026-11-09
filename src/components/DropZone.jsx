import { useRef, useState } from 'react';

const isMarkdown = (file) => /\.(md|markdown|txt)$/i.test(file.name) || file.type === 'text/markdown' || file.type === 'text/plain';

/** Drop a .md file anywhere to open it; drop an image to embed it in the current document. */
export default function DropZone({ onOpenFile, onImage, onReject, canInsertImage, children }) {
  const [isDragOver, setIsDragOver] = useState(false);
  // dragenter/leave fire for every child element; count them to avoid flicker.
  const depth = useRef(0);

  const hasFiles = (e) => e.dataTransfer?.types?.includes('Files');

  return (
    <div
      className="relative flex h-full w-full flex-1 overflow-hidden"
      onDragEnter={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        depth.current += 1;
        setIsDragOver(true);
      }}
      onDragOver={(e) => { if (hasFiles(e)) e.preventDefault(); }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setIsDragOver(false);
      }}
      onDrop={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        depth.current = 0;
        setIsDragOver(false);
        for (const file of Array.from(e.dataTransfer.files)) {
          if (file.type.startsWith('image/') && canInsertImage) onImage(file);
          else if (isMarkdown(file)) onOpenFile(file);
          else onReject(file);
        }
      }}
    >
      {isDragOver && (
        <div className="pointer-events-none absolute inset-2 z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-brand-500 bg-white/80 dark:bg-dark-900/80">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Drop a .md file to open it{canInsertImage ? ', or an image to insert it' : ''}
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
