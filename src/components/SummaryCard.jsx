import Icon from './Icon'
import { formatCurrency } from '../utils/formatCurrency'

export default function SummaryCard({
  label,
  amount,
  tone = 'neutral',
  helperText,
}) {
  const iconMap = {
    income: 'income',
    expense: 'expense',
    balance: 'balance',
    neutral: 'wallet',
    alert: 'balance',
  }

  return (
    <article className={`summary-card summary-card--${tone}`}>
      <div className="summary-card-top">
        <p>{label}</p>
        <span className="summary-icon">
          <Icon name={iconMap[tone] || 'wallet'} size={16} />
        </span>
      </div>
      <strong>{formatCurrency(amount)}</strong>
      {helperText ? <span className="summary-helper">{helperText}</span> : null}
    </article>
  )
}
