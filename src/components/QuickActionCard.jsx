import { Link } from 'react-router-dom'

export default function QuickActionCard({ title, description, to, accent }) {
  return (
    <Link className={`quick-action quick-action--${accent}`} to={to}>
      <span>{title}</span>
      <p>{description}</p>
      <strong>Open section</strong>
    </Link>
  )
}
