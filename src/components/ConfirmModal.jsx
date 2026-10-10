import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

const icons = {
  warning: <AlertTriangle className="text-amber-500" size={28} />,
  error: <AlertTriangle className="text-red-500" size={28} />,
  success: <CheckCircle className="text-green-500" size={28} />,
  info: <Info className="text-blue-500" size={28} />,
  question: <HelpCircle className="text-indigo-500" size={28} />
};

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning",
  isAlert = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden transform animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className={`h-1.5 w-full ${
          type === 'warning' ? 'bg-amber-500' :
          type === 'error' ? 'bg-red-500' :
          type === 'success' ? 'bg-green-500' :
          'bg-brand-500'
        }`} />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-all text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>

        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center scale-110">
            {icons[type] || icons.warning}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className={`flex-1 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 ${
                type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' :
                type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' :
                type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' :
                'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20'
              }`}
            >
              {confirmText}
            </button>
            
            {!isAlert && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-gray-700/50 rounded-xl transition-all active:scale-95"
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
