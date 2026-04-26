import Icon from './Icon'
import Tooltip from './Tooltip'
import { formatCurrency } from '../utils/formatCurrency'

const tooltipContent = {
  'Opening Balance': 'The starting amount in the cashbook before any transactions for this period. Set this in Settings.',
  'Money In': 'All income received - fees payments, donations, grants, and any other money entering the school.',
  'Money Out': 'All expenses - supplies, utilities, maintenance, staff payments, and any money leaving the school.',
  'Closing Balance': 'The remaining funds after subtracting expenses from (opening balance + income).',
  'Current Deficit': 'Spending has exceeded available funds. The school is operating at a loss.',
}

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
        <Tooltip content={tooltipContent[label] || ''}>
          <p className="summary-label">{label}</p>
        </Tooltip>
        <span className="summary-icon">
          <Icon name={iconMap[tone] || 'wallet'} size={16} />
        </span>
      </div>
      <strong>{formatCurrency(amount)}</strong>
      {helperText ? <span className="summary-helper">{helperText}</span> : null}
    </article>
  )
}
