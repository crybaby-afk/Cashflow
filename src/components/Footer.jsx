import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">UpperHill Morit Finance</p>
          <p className="footer-tagline">School Cashbook Management System</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Dashboard</Link>
          <Link to="/add">Add Entry</Link>
          <Link to="/transactions">Cashbook</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="footer-info">
          <p>Version 1.0.0</p>
          <p>Built for Upper Hill Academy Morit</p>
        </div>
      </div>
    </footer>
  )
}