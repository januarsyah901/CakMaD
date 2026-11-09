import { useRef } from 'react';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, ListChecks, Quote,
  Link, ImagePlus, Code, SquareCode, Table, Sigma, Workflow, Minus,
  WrapText, Columns2, Maximize2,
} from 'lucide-react';
import FontSelector from './FontSelector';

const mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl+';

const GROUPS = [
  [
    { cmd: 'h1', icon: Heading1, label: 'Heading 1' },
    { cmd: 'h2', icon: Heading2, label: 'Heading 2' },
    { cmd: 'h3', icon: Heading3, label: 'Heading 3' },
  ],
  [
    { cmd: 'bold', icon: Bold, label: 'Bold', keys: `${mod}B` },
    { cmd: 'italic', icon: Italic, label: 'Italic', keys: `${mod}I` },
    { cmd: 'strike', icon: Strikethrough, label: 'Strikethrough', keys: `${mod}Shift+X` },
    { cmd: 'code', icon: Code, label: 'Inline code', keys: `${mod}\`` },
    { cmd: 'link', icon: Link, label: 'Link', keys: `${mod}K` },
  ],
  [
    { cmd: 'bullet', icon: List, label: 'Bulleted list' },
    { cmd: 'numbered', icon: ListOrdered, label: 'Numbered list' },
    { cmd: 'task', icon: ListChecks, label: 'Task list' },
    { cmd: 'quote', icon: Quote, label: 'Quote' },
  ],
  [
    { cmd: 'image', icon: ImagePlus, label: 'Image (or paste / drop one)' },
    { cmd: 'table', icon: Table, label: 'Table' },
    { cmd: 'codeBlock', icon: SquareCode, label: 'Code block' },
    { cmd: 'math', icon: Sigma, label: 'Math block' },
    { cmd: 'mermaid', icon: Workflow, label: 'Mermaid diagram' },
    { cmd: 'divider', icon: Minus, label: 'Divider' },
  ],
];

const toolBtn = 'shrink-0 rounded p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-600/60 hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors';
const toggleBtn = (on) => `${toolBtn} ${on ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : ''}`;

export default function Toolbar({
  onCommand, onOpenTableModal, onImage,
  isFocusMode, toggleFocusMode, isPreviewVisible, togglePreview,
  selectedFont, onFontChange, isLineWrapping, toggleLineWrapping, isMobile,
}) {
  const imageInput = useRef(null);

  const run = (cmd) => {
    if (cmd === 'table') return onOpenTableModal();
    if (cmd === 'image') return imageInput.current?.click();
    onCommand(cmd);
  };

  return (
    <div className="flex w-full items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 px-2 py-1">
      <div role="toolbar" aria-label="Formatting" className="flex min-w-0 flex-1 items-center overflow-x-auto no-scrollbar">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && <span className="mx-1.5 h-5 w-px shrink-0 bg-gray-300 dark:bg-gray-600" aria-hidden="true" />}
            {group.map((tool) => (
              <button
                key={tool.cmd}
                type="button"
                // Keep the editor selection while clicking toolbar buttons.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => run(tool.cmd)}
                title={tool.keys ? `${tool.label} (${tool.keys})` : tool.label}
                aria-label={tool.label}
                className={toolBtn}
              >
                <tool.icon size={17} strokeWidth={2} />
              </button>
            ))}
          </div>
        ))}
        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImage(file);
            e.target.value = '';
          }}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2">
        <div className="hidden md:block">
          <FontSelector selectedFont={selectedFont} onSelect={onFontChange} />
        </div>
        <button
          onClick={toggleLineWrapping}
          title="Wrap long lines"
          aria-pressed={isLineWrapping}
          aria-label="Wrap long lines"
          className={toggleBtn(isLineWrapping)}
        >
          <WrapText size={17} />
        </button>
        {!isMobile && (
          <button
            onClick={togglePreview}
            title={`${isPreviewVisible ? 'Hide' : 'Show'} preview (${mod}Shift+P)`}
            aria-pressed={isPreviewVisible}
            aria-label="Show preview"
            className={toggleBtn(isPreviewVisible)}
          >
            <Columns2 size={17} />
          </button>
        )}
        <button
          onClick={() => toggleFocusMode()}
          title={`Focus mode (${mod}Shift+F)`}
          aria-pressed={isFocusMode}
          aria-label="Focus mode"
          className={toggleBtn(isFocusMode)}
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </div>
  );
}
