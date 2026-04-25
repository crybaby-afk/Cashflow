import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import upperhillBadge from './assets/upperhill-badge.svg'
import { mockTransactions } from './data/mockTransactions'
import AddTransactionPage from './pages/AddTransactionPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import TransactionsPage from './pages/TransactionsPage'
import {
  getCurrentSession,
  hasSupabaseConfig,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
} from './services/supabase'
import { loadFinanceSettings, saveOpeningBalance } from './services/settingsStore'
import {
  deleteTransaction,
  loadTransactions,
  saveTransaction,
  updateTransaction,
} from './services/transactionStore'

const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Add Entry', to: '/add' },
  { label: 'Cashbook', to: '/transactions' },
  { label: 'Settings', to: '/settings' },
]

function createTransactionId() {
  return `txn-${crypto.randomUUID()}`
}

function AppShell() {
  const [transactions, setTransactions] = useState([])
  const [openingBalance, setOpeningBalance] = useState(0)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [session, setSession] = useState(null)
  const [installPromptEvent, setInstallPromptEvent] = useState(null)
  const [syncStatus, setSyncStatus] = useState(
    hasSupabaseConfig ? 'Supabase connected' : 'Local device storage',
  )

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setInstallPromptEvent(event)
    }

    function handleAppInstalled() {
      setInstallPromptEvent(null)
      setSyncStatus('App installed successfully')
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
        setIsLoadingTransactions(false)
        return
      }

      setIsLoadingTransactions(true)
      try {
        const [initialTransactions, settings] = await Promise.all([
          loadTransactions(mockTransactions),
          loadFinanceSettings(),
        ])

        if (isMounted) {
          setTransactions(initialTransactions)
          setOpeningBalance(settings.openingBalance)
        }
      } catch (error) {
        console.error('Failed to load finance data:', error)
        if (isMounted) {
          setTransactions(mockTransactions)
          setOpeningBalance(0)
          setSyncStatus('Fallback seed data loaded')
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

  async function handleLogin(credentials) {
    if (!hasSupabaseConfig) {
      return { ok: false, message: 'Supabase is not configured yet.' }
    }

    setIsSigningIn(true)
    try {
      await signInAdmin(credentials)
      setSyncStatus('Signed in as approved admin')
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
      setSyncStatus(hasSupabaseConfig ? 'Signed out' : 'Local device storage')
    } catch (error) {
      console.error('Sign out failed:', error)
      setSyncStatus('Sign out failed')
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
      setSyncStatus(hasSupabaseConfig ? 'Saved to Supabase and device' : 'Saved on this device')
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
      setSyncStatus('Transaction updated')
      return { ok: true }
    } catch (error) {
      console.error('Failed to update transaction:', error)
      setSyncStatus('Update failed')
      return { ok: false }
    }
  }

  async function handleDeleteTransaction(transactionId) {
    try {
      const nextTransactions = await deleteTransaction(transactionId)
      setTransactions(nextTransactions)
      setSyncStatus('Transaction deleted')
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
      setSyncStatus('Opening balance updated')
      return { ok: true }
    } catch (error) {
      console.error('Failed to save opening balance:', error)
      setSyncStatus('Opening balance update failed')
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
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-hero">
            <div className="brand-mark">
              <div className="brand-logo-shell">
                <img className="brand-logo" src={upperhillBadge} alt="Upper Hill Academy Morit crest" />
              </div>
              <div className="brand-copy">
                <p className="eyebrow">Upper Hill Academy Morit</p>
                <h1>Cashflow System for the School Finance Desk</h1>
                <p className="brand-note">
                  A polished school cashbook for receipts, expenses, live balances, and daily
                  administrative reporting under one calm finance workspace.
                </p>
              </div>
            </div>

            <aside className="brand-sidepanel">
              <div className="brand-meta-card">
                <span>Finance office</span>
                <strong>Sailing to Success</strong>
                <p>Built for Upper Hill Academy Morit bursar and admin work.</p>
              </div>
              <div className="brand-meta-card brand-meta-card--glow">
                <span>Live sync</span>
                <strong>{syncStatus}</strong>
                <p>Secure admin session with cloud-backed cashbook records.</p>
              </div>
            </aside>
          </div>

          <div className="brand-rail">
            <div className="term-chip">Upper Hill Academy Morit</div>
            <div className="motto-card">
              <span>School Motto</span>
              <strong>Sailing to Success</strong>
            </div>
            <div className="sync-chip">Approved admin: {session.user.email}</div>
          </div>
        </div>

        <div className="topbar-panel">
          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link--active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="logo-placeholder-card admin-card">
            <div>
              <span>Signed in administrator</span>
              <p>{session.user.email}</p>
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
            path="/"
            element={
              <DashboardPage
                isLoadingTransactions={isLoadingTransactions}
                openingBalance={openingBalance}
                transactions={transactions}
              />
            }
          />
          <Route
            path="/add"
            element={
              <AddTransactionPage
                onAddTransaction={handleAddTransaction}
                openingBalance={openingBalance}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <TransactionsPage
                isLoadingTransactions={isLoadingTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                transactions={transactions}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                installState={{ canInstall: Boolean(installPromptEvent) }}
                onInstallApp={handleInstallApp}
                onSaveOpeningBalance={handleSaveOpeningBalance}
                openingBalance={openingBalance}
                syncStatus={syncStatus}
                transactions={transactions}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
