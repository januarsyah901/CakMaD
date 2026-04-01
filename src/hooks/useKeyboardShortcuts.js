import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useKeyboardShortcuts({
  onSave, onToggleFocus, onTogglePreview, onExport, isFocusMode
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) onSave();
        toast.success("Saved ✓");
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (onToggleFocus) onToggleFocus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (onTogglePreview) onTogglePreview();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (onExport) onExport();
      }
      if (e.key === 'Escape' && isFocusMode) {
        if (onToggleFocus) onToggleFocus(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onToggleFocus, onTogglePreview, onExport, isFocusMode]);
}
