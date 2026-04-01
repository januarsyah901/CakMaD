import { Bold, Italic, Heading1, Heading2, Link, Code, Minus } from 'lucide-react';

const TOOLS = [
  { icon: Bold, label: 'Bold', text: '**bold**', selectionOffset: 2 },
  { icon: Italic, label: 'Italic', text: '*italic*', selectionOffset: 1 },
  { icon: Heading1, label: 'H1', text: '# Heading 1\n', selectionOffset: 2 },
  { icon: Heading2, label: 'H2', text: '## Heading 2\n', selectionOffset: 3 },
  { icon: Link, label: 'Link', text: '[title](url)', selectionOffset: 1 },
  { icon: Code, label: 'Code', text: '\`code\`', selectionOffset: 1 },
  { icon: Minus, label: 'Divider', text: '\n---\n', selectionOffset: 5 },
];

export default function Toolbar({ onInsert }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 transition-colors">
      {TOOLS.map(({ icon: Icon, label, text, selectionOffset }) => (
        <button
          key={label}
          onClick={() => onInsert(text, selectionOffset)}
          title={label}
          className="p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
