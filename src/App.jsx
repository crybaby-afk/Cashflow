import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import upperhillLockup from './assets/upperhill-lockup.svg'
import ConfirmDialog from './components/ConfirmDialog'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Icon from './components/Icon'
import ThemeToggle from './components/ThemeToggle'
import ToastRegion from './components/ToastRegion'
import { mockTransactions } from './data/mockTransactions'
import AddTransactionPage from './pages/AddTransactionPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import TransactionsPage from './pages/TransactionsPage'
import { clearActivityLog, loadActivityLog, logFinanceActivity } from './services/activityStore'
import { loadFinanceSettings, resetFinanceSettings, saveOpeningBalance } from './services/settingsStore'
import {
  getCurrentSession,
  hasSupabaseConfig,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
} from './services/supabase'
import {
  clearTransactions,
  deleteTransaction,
  loadTransactions,
  saveTransaction,
  updateTransaction,
} from './services/transactionStore'

const navItems = [
  { label: 'Overview', to: '/', icon: 'dashboard' },
  { label: 'Add Entry', to: '/add', icon: 'plus' },
  { label: 'Cashbook', to: '/transactions', icon: 'ledger' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

function createTransactionId() {
  return `txn-${crypto.randomUUID()}`
}

function createToastId() {
  return `toast-${crypto.randomUUID()}`
}

function getAdminName(email) {
  if (!email) {
    return 'Admin'
  }

  const localPart = email.split('@')[0].toLowerCase()

  if (localPart.startsWith('joan')) {
    return 'Joan'
  }

  const words = localPart
    .replace(/[0-9]+/g, '')
    .split(/[._-]+/)
    .filter(Boolean)

  const firstWord = words[0] || 'Admin'
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
}

function AppShell() {
  const [transactions, setTransactions] = useState([])
  const [openingBalance, setOpeningBalance] = useState(0)
  const [activityLog, setActivityLog] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [session, setSession] = useState(null)
  const [installPromptEvent, setInstallPromptEvent] = useState(null)
  const [syncStatus, setSyncStatus] = useState(
    hasSupabaseConfig ? 'Cloud sync ready' : 'Saved on this device',
  )
  const [dialogState, setDialogState] = useState(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setInstallPromptEvent(event)
    }

    function handleAppInstalled() {
      setInstallPromptEvent(null)
      setSyncStatus('App installed')
      showToast({
        title: 'Installed',
        message: 'The finance desk is ready from your home screen.',
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function startAuth() {
      const currentSession = await getCurrentSession()
      if (isMounted) {
        setSession(currentSession)
        setIsCheckingAuth(false)
      }
    }

    startAuth()
    const unsubscribe = onAuthStateChange((nextSession) => {
      setSession(nextSession)
      setIsCheckingAuth(false)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function startData() {
      if (!session) {
        setTransactions([])
        setOpeningBalance(0)
        setActivityLog([])
        setIsLoadingTransactions(false)
        return
      }

      setIsLoadingTransactions(true)
      try {
        const [initialTransactions, settings, activities] = await Promise.all([
          loadTransactions(mockTransactions),
          loadFinanceSettings(),
          loadActivityLog(),
        ])

        if (isMounted) {
          setTransactions(initialTransactions)
          setOpeningBalance(settings.openingBalance)
          setActivityLog(activities)
        }
      } catch (error) {
        console.error('Failed to load finance data:', error)
        if (isMounted) {
          setTransactions(mockTransactions)
          setOpeningBalance(0)
          setActivityLog([])
          setSyncStatus('Local records loaded')
          showToast({
            title: 'Offline backup',
            message: 'The app loaded from local records because the latest sync was unavailable.',
            tone: 'warning',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingTransactions(false)
        }
      }
    }

    startData()

    return () => {
      isMounted = false
    }
  }, [session])

  function dismissToast(toastId) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }

  function showToast({ message, title, tone = 'success' }) {
    const toastId = createToastId()
    setToasts((currentToasts) => [...currentToasts, { id: toastId, message, title, tone }])

    window.setTimeout(() => {
      dismissToast(toastId)
    }, 4200)
  }

  function requestConfirmation({
    cancelLabel,
    confirmLabel,
    description,
    title,
    tone = 'default',
  }) {
    return new Promise((resolve) => {
      setDialogState({ cancelLabel, confirmLabel, description, resolve, title, tone })
    })
  }

  function handleDialogClose(confirmed) {
    if (dialogState?.resolve) {
      dialogState.resolve(confirmed)
    }
    setDialogState(null)
  }

  async function pushActivity(action, message, metadata = {}) {
    const nextActivity = await logFinanceActivity({ action, message, metadata })
    setActivityLog(nextActivity)
  }

  async function handleLogin(credentials) {
    if (!hasSupabaseConfig) {
      return { ok: false, message: 'Supabase is not configured yet.' }
    }

    setIsSigningIn(true)
    try {
      await signInAdmin(credentials)
      setSyncStatus('Admin signed in')
      showToast({ title: 'Welcome back', message: 'UpperHill Finance is ready to use.' })
      return { ok: true }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        ok: false,
        message: error.message || 'Could not sign in with those credentials.',
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  async function handleSignOut() {
    try {
      await signOutAdmin()
      setTransactions([])
      setOpeningBalance(0)
      setActivityLog([])
      setSyncStatus(hasSupabaseConfig ? 'Signed out' : 'Saved on this device')
    } catch (error) {
      console.error('Sign out failed:', error)
      setSyncStatus('Sign out failed')
      showToast({
        title: 'Sign-out failed',
        message: 'The session could not be closed. Please try again.',
        tone: 'error',
      })
    }
  }

  async function handleInstallApp() {
    if (!installPromptEvent) {
      return
    }

    await installPromptEvent.prompt()
    await installPromptEvent.userChoice
    setInstallPromptEvent(null)
  }

  async function handleAddTransaction(transactionInput) {
    const timestamp = new Date().toISOString()
    const nextTransaction = {
      id: createTransactionId(),
      type: transactionInput.type,
      amount: Number(transactionInput.amount),
      category: transactionInput.category,
      note: transactionInput.note.trim(),
      date: transactionInput.date,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    try {
      const nextTransactions = await saveTransaction(nextTransaction)
      setTransactions(nextTransactions)
      await pushActivity(
        'create',
        `${nextTransaction.category} recorded for ${nextTransaction.amount.toLocaleString('en-KE')} KES.`,
        { transactionId: nextTransaction.id, type: nextTransaction.type },
      )
      setSyncStatus(hasSupabaseConfig ? 'Saved and synced' : 'Saved on this device')
      showToast({ title: 'Transaction saved', message: 'The new cashbook entry is now recorded.' })
      return { ok: true }
    } catch (error) {
      console.error('Failed to save transaction:', error)
      setSyncStatus('Save failed')
      return { ok: false }
    }
  }

  async function handleUpdateTransaction(transactionInput) {
    try {
      const nextTransactions = await updateTransaction(transactionInput)
      setTransactions(nextTransactions)
      await pushActivity(
        'update',
        `${transactionInput.category} was edited and saved again.`,
        { transactionId: transactionInput.id },
      )
      setSyncStatus('Transaction updated')
      showToast({ title: 'Transaction updated', message: 'The changes were saved successfully.' })
      return { ok: true }
    } catch (error) {
      console.error('Failed to update transaction:', error)
      setSyncStatus('Update failed')
      return { ok: false }
    }
  }

  async function handleDeleteTransaction(transactionId) {
    const targetTransaction = transactions.find((transaction) => transaction.id === transactionId)

    try {
      const nextTransactions = await deleteTransaction(transactionId)
      setTransactions(nextTransactions)
      if (targetTransaction) {
        await pushActivity(
          'delete',
          `${targetTransaction.category} for ${targetTransaction.amount.toLocaleString('en-KE')} KES was deleted.`,
          { transactionId },
        )
      }
      setSyncStatus('Transaction deleted')
      showToast({ title: 'Transaction deleted', message: 'The selected entry was removed.' })
      return { ok: true }
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      setSyncStatus('Delete failed')
      return { ok: false }
    }
  }

  async function handleSaveOpeningBalance(nextOpeningBalance) {
    try {
      const settings = await saveOpeningBalance(nextOpeningBalance)
      setOpeningBalance(settings.openingBalance)
      await pushActivity(
        'settings',
        `Opening balance updated to ${Number(nextOpeningBalance).toLocaleString('en-KE')} KES.`,
      )
      setSyncStatus('Opening balance updated')
      showToast({ title: 'Opening balance updated', message: 'The starting cash position was saved.' })
      return { ok: true }
    } catch (error) {
      console.error('Failed to save opening balance:', error)
      setSyncStatus('Opening balance update failed')
      return { ok: false }
    }
  }

  async function handleResetFinanceData() {
    try {
      const [nextTransactions] = await Promise.all([
        clearTransactions(),
        resetFinanceSettings(),
        clearActivityLog(),
      ])
      setTransactions(nextTransactions)
      setOpeningBalance(0)
      setActivityLog([])
      const nextActivity = await logFinanceActivity({
        action: 'reset',
        message: 'Finance records were reset to a fresh start.',
      })
      setActivityLog(nextActivity)
      setSyncStatus('Finance desk reset to zero')
      showToast({ title: 'Finance desk reset', message: 'Transactions and opening balance returned to zero.' })
      return { ok: true }
    } catch (error) {
      console.error('Failed to reset finance desk:', error)
      setSyncStatus('Finance reset failed')
      return { ok: false }
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="app-shell app-shell--centered">
        <div className="loading-card">
          <p className="section-kicker">Secure Access</p>
          <h2>Checking admin session...</h2>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="app-shell app-shell--centered">
        <LoginPage
          isSubmitting={isSigningIn}
          isSupabaseReady={hasSupabaseConfig}
          onLogin={handleLogin}
        />
        <ToastRegion onDismiss={dismissToast} toasts={toasts} />
      </div>
    )
  }

  const adminName = getAdminName(session.user.email)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-hero">
            <div className="brand-mark">
              <div className="brand-logo-shell brand-logo-shell--lockup">
                <img
                  alt="Upper Hill Academy Morit official crest and motto"
                  className="brand-logo brand-logo--lockup"
                  src={upperhillLockup}
                />
              </div>
              <div className="brand-copy">
                <p className="eyebrow">Upper Hill Academy Morit</p>
                <h1>Hello, {adminName}. Welcome back to UpperHill Finance.</h1>
                <p className="brand-note">
                  This is your school finance desk for receipts, expenses, live balances,
                  reporting, and day-to-day cashbook control.
                </p>
              </div>
            </div>

            <aside className="brand-sidepanel">
              <div className="brand-meta-card">
                <span>Good to see you</span>
                <strong>{adminName}, UpperHill is ready.</strong>
                <p>Review the books, record new entries, and keep the finance desk moving smoothly.</p>
              </div>
              <div className="brand-meta-card brand-meta-card--glow">
                <span>Live sync</span>
                <strong>{syncStatus}</strong>
                <p>Secure admin session with cloud-backed cashbook records and printed reporting.</p>
              </div>
            </aside>
          </div>

          <div className="brand-rail">
            <div className="term-chip">Upper Hill Academy Morit</div>
            <div className="motto-card">
              <span>School Motto</span>
              <strong>Sailing to Success</strong>
            </div>
            <div className="sync-chip">Hello, {adminName}</div>
          </div>
        </div>

        <div className="topbar-panel">
          <nav aria-label="Primary navigation" className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
                end={item.to === '/'}
                to={item.to}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="logo-placeholder-card admin-card">
            <div>
              <span>Signed in administrator</span>
              <p>{adminName}</p>
              <small>{session.user.email}</small>
            </div>
            <button className="logout-button" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <Routes>
          <Route
            element={
              <DashboardPage
                activityLog={activityLog}
                adminName={adminName}
                isLoadingTransactions={isLoadingTransactions}
                openingBalance={openingBalance}
                transactions={transactions}
              />
            }
            path="/"
          />
          <Route
            element={
              <AddTransactionPage
                adminName={adminName}
                onAddTransaction={handleAddTransaction}
                openingBalance={openingBalance}
              />
            }
            path="/add"
          />
          <Route
            element={
              <TransactionsPage
                adminName={adminName}
                isLoadingTransactions={isLoadingTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onRequestConfirm={requestConfirmation}
                onShowToast={showToast}
                onUpdateTransaction={handleUpdateTransaction}
                transactions={transactions}
              />
            }
            path="/transactions"
          />
          <Route
            element={
              <SettingsPage
                activityLog={activityLog}
                adminName={adminName}
                installState={{ canInstall: Boolean(installPromptEvent) }}
                onInstallApp={handleInstallApp}
                onRequestConfirm={requestConfirmation}
                onResetFinanceData={handleResetFinanceData}
                onSaveOpeningBalance={handleSaveOpeningBalance}
                onShowToast={showToast}
                openingBalance={openingBalance}
                syncStatus={syncStatus}
                transactions={transactions}
              />
            }
            path="/settings"
          />
        </Routes>
      </main>

      <ConfirmDialog
        cancelLabel={dialogState?.cancelLabel}
        confirmLabel={dialogState?.confirmLabel}
        description={dialogState?.description}
        isOpen={Boolean(dialogState)}
        onCancel={() => handleDialogClose(false)}
        onConfirm={() => handleDialogClose(true)}
        title={dialogState?.title}
        tone={dialogState?.tone}
      />
      <ToastRegion onDismiss={dismissToast} toasts={toasts} />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
