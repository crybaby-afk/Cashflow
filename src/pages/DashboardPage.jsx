import { useMemo, useState } from 'react'
import ActivityFeed from '../components/ActivityFeed'
import QuickActionCard from '../components/QuickActionCard'
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
          <h2>Hello, {adminName}. Here is UpperHill Morit's live cash position.</h2>
          <p className="muted-copy">
            The opening balance now sits inside the finance model, so your totals reflect where
            the school books actually began before new income and expenses were added.
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
          <span>{period === 'month' ? 'Monthly closing position' : 'Overall closing position'}</span>
          <strong>KES {formatNumber(summary.balance)}</strong>
          <p>
            {isDeficit
              ? `Expenses are above available funds by KES ${formatNumber(deficitAmount)}.`
              : 'Available funds still cover the recorded expenses in this view.'}
          </p>
        </div>

        <div className="hero-sidecard">
          <p className="section-kicker">Cashbook Rule</p>
          <h3>Opening balance + money in - money out</h3>
          <p>
            {isLoadingTransactions
              ? 'Loading school records now.'
              : 'UpperHill totals are recalculated from source entries every time.'}
          </p>
        </div>
      </section>

      <section className="summary-grid" aria-label="Financial summary">
        <SummaryCard
          label="Opening Balance"
          amount={summary.openingBalance}
          tone="neutral"
          helperText="Starting amount before this view's transactions"
        />
        <SummaryCard
          label="Money In"
          amount={summary.income}
          tone="income"
          helperText="All income recorded in this view"
        />
        <SummaryCard
          label="Money Out"
          amount={summary.expenses}
          tone="expense"
          helperText="All expenses recorded in this view"
        />
        <SummaryCard
          label={isDeficit ? 'Current Deficit' : 'Closing Balance'}
          amount={summary.balance}
          tone={isDeficit ? 'alert' : 'balance'}
          helperText={isDeficit ? 'Spending is higher than available funds' : 'Remaining funds after income and expenses'}
        />
      </section>

      <section className="status-strip" aria-label="Dashboard insights">
        <article className="status-tile">
          <span>Current Scope</span>
          <strong>{scopeLabel}</strong>
          <p>{period === 'month' ? 'Focused on the latest transaction month.' : 'Using every record in the cashbook.'}</p>
        </article>
        <article className="status-tile">
          <span>Entries in View</span>
          <strong>{scopedTransactions.length}</strong>
          <p>Transactions are sorted newest first in the ledger.</p>
        </article>
        <article className="status-tile">
          <span>UpperHill Rule</span>
          <strong>Opening + In - Out</strong>
          <p>The system recalculates totals from source records every time.</p>
        </article>
      </section>

      <section className="actions-grid" aria-label="Quick actions">
        <QuickActionCard
          title="Record Income"
          description="Capture fees, donations, grants, and any other money received by the school."
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
          title="Manage Settings"
          description="Update the opening balance, export reports, and prepare the app for school use."
          to="/settings"
          accent="balance"
        />
      </section>

      <section className="dashboard-secondary-grid">
        <section className="content-card content-card--ledger">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Recent Transactions</p>
              <h3>Latest activity from the UpperHill finance desk.</h3>
            </div>
            <span className="pill">{recentTransactions.length} latest entries</span>
          </div>
          <TransactionTable
            emptyMessage={isLoadingTransactions ? 'Loading transactions...' : undefined}
            transactions={recentTransactions}
          />
        </section>

        <ActivityFeed activities={recentActivity} />
      </section>
    </div>
  )
}
