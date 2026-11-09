import { Heart } from 'lucide-react';
import Modal from './ui/Modal';
import { btn, kbd } from './ui/styles';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? '⌘' : 'Ctrl';

const SECTIONS = [
  ['Document', [
    [[MOD, 'S'], 'Download as .md'],
    [[MOD, 'E'], 'Export PDF'],
    [[MOD, 'Alt', 'N'], 'New from template'],
    [[MOD, 'O'], 'Open a .md file'],
  ]],
  ['Formatting', [
    [[MOD, 'B'], 'Bold'],
    [[MOD, 'I'], 'Italic'],
    [[MOD, 'K'], 'Link'],
    [[MOD, 'Shift', 'X'], 'Strikethrough'],
    [[MOD, '`'], 'Inline code'],
    [[MOD, 'F'], 'Find in document'],
  ]],
  ['View', [
    [[MOD, 'Shift', 'P'], 'Show / hide preview'],
    [[MOD, 'Shift', 'F'], 'Focus mode'],
    [['Esc'], 'Leave focus mode, close dialogs'],
    [[MOD, '/'], 'This list'],
  ]],
];

export default function ShortcutsModal({ isOpen, onClose, onShowIntro }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Keyboard shortcuts"
      footer={
        <>
          <a href="https://saweria.co/januarsyah" target="_blank" rel="noopener noreferrer" className={`${btn.ghost} mr-auto`}>
            <Heart size={15} /> Support Cak MaD
          </a>
          <button onClick={() => { onClose(); onShowIntro(); }} className={btn.ghost}>Show intro</button>
          <button onClick={onClose} className={btn.secondary}>Close</button>
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {SECTIONS.map(([title, rows]) => (
          <section key={title}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h3>
            <dl className="space-y-1.5">
              {rows.map(([keys, desc]) => (
                <div key={desc} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-gray-700 dark:text-gray-300">{desc}</dt>
                  <dd className="flex shrink-0 gap-1">
                    {keys.map((k) => <kbd key={k} className={kbd}>{k}</kbd>)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Files</h3>
          <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
            <li>Drop a .md file anywhere to open it.</li>
            <li>Paste or drop an image into the editor to embed it (max 2 MB).</li>
            <li>Double-click a document in the sidebar to rename it.</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
}
