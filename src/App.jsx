import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun, Menu, HelpCircle, ArrowLeft } from 'lucide-react';
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
import LandingPage from './components/LandingPage';
import OnboardingModal from './components/OnboardingModal';
import EmptyStateGuidance from './components/EmptyStateGuidance';

import { useFileManager } from './hooks/useFileManager';
import { useScrollSync } from './hooks/useScrollSync';
import { useFocusMode } from './hooks/useFocusMode';
import { countWords, countChars, countCharsNoSpace } from './utils/wordCount';
import { saveAsMd } from './utils/exportMd';
import { readMdFile } from './utils/importMd';
import { imageToBase64 } from './utils/imageToBase64';
import { analytics } from './utils/analytics';
import { templates } from './data/templates';

const ONBOARDING_KEY = 'cakmad_onboarded_v1';
const HAS_ENTERED_EDITOR_KEY = 'cakmad_entered_editor';

export default function App() {
  const {
    documents, activeDocId, activeTabIds, activeDoc, activeContent,
    updateContent, createDocument, openDocument, closeTab, deleteDocument, renameDocument,
    reorderTabs, reorderDocuments
  } = useFileManager();

  const { isFocusMode, toggleFocusMode } = useFocusMode();
  
  // Landing page state
  const [showLanding, setShowLanding] = useState(() => {
    // Show landing page if user hasn't actively entered editor before
    return localStorage.getItem(HAS_ENTERED_EDITOR_KEY) !== 'true';
  });

  // Onboarding modal state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Show onboarding only once upon entering editor
    if (!showLanding) {
      const hasOnboarded = localStorage.getItem(ONBOARDING_KEY) === 'true';
      if (!hasOnboarded) {
        setIsOnboardingOpen(true);
      }
    }
  }, [showLanding]);

  const [isPreviewVisible, setIsPreviewVisible] = useState(() => {
    return localStorage.getItem('mde_v11_preview') !== 'false';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('mde_v12_sidebar') !== 'false';
  });

  // Mobile segmented view mode: 'split' | 'editor' | 'preview'
  const [mobileViewMode, setMobileViewMode] = useState('editor');
  
  const previewRef = useRef(null);
  const previewScrollContainerRef = useRef(null);
  const editorRef = useRef(null);

  const { syncEnabled, toggleSync } = useScrollSync(previewScrollContainerRef);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCustomCssOpen, setIsCustomCssOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when switching documents or creating new ones
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [activeDocId, isMobile]);

  const [confirmConfig, setConfirmConfig] = useState({ 
    isOpen: false, title: '', message: '', type: 'warning', onConfirm: null, confirmText: 'Confirm' 
  });

  const showConfirm = (title, message, onConfirm, type = 'warning', confirmText = 'Confirm') => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm, type, confirmText });
  };

  // Persistent font & wrapping
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
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('mde_v11_preview', isPreviewVisible.toString());
  }, [isPreviewVisible]);

  useEffect(() => {
    localStorage.setItem('mde_v12_sidebar', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const handleInsert = useCallback((text, selectionOffset = 0) => {
    if (editorRef.current?.insertText) {
      editorRef.current.insertText(text, selectionOffset);
    } else {
      updateContent(activeContent + text);
    }
  }, [activeContent, updateContent]);

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
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) handleImageUpload(file);
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
      analytics.track('Document Created', { source: 'file_import', title });
      toast.success("Document loaded ✓");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load document");
    }
  };

  const handleSaveMd = () => {
    if (activeDoc) {
      analytics.track('Export Started', { format: 'markdown' });
      saveAsMd(activeContent, activeDoc.title);
      toast.success("File saved ✓");
      window.open('https://saweria.co/januarsyah', '_blank', 'noopener,noreferrer');
    }
  };

  // Keyboard shortcut system
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showLanding) return;

      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault();
        toggleFocusMode(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveMd();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
      }

      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
        e.preventDefault();
        setIsTemplateModalOpen(true);
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLanding, isFocusMode, toggleFocusMode, handleSaveMd]);

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

  const enterEditor = (loadTemplate = null) => {
    localStorage.setItem(HAS_ENTERED_EDITOR_KEY, 'true');
    setShowLanding(false);
    if (loadTemplate) {
      createDocument(loadTemplate.label, loadTemplate.content);
    }
  };

  // Render Landing Page if visitor hasn't stepped into editor yet
  if (showLanding) {
    return (
      <LandingPage
        onStartWriting={() => enterEditor()}
        onViewExample={() => {
          const reportTemplate = templates.find(t => t.id === 'ai-report') || templates[0];
          enterEditor(reportTemplate);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors font-sans overflow-hidden">
      <Toaster position="bottom-right" />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          localStorage.setItem(ONBOARDING_KEY, 'true');
          setIsOnboardingOpen(false);
        }}
      />

      {/* Export Dialog */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        getPreviewRef={() => previewRef.current}
        selectedFont={selectedFont}
        customCss={customCss}
      />

      {/* Table Editor Dialog */}
      <TableEditorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsert={handleInsert}
      />

      {/* Custom CSS Ingestion Panel */}
      <CustomCssPanel
        isOpen={isCustomCssOpen}
        onClose={() => setIsCustomCssOpen(false)}
        css={customCss}
        onCssChange={setCustomCss}
      />

      {/* Template Discovery Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={(template) => {
          createDocument(template.label || 'Untitled', template.content);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal 
        {...confirmConfig} 
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* Top Header */}
      <div className={`transition-all duration-300 ease-in-out origin-top ${isFocusMode ? 'h-0 opacity-0 overflow-hidden' : 'h-16 opacity-100 shrink-0'}`}>
        <header className="flex h-full items-center justify-between px-3 sm:px-4 bg-white dark:bg-dark-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700 w-full gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition"
              title="Toggle Document Sidebar"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-2 hover:opacity-80 transition text-left"
              title="Return to Product Overview"
            >
              <img 
                src="/icon.svg" 
                alt="Cak MaD Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shadow-sm" 
              />
              <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100 hidden sm:block">
                Cak MaD
              </span>
            </button>
          </div>

          {/* Center Mobile Segmented Toggle (Visible only on mobile screens) */}
          {isMobile && activeTabs.length > 0 && (
            <div className="flex bg-gray-100 dark:bg-dark-700 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setMobileViewMode('editor')}
                className={`px-3 py-1.5 rounded-md transition ${mobileViewMode === 'editor' ? 'bg-white dark:bg-dark-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setMobileViewMode('preview')}
                className={`px-3 py-1.5 rounded-md transition ${mobileViewMode === 'preview' ? 'bg-white dark:bg-dark-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Preview
              </button>
            </div>
          )}

          {/* Right Header Utilities */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition"
              title="Tutorial & Workflow Guide"
            >
              <HelpCircle size={19} />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isVisible={isSidebarOpen && !isFocusMode}
          documents={documents}
          activeDocId={activeDocId}
          onCreate={(title) => {
            analytics.track('Document Created', { source: 'sidebar_create' });
            createDocument(title, '');
          }}
          onOpen={openDocument}
          onRename={renameDocument}
          onDelete={handleDeleteDocument}
          onReorder={reorderDocuments}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Backdrop Overlay on Mobile */}
        {isMobile && isSidebarOpen && !isFocusMode && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Drop Zone Layer */}
        <DropZone onDrop={handleDropFile}>
          <div className="flex-1 flex flex-col h-full w-full overflow-hidden min-w-0">
            {activeTabs.length > 0 && !isFocusMode && (
              <TabBar 
                tabs={activeTabs}
                activeTabId={activeDocId}
                onTabClick={openDocument}
                onTabClose={closeTab}
                onNewTab={() => {
                  analytics.track('Document Created', { source: 'tab_bar_new' });
                  createDocument('Untitled', '');
                }}
                onReorder={reorderTabs}
              />
            )}

            {activeTabs.length > 0 ? (
              <>
                {/* Editor Toolbar */}
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

                {/* Split Resizable Workshop */}
                <main className="flex-1 w-full overflow-hidden flex relative">
                  <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-50 pointer-events-none transition-opacity duration-300 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
                    Press ESC to exit focus mode
                  </div>

                  {/* Desktop Resizable View */}
                  {!isMobile ? (
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
                          <PanelResizeHandle className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-brand-400 dark:hover:bg-brand-500 active:bg-brand-600 transition-colors z-20 flex items-center justify-center">
                            <div className="h-6 flex-col space-y-0.5 flex justify-center">
                              <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                              <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                              <div className="w-0.5 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                            </div>
                          </PanelResizeHandle>

                          <Panel id="preview-panel" minSize={20} order={2}>
                            <div 
                              ref={previewScrollContainerRef}
                              className="h-full bg-white dark:bg-dark-900 relative w-full overflow-y-auto flex flex-col px-4 sm:px-10 py-6 sm:py-8 scroll-smooth"
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
                  ) : (
                    /* Mobile Screen View: Single Panel Switching for Touch ergonomics */
                    <div className="h-full w-full overflow-hidden flex flex-col">
                      {mobileViewMode === 'editor' ? (
                        <div 
                          className="h-full w-full overflow-hidden flex flex-col relative"
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
                      ) : (
                        <div 
                          ref={previewScrollContainerRef}
                          className="h-full w-full bg-white dark:bg-dark-900 overflow-y-auto px-4 py-6 scroll-smooth"
                        >
                          <div className="w-full mx-auto pb-16">
                            <Preview 
                              content={activeContent} 
                              ref={previewRef} 
                              selectedFont={selectedFont}
                              customCss={customCss}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </main>

                {/* Footer Status Bar */}
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
              /* Guided Empty State when no document tab is currently opened */
              <EmptyStateGuidance
                onCreateDoc={(title, content) => createDocument(title, content)}
                onImportFile={handleDropFile}
              />
            )}
          </div>
        </DropZone>
      </div>
    </div>
  );
}
