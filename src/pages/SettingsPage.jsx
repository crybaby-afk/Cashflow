import { useState } from 'react'
import ActivityFeed from '../components/ActivityFeed'
import Icon from '../components/Icon'
import { downloadCashflowCsvReport, printCashflowReport } from '../utils/reportExport'

export default function SettingsPage({
  activityLog,
  adminName,
  installState,
  onInstallApp,
  onRequestConfirm,
  onResetFinanceData,
  onSaveOpeningBalance,
  onShowToast,
  openingBalance,
  syncStatus,
  transactions,
}) {
  const [value, setValue] = useState(String(openingBalance))
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('success')
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const nextValue = Number(value)
    if (Number.isNaN(nextValue)) {
      setMessageTone('error')
      setMessage('Opening balance must be a valid number.')
      return
    }

    setIsSaving(true)
    const result = await onSaveOpeningBalance(nextValue)
    setIsSaving(false)

    if (!result.ok) {
      setMessageTone('error')
      setMessage('Opening balance could not be saved. Please try again.')
      onShowToast({
        title: 'Update failed',
        message: 'Opening balance could not be saved.',
        tone: 'error',
      })
      return
    }

    setValue(String(nextValue))
    setMessageTone('success')
    setMessage('Opening balance updated successfully.')
  }

  async function handleResetClick() {
    const shouldReset = await onRequestConfirm({
      title: 'Reset finance desk?',
      description:
        'This will clear current transactions, set the opening balance back to zero, and remove older activity log items.',
      confirmLabel: 'Reset Finance Desk',
      cancelLabel: 'Keep Records',
      tone: 'danger',
    })

    if (!shouldReset) {
      return
    }

    setIsResetting(true)
    const result = await onResetFinanceData()
    setIsResetting(false)

    if (!result.ok) {
      setMessageTone('error')
      setMessage('Finance desk could not be reset. Please try again.')
      onShowToast({
        title: 'Reset failed',
        message: 'The finance desk could not be reset right now.',
        tone: 'error',
      })
      return
    }

    setValue('0')
    setMessageTone('success')
    setMessage('Finance desk reset. The school can now start from a fresh zero balance.')
  }

  return (
    <div className="page-grid settings-grid">
      <section className="content-card settings-hero">
        <div>
          <p className="section-kicker">Settings</p>
          <h2>Configure App</h2>
          <p className="muted-copy">
            Manage balance, reports, and app setup.
          </p>
        </div>
        <div className="settings-highlight">
          <span>Opening Balance</span>
          <strong>KES {Number(openingBalance).toLocaleString('en-KE')}</strong>
          <p>{syncStatus}</p>
        </div>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Balance</p>
            <h3>Opening Balance</h3>
          </div>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            <span>Amount (KES)</span>
            <input
              type="number"
              step="1"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>

          {message ? (
            <p
              className={
                messageTone === 'error'
                  ? 'form-message form-message--error'
                  : 'form-message form-message--success'
              }
            >
              {message}
            </p>
          ) : null}

          <div className="editor-actions editor-actions--wide">
            <button type="submit">{isSaving ? 'Saving...' : 'Save Opening Balance'}</button>
          </div>
        </form>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Reports</p>
            <h3>Export Data</h3>
          </div>
        </div>
        <p className="muted-copy">
          Download or print transaction records.
        </p>
        <div className="settings-actions settings-actions--stacked">
          <button
            type="button"
            onClick={() => downloadCashflowCsvReport({ openingBalance, transactions })}
          >
            <Icon name="ledger" size={16} />
            Download CSV
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => printCashflowReport({ openingBalance, transactions })}
          >
            <Icon name="dashboard" size={16} />
            Print Report
          </button>
        </div>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">App</p>
            <h3>Install</h3>
          </div>
        </div>
        <p className="muted-copy">
          Add to home screen for quick access.
        </p>
        <div className="settings-actions settings-actions--stacked">
          <button type="button" onClick={onInstallApp} disabled={!installState.canInstall}>
            <Icon name="plus" size={16} />
            {installState.canInstall ? 'Install App' : 'Not Available'}
          </button>
        </div>
      </section>

      <section className="content-card content-card--form danger-card">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Reset</p>
            <h3>Clear All Data</h3>
          </div>
        </div>
        <p className="muted-copy">
          Remove all transactions and reset to zero.
        </p>
        <div className="settings-actions settings-actions--stacked">
          <button type="button" className="secondary-button danger-button" onClick={handleResetClick}>
            <Icon name="reset" size={16} />
            {isResetting ? 'Resetting...' : 'Reset'}
          </button>
        </div>
      </section>

      <section className="content-card content-card--form deployment-card">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Deploy</p>
            <h3>Go Live</h3>
          </div>
        </div>
        <p className="muted-copy">
          Deploy to Vercel for online access.
        </p>
        <div className="deployment-steps">
          <div className="deployment-step">
            <strong>1. Import</strong>
            <p>Import repo to Vercel as Vite project.</p>
          </div>
          <div className="deployment-step">
            <strong>2. Environment</strong>
            <p>Add Supabase URL and anon key.</p>
          </div>
          <div className="deployment-step">
            <strong>3. Deploy</strong>
            <p>Deploy and install on device.</p>
          </div>
        </div>
      </section>

      <ActivityFeed activities={activityLog.slice(0, 8)} />
    </div>
  )
}
