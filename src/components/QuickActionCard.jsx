import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function QuickActionCard({ title, description, to, accent }) {
  const iconMap = {
    income: 'income',
    expense: 'ledger',
    balance: 'settings',
  }

  return (
    <Link className={`quick-action quick-action--${accent}`} to={to}>
      <div className="quick-action-header">
        <span>{title}</span>
        <span className="quick-action-icon">
          <Icon name={iconMap[accent] || 'dashboard'} size={18} />
        </span>
      </div>
      <p>{description}</p>
      <strong>Open section</strong>
    </Link>
  )
}
