/**
 * Storage Abstraction Layer (DocumentStorage Interface)
 * Prepares Cak MaD for future cloud database integration without altering editor UI logic.
 */

const STORAGE_DOCS_KEY = 'md_editor_documents';

export class LocalDocumentStorage {
  async getDocuments() {
    try {
      const data = localStorage.getItem(STORAGE_DOCS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('[DocumentStorage] Failed to get documents:', e);
      return [];
    }
  }

  async getDocument(id) {
    const docs = await this.getDocuments();
    return docs.find(doc => doc.id === id) || null;
  }

  async saveDocument(doc) {
    const docs = await this.getDocuments();
    const existingIndex = docs.findIndex(d => d.id === doc.id);
    let updated;
    if (existingIndex >= 0) {
      docs[existingIndex] = { ...docs[existingIndex], ...doc, updatedAt: Date.now() };
      updated = docs;
    } else {
      updated = [...docs, { ...doc, createdAt: doc.createdAt || Date.now(), updatedAt: Date.now() }];
    }
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
    return doc;
  }

  async updateDocument(id, updates) {
    const docs = await this.getDocuments();
    const updated = docs.map(doc => {
      if (doc.id === id) {
        return { ...doc, ...updates, updatedAt: Date.now() };
      }
      return doc;
    });
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
    return updated.find(doc => doc.id === id) || null;
  }

  async deleteDocument(id) {
    const docs = await this.getDocuments();
    const filtered = docs.filter(doc => doc.id !== id);
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(filtered));
    return true;
  }

  async saveAll(documents) {
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(documents));
    return documents;
  }
}

// Singleton export - swap this with CloudDocumentStorage in Phase 2
export const documentStorage = new LocalDocumentStorage();
