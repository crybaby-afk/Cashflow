import { useMemo, useState } from 'react'
import ActivityFeed from '../components/ActivityFeed'
import HelpInfo from '../components/HelpInfo'
import QuickActionCard from '../components/QuickActionCard'
import QuickStatsBar from '../components/QuickStatsBar'
import SummaryCard from '../components/SummaryCard'
import TransactionTable from '../components/TransactionTable'
import {
  getLatestTransactionDate,
  getTransactionSummary,
  getTransactionsForMonth,
  sortTransactionsNewestFirst,
} from '../utils/transactionSummary'

function formatNumber(value) {
  return value.toLocaleString('en-KE')
}

export default function DashboardPage({
  activityLog,
  adminName,
  isLoadingTransactions,
  openingBalance,
  transactions,
}) {
  const [period, setPeriod] = useState('month')
  const latestTransactionDate = getLatestTransactionDate(transactions)

  const scopedTransactions = useMemo(() => {
    if (period === 'month') {
      return getTransactionsForMonth(transactions, latestTransactionDate)
    }

    return transactions
  }, [latestTransactionDate, period, transactions])

  const summary = getTransactionSummary(scopedTransactions, openingBalance)
  const recentTransactions = sortTransactionsNewestFirst(transactions).slice(0, 5)
  const recentActivity = activityLog.slice(0, 5)
  const isDeficit = summary.balance < 0
  const deficitAmount = Math.abs(summary.balance)
  const scopeLabel = period === 'month' ? 'Monthly view' : 'All records'

  return (
    <div className="page-grid">
      <section className="hero-panel hero-panel--school hero-panel--dashboard">
        <div className="hero-copy">
          <p className="section-kicker">Finance Overview</p>
          <h2>Welcome back, {adminName}</h2>
          <p className="muted-copy">
            Your school cash position at a glance.
          </p>
          <div className="view-toggle" aria-label="Dashboard period selector">
            <button
              type="button"
              className={period === 'month' ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => setPeriod('month')}
            >
              This Month
            </button>
            <button
              type="button"
              className={period === 'all' ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => setPeriod('all')}
            >
              All Time
            </button>
          </div>
        </div>

        <div className={isDeficit ? 'hero-balance hero-balance--negative' : 'hero-balance'}>
          <span>{period === 'month' ? 'This Month' : 'Total Balance'}</span>
          <strong>KES {formatNumber(summary.balance)}</strong>
          <p>
            {isDeficit
              ? `Over by KES ${formatNumber(deficitAmount)}`
              : 'In the black'}
          </p>
        </div>

        <div className="hero-sidecard">
          <p className="section-kicker">Formula</p>
          <h3>Opening + In - Out</h3>
          <p>
            {isLoadingTransactions
              ? 'Loading...'
              : 'Auto-calculated from entries'}
          </p>
        </div>
      </section>

      <QuickStatsBar openingBalance={openingBalance} transactions={transactions} />

      <section className="summary-grid" aria-label="Financial summary">
        <SummaryCard
          label="Opening Balance"
          amount={summary.openingBalance}
          tone="neutral"
          helperText="Starting amount"
        />
        <SummaryCard
          label="Money In"
          amount={summary.income}
          tone="income"
          helperText="Total income"
        />
        <SummaryCard
          label="Money Out"
          amount={summary.expenses}
          tone="expense"
          helperText="Total expenses"
        />
        <SummaryCard
          label={isDeficit ? 'Deficit' : 'Balance'}
          amount={summary.balance}
          tone={isDeficit ? 'alert' : 'balance'}
          helperText={isDeficit ? 'Over budget' : 'Remaining'}
        />
      </section>

      <section className="status-strip" aria-label="Dashboard insights">
        <article className="status-tile">
          <span>View</span>
          <strong>{scopeLabel}</strong>
          <p>{period === 'month' ? 'This month' : 'All time'}</p>
        </article>
        <article className="status-tile">
          <span>Entries</span>
          <strong>{scopedTransactions.length}</strong>
          <p>Transactions recorded</p>
        </article>
      </section>

      <section className="actions-grid" aria-label="Quick actions">
        <QuickActionCard
          title="Add Entry"
          description="Record money in or out"
          to="/add"
          accent="income"
        />
        <QuickActionCard
          title="Review Cashbook"
          description="Open the ledger to inspect entries, correct mistakes, and prepare reporting."
          to="/transactions"
          accent="expense"
        />
        <QuickActionCard
          title="Settings"
          description="Configure app & reports"
          to="/settings"
          accent="balance"
        />
      </section>

      <section className="dashboard-secondary-grid">
        <section className="content-card content-card--ledger">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Recent</p>
              <h3>Latest transactions</h3>
            </div>
            <span className="pill">{recentTransactions.length} entries</span>
          </div>
          <TransactionTable
            emptyMessage={isLoadingTransactions ? 'Loading...' : 'No transactions yet'}
            transactions={recentTransactions}
          />
        </section>

        <ActivityFeed activities={recentActivity} />
      </section>

      <HelpInfo />
    </div>
  )
}
