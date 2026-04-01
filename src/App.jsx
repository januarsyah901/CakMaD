import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import ExportButton from './components/ExportButton';
import { useMarkdown } from './hooks/useMarkdown';

export default function App() {
  const { content, setContent } = useMarkdown();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const previewRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleInsert = useCallback((text, selectionOffset = 0) => {
    // Basic insert (it pushes to end if we don't have cursor pos handled manually)
    // For a complex editor, we'd manipulate the CodeMirror view state.
    // For this boilerplate, we append at the end to keep it simple, 
    // but typically you use a CodeMirror ref snippet insertion.
    setContent((prev) => prev + text);
  }, [setContent]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors font-sans">
      {/* Header / Toolbar Section */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white dark:bg-dark-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700 w-full shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 hidden sm:block">
            Markdown Editor
          </h1>
        </div>

        <div className="flex-1 w-full max-w-sm sm:max-w-none px-4 sm:px-0 flex justify-center sm:justify-start">
          <Toolbar onInsert={handleInsert} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {wordCount} words
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <ExportButton getPreviewRef={() => previewRef.current} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Editor Panel */}
        <div className="h-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col relative w-full overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white/80 dark:bg-dark-900/80 rounded-bl-lg shadow-sm backdrop-blur-sm z-10 md:hidden pointer-events-none">
            Editor
          </div>
          <Editor value={content} onChange={setContent} isDark={isDark} />
        </div>

        {/* Preview Panel */}
        <div className="h-full bg-gray-50 dark:bg-[#1e1e1e] relative w-full overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 p-2 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white/80 dark:bg-[#1e1e1e]/80 rounded-bl-lg shadow-sm backdrop-blur-sm z-10 pointer-events-none">
            Preview
          </div>
          
          <div className="w-full max-w-3xl h-full pb-16">
            <Preview content={content} ref={previewRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
