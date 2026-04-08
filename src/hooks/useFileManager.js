import { useState, useEffect, useCallback } from 'react';
import { createNewDocument, DEFAULT_CONTENT } from '../store/documentStore';
import { useRecentFiles } from './useRecentFiles';

const STORAGE_DOCS_KEY = 'md_editor_documents';
const STORAGE_TABS_KEY = 'md_editor_tabs';

export function useFileManager() {
  const { addRecentFile } = useRecentFiles();

  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOCS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // Setup initial document
    const initDoc = createNewDocument('Untitled', DEFAULT_CONTENT);
    return [initDoc];
  });

  const [tabs, setTabs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TABS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeDocId && parsed.activeTabIds) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return { activeDocId: documents[0].id, activeTabIds: [documents[0].id] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TABS_KEY, JSON.stringify(tabs));
  }, [tabs]);

  const activeDoc = documents.find(d => d.id === tabs.activeDocId);
  const activeContent = activeDoc ? activeDoc.content : '';

  const updateContent = useCallback((content, metadata = {}) => {
    if (!tabs.activeDocId) return;
    setDocuments(prev => prev.map(doc => {
      if (doc.id === tabs.activeDocId) {
        const updatedDoc = { ...doc, content, ...metadata, updatedAt: Date.now() };
        addRecentFile(updatedDoc);
        return updatedDoc;
      }
      return doc;
    }));
  }, [tabs.activeDocId, addRecentFile]);

  const createDocument = useCallback((title = 'Untitled', content = '') => {
    const newDoc = createNewDocument(title, content);
    setDocuments(prev => [...prev, newDoc]);
    setTabs(prev => ({
      activeTabIds: [...prev.activeTabIds, newDoc.id],
      activeDocId: newDoc.id
    }));
    addRecentFile(newDoc);
    return newDoc;
  }, [addRecentFile]);

  const openDocument = useCallback((id) => {
    setTabs(prev => {
      const newTabs = prev.activeTabIds.includes(id) 
        ? prev.activeTabIds 
        : [...prev.activeTabIds, id];
      return { activeTabIds: newTabs, activeDocId: id };
    });
    const doc = documents.find(d => d.id === id);
    if (doc) addRecentFile(doc);
  }, [documents, addRecentFile]);

  const closeTab = useCallback((id) => {
    setTabs(prev => {
      const newTabs = prev.activeTabIds.filter(t => t !== id);
      const newActive = prev.activeDocId === id 
        ? (newTabs.length > 0 ? newTabs[newTabs.length - 1] : null)
        : prev.activeDocId;
      return { activeTabIds: newTabs, activeDocId: newActive };
    });
  }, []);

  const deleteDocument = useCallback((id) => {
    // If it's a tab, close it
    closeTab(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, [closeTab]);

  const renameDocument = useCallback((id, newTitle) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, title: newTitle, updatedAt: Date.now() } : doc
    ));
    const doc = documents.find(d => d.id === id);
    if (doc) addRecentFile({ ...doc, title: newTitle });
  }, [documents, addRecentFile]);

  const reorderTabs = useCallback((startIndex, endIndex) => {
    setTabs(prev => {
      const result = Array.from(prev.activeTabIds);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, activeTabIds: result };
    });
  }, []);

  const reorderDocuments = useCallback((startIndex, endIndex) => {
    setDocuments(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    documents,
    activeDocId: tabs.activeDocId,
    activeTabIds: tabs.activeTabIds,
    activeDoc,
    activeContent,
    updateContent,
    createDocument,
    openDocument,
    closeTab,
    deleteDocument,
    renameDocument,
    reorderTabs,
    reorderDocuments
  };
}
