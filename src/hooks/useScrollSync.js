import { useState, useEffect, useRef } from 'react';

export function useScrollSync(previewContainerRef) {
  const [syncEnabled, setSyncEnabled] = useState(() => {
    const saved = localStorage.getItem('mde_v11_sync');
    return saved !== null ? saved === 'true' : true;
  });

  const isSyncing = useRef(false);

  useEffect(() => {
    localStorage.setItem('mde_v11_sync', syncEnabled.toString());
  }, [syncEnabled]);

  const toggleSync = () => setSyncEnabled((prev) => !prev);

  useEffect(() => {
    if (!syncEnabled) return;

    let rafId;
    const handleEditorScroll = (e) => {
      if (!previewContainerRef.current) return;
      if (isSyncing.current) return;
      
      const scroller = e.target;
      // Make sure we only react to the CodeMirror scroller
      if (!scroller.classList.contains('cm-scroller')) return;

      const editorScrollRatio = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight);
      
      const previewEl = previewContainerRef.current;
      const previewScrollHeight = previewEl.scrollHeight - previewEl.clientHeight;

      rafId = requestAnimationFrame(() => {
        isSyncing.current = true;
        previewEl.scrollTop = editorScrollRatio * previewScrollHeight;
        setTimeout(() => {
          isSyncing.current = false;
        }, 50);
      });
    };

    // Use event delegation on document or wrapper since cm-scroller might be unmounted/remounted
    document.addEventListener('scroll', handleEditorScroll, true);

    return () => {
      document.removeEventListener('scroll', handleEditorScroll, true);
      cancelAnimationFrame(rafId);
    };
  }, [syncEnabled, previewContainerRef]);

  return { syncEnabled, toggleSync };
}
