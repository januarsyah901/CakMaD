import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, FileCode, PenTool, ArrowRight, Eye, Clock, Check } from 'lucide-react';
import { templates, TEMPLATE_CATEGORIES } from '../data/templates';
import { analytics } from '../utils/analytics';

const RECENT_TEMPLATES_KEY = 'cakmad_recent_templates';

export default function TemplateModal({ isOpen, onClose, onSelect }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [recentTemplateIds, setRecentTemplateIds] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_TEMPLATES_KEY);
      return saved ? JSON.parse(saved) : ['ai-report', 'readme'];
    } catch {
      return ['ai-report', 'readme'];
    }
  });

  useEffect(() => {
    if (isOpen) {
      analytics.track('Template Modal Opened');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (template) => {
    // Save to recents
    const nextRecents = [template.id, ...recentTemplateIds.filter(id => id !== template.id)].slice(0, 3);
    setRecentTemplateIds(nextRecents);
    localStorage.setItem(RECENT_TEMPLATES_KEY, JSON.stringify(nextRecents));

    analytics.track('Template Selected', { templateId: template.id, category: template.category });
    onSelect(template);
    onClose();
  };

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const recentTemplates = recentTemplateIds
    .map(id => templates.find(t => t.id === id))
    .filter(Boolean);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'professional': return <Sparkles size={16} className="text-indigo-500" />;
      case 'academic': return <BookOpen size={16} className="text-amber-500" />;
      case 'documentation': return <FileCode size={16} className="text-blue-500" />;
      default: return <PenTool size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
              Template Library
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select a starter structure optimized for presentation and export
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Recently Used Bar */}
        {recentTemplates.length > 0 && (
          <div className="px-6 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
              <Clock size={13} /> Recently Used:
            </span>
            <div className="flex items-center gap-2">
              {recentTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className="px-2.5 py-1 bg-white dark:bg-dark-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-md text-gray-700 dark:text-gray-300 transition flex items-center gap-1.5"
                >
                  {getCategoryIcon(t.category)}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1.5 overflow-x-auto bg-white dark:bg-dark-800">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Area: Split View on Large Screens */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {/* Template Cards List (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 space-y-3">
            {filteredTemplates.map(t => {
              const isSelected = selectedTemplate?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-dark-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(t.category)}
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t.label}
                      </h4>
                      {t.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 rounded">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {t.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(t);
                    }}
                    className="shrink-0 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition"
                    title="Use this template"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Template Preview Drawer (5 cols) */}
          <div className="md:col-span-5 bg-gray-50 dark:bg-dark-900 p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
            <div className="overflow-hidden flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Eye size={14} /> Preview
                </span>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {selectedTemplate?.label}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto bg-white dark:bg-dark-800 rounded-lg p-3.5 border border-gray-200 dark:border-gray-700 font-mono text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap select-text">
                {selectedTemplate?.content || '(Empty document)'}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => handleSelect(selectedTemplate)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <Check size={16} /> Use Selected Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
