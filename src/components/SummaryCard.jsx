import { formatCurrency } from '../utils/formatCurrency'

export default function SummaryCard({
  label,
  amount,
  tone = 'neutral',
  helperText,
}) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <p>{label}</p>
      <strong>{formatCurrency(amount)}</strong>
      {helperText ? <span className="summary-helper">{helperText}</span> : null}
    </article>
  )
}
