import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun, Menu, FileQuestion } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster, toast } from 'react-hot-toast';

import Editor from './components/Editor';
import Preview from './components/Preview';
import Toolbar from './components/Toolbar';
import Footer from './components/Footer';
import ExportModal from './components/ExportModal';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import DropZone from './components/DropZone';
import TableEditorModal from './components/TableEditorModal';
import CustomCssPanel from './components/CustomCssPanel';
import TemplateModal from './components/TemplateModal';
import ConfirmModal from './components/ConfirmModal';

import { useFileManager } from './hooks/useFileManager';
import { useScrollSync } from './hooks/useScrollSync';
import { useFocusMode } from './hooks/useFocusMode';
import { countWords, countChars, countCharsNoSpace } from './utils/wordCount';
import { saveAsMd } from './utils/exportMd';
import { readMdFile } from './utils/importMd';
import { imageToBase64 } from './utils/imageToBase64';

export default function App() {
  const {
    documents, activeDocId, activeTabIds, activeDoc, activeContent,
    updateContent, createDocument, openDocument, closeTab, deleteDocument, renameDocument,
    reorderTabs, reorderDocuments
  } = useFileManager();

  const { isFocusMode, toggleFocusMode } = useFocusMode();
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    return localStorage.getItem('mde_v11_preview') !== 'false';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('mde_v12_sidebar') !== 'false';
  });
  
  const previewRef = useRef(null);
  const previewScrollContainerRef = useRef(null);
  const editorRef = useRef(null);

  const { syncEnabled, toggleSync } = useScrollSync(previewScrollContainerRef);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCustomCssOpen, setIsCustomCssOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ 
    isOpen: false, title: '', message: '', type: 'warning', onConfirm: null, confirmText: 'Confirm' 
  });

  const showConfirm = (title, message, onConfirm, type = 'warning', confirmText = 'Confirm') => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm, type, confirmText });
  };

  // v1.3 Persistent States
  const [selectedFont, setSelectedFont] = useState(() => {
    return localStorage.getItem('md-editor-font') || 'sans-serif';
  });

  const [isLineWrapping, setIsLineWrapping] = useState(() => {
    return localStorage.getItem('md-editor-line-wrapping') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('md-editor-line-wrapping', isLineWrapping.toString());
  }, [isLineWrapping]);

  useEffect(() => {
    localStorage.setItem('md-editor-font', selectedFont);
  }, [selectedFont]);

  const customCss = activeDoc?.customCss || '';
  const setCustomCss = (newCss) => {
    if (activeDoc) {
      updateContent(activeContent, { customCss: newCss });
    }
  };

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

  useEffect(() => {
    localStorage.setItem('mde_v12_sidebar', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const toggleDarkMode = () => setIsDark(!isDark);


  const handleInsert = useCallback((text) => {
    if (editorRef.current?.insertText) {
      editorRef.current.insertText(text);
    } else {
      // Fallback
      updateContent(activeContent + text);
    }
  }, [activeContent, updateContent, editorRef]);

  const handleImageUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large! Max 2MB allowed.");
      return;
    }
    
    try {
      const base64 = await imageToBase64(file);
      const imgTag = `\n![${file.name}](${base64})\n`;
      handleInsert(imgTag);
      toast.success("Image added ✓");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        handleImageUpload(file);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    });
  };

  const handleDropFile = async (file) => {
    try {
      const content = await readMdFile(file);
      const title = file.name.replace(/\.md$/i, '');
      createDocument(title, content);
      toast.success("Document loaded ✓");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load document");
    }
  };

  const handleSaveMd = () => {
    if (activeDoc) {
      saveAsMd(activeContent, activeDoc.title);
      toast.success("File saved ✓");
    }
  };

  // Keyboard shortcut system
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Exit Focus Mode with ESC
      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault();
        toggleFocusMode(false);
      }

      // Cmd/Ctrl + S to Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveMd();
      }

      // Cmd/Ctrl + E to Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
      }

      // Cmd/Ctrl + Alt + N for New Template
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
        e.preventDefault();
        setIsTemplateModalOpen(true);
      }

      // Cmd/Ctrl + Shift + F for Focus Mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, toggleFocusMode, handleSaveMd]);

  const activeTabs = activeTabIds.map(id => documents.find(d => d.id === id)).filter(Boolean);

  const words = countWords(activeContent);
  const chars = countChars(activeContent);
  const charsNoSpace = countCharsNoSpace(activeContent);

  const handleDeleteDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    showConfirm(
      "Hapus Dokumen?",
      `Apakah Anda yakin ingin menghapus "${doc.title}"? Tindakan ini tidak bisa dibatalkan.`,
      () => {
        deleteDocument(id);
        toast.success("Dokumen dihapus ✓");
      },
      "error",
      "Hapus"
    );
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors font-sans overflow-hidden`}>
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        getPreviewRef={() => previewRef.current}
        selectedFont={selectedFont}
        customCss={customCss}
      />

      <TableEditorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsert={handleInsert}
      />

      <CustomCssPanel
        isOpen={isCustomCssOpen}
        onClose={() => setIsCustomCssOpen(false)}
        css={customCss}
        onCssChange={setCustomCss}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={(template) => createDocument(template.label || 'Untitled', template.content)}
      />

      <ConfirmModal 
        {...confirmConfig} 
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* Header - Only visible when NOT in focus mode */}
      <div className={`transition-all duration-300 ease-in-out origin-top ${isFocusMode ? 'h-0 opacity-0 overflow-hidden' : 'h-16 opacity-100 shrink-0'}`}>
        <header className="flex h-full items-center justify-between px-4 bg-white dark:bg-dark-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700 w-full gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <img 
              src="/icon.svg" 
              alt="Cak MaD Logo" 
              className="w-10 h-10 rounded-lg shadow-sm" 
            />
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 hidden sm:block">
              Cak MaD
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

      {/* App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isVisible={isSidebarOpen && !isFocusMode}
          documents={documents}
          activeDocId={activeDocId}
          onCreate={(title) => createDocument(title, '')}
          onOpen={openDocument}
          onRename={renameDocument}
          onDelete={handleDeleteDocument}
          onReorder={reorderDocuments}
        />

        {/* Main Editor Area */}
        <DropZone onDrop={handleDropFile}>
          <div className="flex-1 flex flex-col h-full w-full overflow-hidden min-w-0">
            {activeTabs.length > 0 && !isFocusMode && (
              <TabBar 
                tabs={activeTabs}
                activeTabId={activeDocId}
                onTabClick={openDocument}
                onTabClose={closeTab}
                onNewTab={() => createDocument('Untitled', '')}
                onReorder={reorderTabs}
              />
            )}

            {activeTabs.length > 0 ? (
              <>
                <div className={`transition-all duration-300 ease-in-out ${isFocusMode ? 'h-0 opacity-0 overflow-hidden shrink-0' : 'h-auto opacity-100 shrink-0'}`}>
                   <Toolbar 
                    onInsert={handleInsert} 
                    isFocusMode={isFocusMode} 
                    toggleFocusMode={toggleFocusMode}
                    isPreviewVisible={isPreviewVisible}
                    togglePreview={() => setIsPreviewVisible(!isPreviewVisible)}
                    onOpenTableModal={() => setIsTableModalOpen(true)}
                    selectedFont={selectedFont}
                    onFontChange={setSelectedFont}
                    isLineWrapping={isLineWrapping}
                    toggleLineWrapping={() => setIsLineWrapping(!isLineWrapping)}
                  />
                </div>

                <main className="flex-1 w-full overflow-hidden flex relative">
                  <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-50 pointer-events-none transition-opacity duration-300 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
                    Press ESC to exit focus mode
                  </div>

                  <PanelGroup direction="horizontal" autoSaveId="mde_v11_panels">
                    <Panel id="editor-panel" minSize={20} collapsible={isPreviewVisible} order={1}>
                       <div 
                          className="h-full border-r border-gray-200 dark:border-gray-700 flex flex-col relative w-full overflow-hidden"
                          onPaste={handlePaste}
                          onDrop={handleDrop}
                        >
                          <Editor 
                            value={activeContent} 
                            onChange={(val) => updateContent(val)} 
                            isDark={isDark} 
                            ref={editorRef} 
                            lineWrapping={isLineWrapping}
                          />
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
                               <Preview 
                                content={activeContent} 
                                ref={previewRef} 
                                selectedFont={selectedFont}
                                customCss={customCss}
                               />
                             </div>
                          </div>
                        </Panel>
                      </>
                    )}
                  </PanelGroup>
                </main>

                <div className={`transition-all duration-300 ease-in-out origin-bottom ${isFocusMode ? 'h-0 opacity-0 overflow-hidden shrink-0' : 'h-10 opacity-100 shrink-0'}`}>
                  <Footer 
                    words={words} 
                    chars={chars} 
                    charsNoSpace={charsNoSpace} 
                     syncEnabled={syncEnabled} 
                    toggleSync={toggleSync}
                    onExportModal={() => setIsExportModalOpen(true)}
                    onSaveMd={handleSaveMd}
                    onOpenMd={handleDropFile}
                    onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
                    onToggleCustomCss={() => setIsCustomCssOpen(!isCustomCssOpen)}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <FileQuestion size={48} className="mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No Document Open</h2>
                <p className="mb-6">Select a document from the sidebar or create a new one.</p>
                 <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Create New Document
                </button>
              </div>
            )}
          </div>
        </DropZone>
      </div>
    </div>
  );
}
