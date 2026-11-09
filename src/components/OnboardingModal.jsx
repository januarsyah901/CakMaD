import Modal from './ui/Modal';
import { btn, kbd } from './ui/styles';
import { analytics } from '../utils/analytics';

const STEPS = [
  ['Paste or write Markdown', 'The left pane is the source. Output from ChatGPT, Claude or Gemini pastes in as-is.'],
  ['Check the preview', 'The right pane shows the finished document. Pick a font from the toolbar.'],
  ['Export', <>Press <kbd className={kbd}>Ctrl</kbd> <kbd className={kbd}>E</kbd> for a PDF, or <kbd className={kbd}>Ctrl</kbd> <kbd className={kbd}>S</kbd> to download the .md file.</>],
];

export default function OnboardingModal({ isOpen, onClose }) {
  const finish = () => {
    analytics.track('Onboarding Completed');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={finish}
      title="How Cak MaD works"
      footer={<button onClick={finish} className={btn.primary} data-autofocus>Start writing</button>}
    >
      <ol className="space-y-4">
        {STEPS.map(([title, desc], i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-700 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400">
        Documents are saved in this browser as you type. Nothing is uploaded. Clearing site data deletes them, so download anything you need to keep.
      </p>
    </Modal>
  );
}
