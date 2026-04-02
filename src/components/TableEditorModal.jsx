import React, { useState } from 'react';
import { X, Table as TableIcon } from 'lucide-react';

export default function TableEditorModal({ isOpen, onClose, onInsert }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [alignment, setAlignment] = useState('left');

  if (!isOpen) return null;

  const handleGenerate = () => {
    let tableMd = '\n';
    
    // Header
    tableMd += '| ' + Array(cols).fill('Header').join(' | ') + ' |\n';
    
    // Alignment row
    const alignStr = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : ':---';
    tableMd += '| ' + Array(cols).fill(alignStr).join(' | ') + ' |\n';
    
    // Data rows
    for (let i = 0; i < rows; i++) {
      tableMd += '| ' + Array(cols).fill('Cell').join(' | ') + ' |\n';
    }
    
    onInsert(tableMd + '\n');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-900/50">
          <div className="flex items-center gap-2">
            <TableIcon className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Insert Table</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Rows</label>
              <input
                type="number"
                min="1"
                max="50"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Columns</label>
              <input
                type="number"
                min="1"
                max="20"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Alignment</label>
            <div className="flex bg-gray-100 dark:bg-dark-900 p-1 rounded-lg">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                    alignment === align
                      ? 'bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Generate Table
          </button>
        </div>
      </div>
    </div>
  );
}
