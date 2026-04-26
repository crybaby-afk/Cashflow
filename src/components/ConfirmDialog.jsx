import Icon from './Icon'

export default function ConfirmDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
  tone = 'default',
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-describedby="confirm-dialog-description"
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="modal-card"
        role="dialog"
      >
        <div className="modal-card__icon-wrap">
          <span className={tone === 'danger' ? 'modal-card__icon modal-card__icon--danger' : 'modal-card__icon'}>
            <Icon name={tone === 'danger' ? 'reset' : 'activity'} size={18} />
          </span>
        </div>
        <p className="section-kicker">Please Confirm</p>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p className="muted-copy" id="confirm-dialog-description">{description}</p>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={tone === 'danger' ? 'primary-button danger-button' : 'primary-button'}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

