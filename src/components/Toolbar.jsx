import { Bold, Italic, Heading1, Heading2, Link, Code, Minus, Maximize, Eye, EyeOff, Table, Sigma, WrapText } from 'lucide-react';
import FontSelector from './FontSelector';

const TOOLS = [
  { icon: Bold, label: 'Bold', text: '**bold**', selectionOffset: 2 },
  { icon: Italic, label: 'Italic', text: '*italic*', selectionOffset: 1 },
  { icon: Heading1, label: 'H1', text: '# Heading 1\n', selectionOffset: 2 },
  { icon: Heading2, label: 'H2', text: '## Heading 2\n', selectionOffset: 3 },
  { icon: Link, label: 'Link', text: '[title](url)', selectionOffset: 1 },
  { icon: Code, label: 'Code', text: '`code`', selectionOffset: 1 },
  { icon: Table, label: 'Table', isModal: true },
  { icon: Sigma, label: 'Math', text: '$$ E = mc^2 $$', selectionOffset: 3 },
  { icon: Minus, label: 'Divider', text: '\n---\n', selectionOffset: 5 },
];

export default function Toolbar({ 
  onInsert, isFocusMode, toggleFocusMode, isPreviewVisible, togglePreview, 
  onOpenTableModal, selectedFont, onFontChange,
  isLineWrapping, toggleLineWrapping
}) {
  return (
    <div className="flex flex-wrap items-center justify-between w-full bg-gray-100 dark:bg-dark-700 px-2 sm:px-4 py-1.5 sm:py-2 border-b border-gray-200 dark:border-gray-600 transition-colors">
      <div className="flex items-center space-x-1 sm:space-x-2">
        {TOOLS.map(({ icon: Icon, label, text, selectionOffset, isModal }) => (
          <button
            key={label}
            onClick={() => isModal ? onOpenTableModal() : onInsert(text, selectionOffset)}
            title={label}
            className="p-1 sm:p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Icon size={18} />
          </button>
        ))}
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />
        
        <div className="hidden md:block">
          <FontSelector selectedFont={selectedFont} onSelect={onFontChange} />
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 border-l border-gray-300 dark:border-gray-600 pl-2 sm:pl-2">
        <button
          onClick={toggleLineWrapping}
          title={isLineWrapping ? "Disable Word Wrap" : "Enable Word Wrap"}
          className={`p-1 sm:p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isLineWrapping 
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <WrapText size={18} />
        </button>

        <button
          onClick={togglePreview}
          title={isPreviewVisible ? "Hide Preview" : "Show Preview"}
          className={`p-1 sm:p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            !isPreviewVisible 
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {isPreviewVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        <button
          onClick={() => toggleFocusMode()}
          title="Toggle Focus Mode"
          className={`p-1 sm:p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isFocusMode 
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}

