import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster } from 'react-hot-toast';

import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import Footer from './components/Footer';
import ExportModal from './components/ExportModal';

import { useMarkdown } from './hooks/useMarkdown';
import { useScrollSync } from './hooks/useScrollSync';
import { useFocusMode } from './hooks/useFocusMode';
import { countWords, countChars, countCharsNoSpace } from './utils/wordCount';

export default function App() {
  const { content, setContent } = useMarkdown();
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    return localStorage.getItem('mde_v11_preview') !== 'false';
  });
  
  const previewRef = useRef(null); // Reference to the actual markdown root for PDF
  const previewScrollContainerRef = useRef(null); // Reference to the container handling overflow
  const editorRef = useRef(null);

  const { syncEnabled, toggleSync } = useScrollSync(previewScrollContainerRef);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dark Mode State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('mde_v11_preview', isPreviewVisible.toString());
  }, [isPreviewVisible]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const handleInsert = useCallback((text, selectionOffset = 0) => {
    setContent((prev) => prev + text);
  }, [setContent]);


  // Calculate stats
  const words = countWords(content);
  const chars = countChars(content);
  const charsNoSpace = countCharsNoSpace(content);

  return (
    <div className={`flex flex-col h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors font-sans overflow-hidden`}>
      <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        getPreviewRef={() => previewRef.current}
      />

      {/* Header - Only visible when NOT in focus mode */}
      <div className={`transition-all duration-300 ease-in-out origin-top ${isFocusMode ? 'h-0 opacity-0 overflow-hidden' : 'h-16 opacity-100 shrink-0'}`}>
        <header className="flex h-full items-center justify-between px-4 bg-white dark:bg-dark-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700 w-full gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              M
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 hidden sm:block">
              Markdown Editor
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isFocusMode ? 'h-0 opacity-0 overflow-hidden shrink-0' : 'h-auto opacity-100 shrink-0'}`}>
         <Toolbar 
           onInsert={handleInsert} 
           isFocusMode={isFocusMode} 
           toggleFocusMode={toggleFocusMode}
           isPreviewVisible={isPreviewVisible}
           togglePreview={() => setIsPreviewVisible(!isPreviewVisible)}
         />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden flex relative">
        {/* ESC hint for Focus Mode */}
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-50 pointer-events-none transition-opacity duration-300 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
          Press ESC to exit focus mode
        </div>

        <PanelGroup direction="horizontal" autoSaveId="mde_v11_panels">
          {/* Editor Panel */}
          <Panel id="editor-panel" minSize={20} collapsible={isPreviewVisible} order={1}>
            <div className="h-full border-r border-gray-200 dark:border-gray-700 flex flex-col relative w-full overflow-hidden">
              <Editor value={content} onChange={setContent} isDark={isDark} ref={editorRef} />
            </div>
          </Panel>

          {isPreviewVisible && (
            <>
              <PanelResizeHandle className="w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 active:bg-blue-500 transition-colors cursor-col-resize z-20 flex items-center justify-center">
                 <div className="h-6 flex flex-col justify-center space-y-0.5">
                   <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                   <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                   <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                 </div>
              </PanelResizeHandle>

              <Panel id="preview-panel" minSize={20} order={2}>
                <div 
                  ref={previewScrollContainerRef}
                  className="h-full bg-white dark:bg-dark-900 relative w-full overflow-y-auto flex flex-col px-6 sm:px-10 py-8 scroll-smooth"
                >
                  <div className="w-full max-w-4xl mx-auto pb-16">
                    <Preview content={content} ref={previewRef} />
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </main>

      {/* Footer - Only visible when NOT in focus mode */}
      <div className={`transition-all duration-300 ease-in-out origin-bottom ${isFocusMode ? 'h-0 opacity-0 overflow-hidden shrink-0' : 'h-10 opacity-100 shrink-0'}`}>
        <Footer 
          words={words} 
          chars={chars} 
          charsNoSpace={charsNoSpace} 
          syncEnabled={syncEnabled} 
          toggleSync={toggleSync}
          onExportModal={() => setIsExportModalOpen(true)}
        />
      </div>
    </div>
  );
}
