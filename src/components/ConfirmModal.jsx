import Modal from './ui/Modal';
import { btn } from './ui/styles';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
      footer={
        <>
          <button onClick={onClose} className={btn.ghost}>{cancelText}</button>
          <button
            data-autofocus
            onClick={() => { onConfirm?.(); onClose(); }}
            className={destructive ? btn.danger : btn.primary}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{message}</p>
    </Modal>
  );
}
