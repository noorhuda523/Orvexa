import { Btn } from './Button';
import { Modal } from './Modal';

// Generic confirm / cancel dialog.
export default function ConfirmDialog({ title, children, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="note" style={{ marginTop: 0, marginBottom: 18 }}>{children}</div>
      <div className="cta">
        <Btn v={danger ? 'dng' : 'pri'} onClick={onConfirm}>{confirmLabel}</Btn>
        <Btn v="sec" onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}
