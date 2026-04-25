export default function Icon({ name, size = 18 }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" {...common} />
        <rect x="14" y="3" width="7" height="11" rx="1.5" {...common} />
        <rect x="3" y="14" width="7" height="7" rx="1.5" {...common} />
        <rect x="14" y="18" width="7" height="3" rx="1.5" {...common} />
      </>
    ),
    plus: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <path d="M12 8v8M8 12h8" {...common} />
      </>
    ),
    ledger: (
      <>
        <path d="M6 3h10a3 3 0 0 1 3 3v15H9a3 3 0 0 0-3 3z" {...common} />
        <path d="M6 3v18a3 3 0 0 1 3-3h10" {...common} />
        <path d="M10 8h6M10 12h6M10 16h4" {...common} />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" {...common} />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z" {...common} />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 0 2H5v10h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" {...common} />
        <path d="M17 13h4" {...common} />
      </>
    ),
    income: (
      <>
        <path d="M12 19V5" {...common} />
        <path d="m6 11 6-6 6 6" {...common} />
      </>
    ),
    expense: (
      <>
        <path d="M12 5v14" {...common} />
        <path d="m18 13-6 6-6-6" {...common} />
      </>
    ),
    balance: (
      <>
        <path d="M4 16c2.5-3 5-4.5 8-4.5S17.5 13 20 16" {...common} />
        <path d="M4 8c2.5 3 5 4.5 8 4.5S17.5 11 20 8" {...common} />
      </>
    ),
    activity: (
      <>
        <path d="M4 12h4l2-5 4 10 2-5h4" {...common} />
      </>
    ),
    reset: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" {...common} />
        <path d="M3 4v5h5" {...common} />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  )
}
