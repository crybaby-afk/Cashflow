export default function ToastRegion({ onDismiss, toasts }) {
  if (!toasts.length) {
    return null
  }

  return (
    <div aria-live="polite" className="toast-region">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast-card toast-card--${toast.tone}`}>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button type="button" onClick={() => onDismiss(toast.id)}>
            Dismiss
          </button>
        </article>
      ))}
    </div>
  )
}
