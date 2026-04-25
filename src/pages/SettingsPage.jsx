import { useState } from 'react'
import { downloadCashflowCsvReport, printCashflowReport } from '../utils/reportExport'

export default function SettingsPage({
  adminName,
  installState,
  onInstallApp,
  onSaveOpeningBalance,
  openingBalance,
  syncStatus,
  transactions,
}) {
  const [value, setValue] = useState(String(openingBalance))
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const nextValue = Number(value)
    if (Number.isNaN(nextValue)) {
      setMessage('Opening balance must be a valid number.')
      return
    }

    setIsSaving(true)
    const result = await onSaveOpeningBalance(nextValue)
    setIsSaving(false)

    if (!result.ok) {
      setMessage('Opening balance could not be saved. Please try again.')
      return
    }

    setValue(String(nextValue))
    setMessage('Opening balance updated successfully.')
  }

  return (
    <div className="page-grid settings-grid">
      <section className="content-card settings-hero">
        <div>
          <p className="section-kicker">Finance Settings</p>
          <h2>Hello, {adminName}. Keep UpperHill's balance, reports, and app setup in order.</h2>
          <p className="muted-copy">
            These tools help Upper Hill Academy Morit start from the correct balance, export
            official reports, and stay ready for office and mobile use.
          </p>
        </div>
        <div className="settings-highlight">
          <span>Current Opening Balance</span>
          <strong>KES {Number(openingBalance).toLocaleString('en-KE')}</strong>
          <p>{syncStatus}</p>
        </div>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Opening Balance</p>
            <h3>Set the starting cash position</h3>
          </div>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            <span>Opening Balance (KES)</span>
            <input
              type="number"
              step="1"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>

          {message ? <p className="form-message form-message--success">{message}</p> : null}

          <div className="editor-actions editor-actions--wide">
            <button type="submit">{isSaving ? 'Saving...' : 'Save Opening Balance'}</button>
          </div>
        </form>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Reports</p>
            <h3>Export or print the school cashflow record</h3>
          </div>
        </div>
        <p className="muted-copy">
          The print layout now uses a formal school report header so you can hand it out or save it
          as PDF for meetings, bursar review, and admin records.
        </p>
        <div className="settings-actions settings-actions--stacked">
          <button
            type="button"
            onClick={() => downloadCashflowCsvReport({ openingBalance, transactions })}
          >
            Download CSV Report
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => printCashflowReport({ openingBalance, transactions })}
          >
            Print Official Report
          </button>
        </div>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Install App</p>
            <h3>Make the cashflow system feel like an app</h3>
          </div>
        </div>
        <p className="muted-copy">
          On supported browsers, staff can install this tool on desktop or phone for faster access
          from the school office. On iPhone or iPad, use the browser Share menu and choose Add to
          Home Screen after the site is deployed.
        </p>
        <div className="settings-actions settings-actions--stacked">
          <button type="button" onClick={onInstallApp} disabled={!installState.canInstall}>
            {installState.canInstall ? 'Install App' : 'Install Not Available Yet'}
          </button>
        </div>
      </section>

      <section className="content-card content-card--form deployment-card">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Deployment</p>
            <h3>Share the school finance desk online</h3>
          </div>
        </div>
        <p className="muted-copy">
          This project is ready for Vercel deployment with routing support for React pages. After
          deployment, staff can open the live link and install it on phones or desktops.
        </p>
        <div className="deployment-steps">
          <div className="deployment-step">
            <strong>1. Import repo</strong>
            <p>Open Vercel, import the Cashflow GitHub repository, and keep the framework as Vite.</p>
          </div>
          <div className="deployment-step">
            <strong>2. Add env variables</strong>
            <p>Copy the Supabase URL, anon key, and admin email values into the Vercel project settings.</p>
          </div>
          <div className="deployment-step">
            <strong>3. Deploy and install</strong>
            <p>After the first deployment, open the live link on mobile and use Install App or Add to Home Screen.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
