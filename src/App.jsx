import { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun, PanelLeft, Keyboard, Download, FileDown, Minimize2 } from 'lucide-react';
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
import ShortcutsModal from './components/ShortcutsModal';
import EmptyStateGuidance from './components/EmptyStateGuidance';
import { btn } from './components/ui/styles';

import { useFileManager } from './hooks/useFileManager';
import { useScrollSync } from './hooks/useScrollSync';
import { useFocusMode } from './hooks/useFocusMode';
import { countWords, countChars } from './utils/wordCount';
import { saveAsMd } from './utils/exportMd';
import { readMdFile } from './utils/importMd';
import { imageToBase64 } from './utils/imageToBase64';
import { analytics } from './utils/analytics';
import { templates } from './data/templates';

const ONBOARDING_KEY = 'cakmad_onboarded_v1';
const HAS_ENTERED_EDITOR_KEY = 'cakmad_entered_editor';
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const stored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
};

const titleFromFile = (name) => name.replace(/\.(md|markdown|txt)$/i, '') || 'Untitled';

export default function App() {
  const {
    documents, activeDocId, activeTabIds, activeDoc, activeContent,
    updateContent, createDocument, openDocument, closeTab, deleteDocument, renameDocument,
    reorderTabs, reorderDocuments, duplicateDocument, storageError,
  } = useFileManager();

  const { isFocusMode, toggleFocusMode } = useFocusMode();

  const [showLanding, setShowLanding] = useState(() => stored(HAS_ENTERED_EDITOR_KEY, 'false') !== 'true');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(
    () => stored(HAS_ENTERED_EDITOR_KEY, 'false') === 'true' && stored(ONBOARDING_KEY, 'false') !== 'true'
  );
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCustomCssOpen, setIsCustomCssOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false });

  const [isPreviewVisible, setIsPreviewVisible] = useState(() => stored('mde_v11_preview', 'true') !== 'false');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024 && stored('mde_v12_sidebar', 'true') !== 'false');
  const [mobileViewMode, setMobileViewMode] = useState('editor');
  const [selectedFont, setSelectedFont] = useState(() => stored('md-editor-font', 'sans-serif'));
  const [isLineWrapping, setIsLineWrapping] = useState(() => stored('md-editor-line-wrapping', 'true') !== 'false');
  const [isDark, setIsDark] = useState(() => {
    const theme = stored('theme', null);
    return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  const previewScrollContainerRef = useRef(null);
  const editorRef = useRef(null);
  const openFileInputRef = useRef(null);

  const { syncEnabled, toggleSync } = useScrollSync(previewScrollContainerRef);

  // ---- persisted preferences -------------------------------------------------
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  useEffect(() => { localStorage.setItem('mde_v11_preview', String(isPreviewVisible)); }, [isPreviewVisible]);
  useEffect(() => { localStorage.setItem('mde_v12_sidebar', String(isSidebarOpen)); }, [isSidebarOpen]);
  useEffect(() => { localStorage.setItem('md-editor-font', selectedFont); }, [selectedFont]);
  useEffect(() => { localStorage.setItem('md-editor-line-wrapping', String(isLineWrapping)); }, [isLineWrapping]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (storageError) {
      toast.error('Browser storage is full, so recent changes are not saved. Remove large images or delete old documents.', { id: 'storage', duration: 8000 });
    }
  }, [storageError]);

  // ---- actions ---------------------------------------------------------------
  const customCss = activeDoc?.customCss || '';
  const setCustomCss = (css) => {
    if (activeDoc) updateContent(activeContent, { customCss: css });
  };

  const runCommand = useCallback((name) => editorRef.current?.run(name), []);

  const handleInsert = useCallback((text) => {
    if (editorRef.current?.insertText) editorRef.current.insertText(text);
    else updateContent(activeContent + text);
  }, [activeContent, updateContent]);

  const handleImageUpload = async (file) => {
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. Images are limited to 2 MB.`);
      return;
    }
    try {
      const base64 = await imageToBase64(file);
      const alt = file.name.replace(/\.[^.]+$/, '') || 'image';
      handleInsert(`\n![${alt}](${base64})\n`);
    } catch (err) {
      console.error(err);
      toast.error(`Could not read ${file.name}.`);
    }
  };

  const handlePaste = (e) => {
    for (const item of e.clipboardData?.items || []) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleImageUpload(file);
        }
      }
    }
  };

  const handleOpenFile = async (file) => {
    try {
      const content = await readMdFile(file);
      createDocument(titleFromFile(file.name), content);
      analytics.track('Document Created', { source: 'file_import' });
      toast.success(`Opened ${file.name}`);
    } catch (err) {
      console.error(err);
      toast.error(`Could not open ${file.name}.`);
    }
  };

  const handleSaveMd = () => {
    if (!activeDoc) return;
    analytics.track('Export Started', { format: 'markdown' });
    saveAsMd(activeContent, activeDoc.title);
    toast.success(`Downloaded ${activeDoc.title}.md`);
  };

  const openExport = () => {
    if (activeDoc) setIsExportModalOpen(true);
  };

  const handleDeleteDocument = (id) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    setConfirmConfig({
      isOpen: true,
      title: `Delete “${doc.title}”?`,
      message: 'The document is removed from this browser. This cannot be undone.',
      confirmText: 'Delete',
      destructive: true,
      onConfirm: () => {
        deleteDocument(id);
        toast.success(`Deleted ${doc.title}`);
      },
    });
  };

  const newBlank = (source) => {
    analytics.track('Document Created', { source });
    createDocument('Untitled', '');
  };

  // On small screens the sidebar is an overlay: close it after picking a document.
  const closeSidebarOnMobile = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  // ---- keyboard shortcuts ----------------------------------------------------
  // Keep the latest handlers in a ref so the listener is registered once.
  const shortcuts = useRef(null);
  const handleShortcut = (e) => {
    if (showLanding) return;
    const mod = e.ctrlKey || e.metaKey;
    // With Shift held e.key is upper-case and Alt changes it on some layouts; match physical keys.
    const code = e.code;

    if (e.key === 'Escape' && isFocusMode) {
      e.preventDefault();
      toggleFocusMode(false);
      return;
    }
    if (!mod) return;

    const actions = {
      KeyS: !e.shiftKey && handleSaveMd,
      KeyE: !e.shiftKey && openExport,
      KeyO: !e.shiftKey && (() => openFileInputRef.current?.click()),
      KeyN: e.altKey && (() => setIsTemplateModalOpen(true)),
      KeyF: e.shiftKey && (() => toggleFocusMode()),
      KeyP: e.shiftKey && (() => setIsPreviewVisible((v) => !v)),
      Slash: () => setIsShortcutsOpen(true),
    };
    const action = actions[code];
    if (action) {
      e.preventDefault();
      // Runs in the capture phase: keep CodeMirror from also handling it (e.g. Ctrl+/ toggles comments).
      e.stopPropagation();
      action();
    }
  };
  useEffect(() => { shortcuts.current = handleShortcut; });
  useEffect(() => {
    const onKey = (e) => shortcuts.current?.(e);
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  // ---- landing ---------------------------------------------------------------
  const enterEditor = (template = null) => {
    localStorage.setItem(HAS_ENTERED_EDITOR_KEY, 'true');
    setShowLanding(false);
    if (localStorage.getItem(ONBOARDING_KEY) !== 'true') setIsOnboardingOpen(true);
    if (template) createDocument(template.label, template.content);
  };

  if (showLanding) {
    return (
      <LandingPage
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        onStartWriting={() => enterEditor()}
        onViewExample={() => enterEditor(templates.find((t) => t.id === 'ai-report'))}
        onStartTemplate={(t) => {
          analytics.track('Template Selected', { templateId: t.id, source: 'landing' });
          enterEditor(t);
        }}
      />
    );
  }

  // ---- editor ----------------------------------------------------------------
  const activeTabs = activeTabIds.map((id) => documents.find((d) => d.id === id)).filter(Boolean);
  const hasDoc = activeTabs.length > 0 && !!activeDoc;

  const editorPane = (
    <div className="relative flex h-full w-full flex-col overflow-hidden" onPaste={handlePaste}>
      <Editor
        value={activeContent}
        onChange={(val) => updateContent(val)}
        isDark={isDark}
        ref={editorRef}
        lineWrapping={isLineWrapping}
      />
    </div>
  );

  const previewPane = (
    <div ref={previewScrollContainerRef} className="h-full w-full overflow-y-auto bg-white dark:bg-dark-800">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 pb-24 sm:px-10">
        <Preview content={activeContent} selectedFont={selectedFont} customCss={customCss} />
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!text-sm !rounded-md !shadow-lg dark:!bg-dark-700 dark:!text-gray-100',
          duration: 3000,
        }}
      />

      <input
        ref={openFileInputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleOpenFile(file);
          e.target.value = '';
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          localStorage.setItem(ONBOARDING_KEY, 'true');
          setIsOnboardingOpen(false);
        }}
      />
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} onShowIntro={() => setIsOnboardingOpen(true)} />
      {isExportModalOpen && <ExportModal
        isOpen
        onClose={() => setIsExportModalOpen(false)}
        content={activeContent}
        docTitle={activeDoc?.title}
        selectedFont={selectedFont}
        customCss={customCss}
      />}
      <TableEditorModal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} onInsert={handleInsert} />
      <CustomCssPanel isOpen={isCustomCssOpen && hasDoc} onClose={() => setIsCustomCssOpen(false)} css={customCss} onCssChange={setCustomCss} />
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={(t) => createDocument(t.label || 'Untitled', t.content)}
      />
      <ConfirmModal {...confirmConfig} onClose={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))} />

      {/* Header */}
      {!isFocusMode && (
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 px-2 sm:px-3">
          <div className="flex min-w-0 items-center gap-1">
            <button
              onClick={() => setIsSidebarOpen((v) => !v)}
              className={btn.icon}
              aria-label={isSidebarOpen ? 'Hide documents' : 'Show documents'}
              aria-pressed={isSidebarOpen}
              title="Documents"
            >
              <PanelLeft size={18} />
            </button>
            <button onClick={() => setShowLanding(true)} className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-dark-700" title="About Cak MaD">
              <img src="/icon.svg" alt="" className="h-6 w-6 rounded" />
              <span className="hidden text-sm font-semibold tracking-tight sm:block">Cak MaD</span>
            </button>
          </div>

          {isMobile && hasDoc && (
            <div className="flex rounded-md bg-gray-100 dark:bg-dark-900 p-0.5 text-sm" role="tablist" aria-label="View">
              {['editor', 'preview'].map((mode) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={mobileViewMode === mode}
                  onClick={() => setMobileViewMode(mode)}
                  className={`min-h-[36px] rounded px-3 capitalize ${mobileViewMode === mode ? 'bg-white dark:bg-dark-700 font-medium shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1">
            <button onClick={() => setIsShortcutsOpen(true)} className={`${btn.icon} hidden sm:inline-flex`} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (Ctrl+/)">
              <Keyboard size={18} />
            </button>
            <button onClick={() => setIsDark((d) => !d)} className={btn.icon} aria-label={isDark ? 'Use light theme' : 'Use dark theme'} title={isDark ? 'Light theme' : 'Dark theme'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {hasDoc && (
              <>
                <button onClick={handleSaveMd} className={`${btn.ghost} hidden md:inline-flex`} title="Download as .md (Ctrl+S)">
                  <FileDown size={16} /> .md
                </button>
                <button onClick={openExport} className={`${btn.primary} ml-1 px-3 py-1.5`} title="Export PDF (Ctrl+E)">
                  <Download size={16} /> <span className="hidden sm:inline">Export PDF</span>
                </button>
              </>
            )}
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isVisible={isSidebarOpen && !isFocusMode}
          documents={documents}
          activeDocId={activeDocId}
          onCreate={() => { newBlank('sidebar_create'); closeSidebarOnMobile(); }}
          onOpen={(id) => { openDocument(id); closeSidebarOnMobile(); }}
          onRename={renameDocument}
          onDelete={handleDeleteDocument}
          onDuplicate={(id) => { duplicateDocument(id); closeSidebarOnMobile(); toast.success('Duplicated'); }}
          onReorder={reorderDocuments}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
        {isMobile && isSidebarOpen && !isFocusMode && (
          <div className="fixed inset-0 z-20 bg-gray-950/40" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
        )}

        <DropZone
          onOpenFile={handleOpenFile}
          onImage={handleImageUpload}
          canInsertImage={hasDoc}
          onReject={(file) => toast.error(`${file.name} isn't a Markdown or image file.`)}
        >
          <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
            {hasDoc && !isFocusMode && (
              <TabBar
                tabs={activeTabs}
                activeTabId={activeDocId}
                onTabClick={openDocument}
                onTabClose={closeTab}
                onNewTab={() => newBlank('tab_bar_new')}
                onReorder={reorderTabs}
              />
            )}

            {hasDoc ? (
              <>
                {!isFocusMode && (!isMobile || mobileViewMode === 'editor') && (
                  <Toolbar
                    onCommand={runCommand}
                    onOpenTableModal={() => setIsTableModalOpen(true)}
                    onImage={handleImageUpload}
                    isFocusMode={isFocusMode}
                    toggleFocusMode={toggleFocusMode}
                    isPreviewVisible={isPreviewVisible}
                    togglePreview={() => setIsPreviewVisible((v) => !v)}
                    selectedFont={selectedFont}
                    onFontChange={setSelectedFont}
                    isLineWrapping={isLineWrapping}
                    toggleLineWrapping={() => setIsLineWrapping((v) => !v)}
                    isMobile={isMobile}
                  />
                )}

                <main className="relative flex w-full flex-1 overflow-hidden">
                  {isFocusMode && (
                    <button
                      onClick={() => toggleFocusMode(false)}
                      className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-md bg-gray-900/70 px-2.5 py-1 text-xs text-white opacity-40 transition-opacity hover:opacity-100 focus:opacity-100"
                    >
                      <Minimize2 size={13} /> Exit focus <span className="text-gray-300">Esc</span>
                    </button>
                  )}

                  {!isMobile ? (
                    <PanelGroup direction="horizontal" autoSaveId="mde_v11_panels">
                      <Panel id="editor-panel" minSize={20} order={1}>
                        {editorPane}
                      </Panel>
                      {isPreviewVisible && (
                        <>
                          <PanelResizeHandle className="group relative w-px bg-gray-200 dark:bg-gray-700 data-[resize-handle-state=hover]:bg-brand-400 data-[resize-handle-state=drag]:bg-brand-500">
                            <span className="absolute inset-y-0 -left-1.5 -right-1.5" />
                          </PanelResizeHandle>
                          <Panel id="preview-panel" minSize={20} order={2}>
                            {previewPane}
                          </Panel>
                        </>
                      )}
                    </PanelGroup>
                  ) : mobileViewMode === 'editor' ? editorPane : previewPane}
                </main>

                {!isFocusMode && (
                  <div className="h-9 shrink-0">
                    <Footer
                      words={countWords(activeContent)}
                      chars={countChars(activeContent)}
                      storageError={storageError}
                      syncEnabled={syncEnabled}
                      toggleSync={toggleSync}
                      showSync={!isMobile && isPreviewVisible}
                      onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
                      onToggleCustomCss={() => setIsCustomCssOpen((v) => !v)}
                      isCustomCssOpen={isCustomCssOpen}
                      hasCustomCss={!!customCss.trim()}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyStateGuidance
                documents={documents}
                onOpenDoc={openDocument}
                onCreateDoc={(title, content) => createDocument(title, content)}
                onImportFile={handleOpenFile}
                onBrowseTemplates={() => setIsTemplateModalOpen(true)}
              />
            )}
          </div>
        </DropZone>
      </div>
    </div>
  );
}
