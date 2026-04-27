import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">UpperHill Morit</p>
          <p className="footer-tagline">School Finance</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/add">Add</Link>
          <Link to="/transactions">Cashbook</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="footer-info">
          <p>v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}