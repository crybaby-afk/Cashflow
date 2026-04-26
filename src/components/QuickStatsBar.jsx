import { useMemo } from 'react'
import Tooltip from './Tooltip'
import { getTransactionSummary } from '../utils/transactionSummary'

function formatNumber(value) {
  return value.toLocaleString('en-KE')
}

const tooltipContent = {
  'Total Entries': 'Total number of transactions recorded in the cashbook since the beginning.',
  'This Month': 'Number of transactions recorded in the current month.',
  'Money In': 'Total income this period - fees, donations, grants received by the school.',
  'Money Out': 'Total expenses this period - supplies, utilities, maintenance, staff costs.',
  'Balance': 'Current cash position: Opening Balance + Money In - Money Out.',
}

export default function QuickStatsBar({ openingBalance, transactions }) {
  const summary = useMemo(() => {
    return getTransactionSummary(transactions, openingBalance)
  }, [openingBalance, transactions])

  const stats = useMemo(() => {
    const total = transactions.length
    const thisMonth = new Date().getTime()
    const thirtyDaysAgo = thisMonth - 30 * 24 * 60 * 60 * 1000
    const thisMonthCount = transactions.filter(
      (t) => new Date(t.date).getTime() >= thirtyDaysAgo
    ).length

    return { total, thisMonthCount }
  }, [transactions])

  return (
    <div className="quick-stats-bar" aria-label="Quick statistics">
      <div className="quick-stat">
        <Tooltip content={tooltipContent['Total Entries']}>
          <span className="quick-stat__label">Total Entries</span>
        </Tooltip>
        <strong className="quick-stat__value">{stats.total}</strong>
      </div>
      <div className="quick-stat">
        <Tooltip content={tooltipContent['This Month']}>
          <span className="quick-stat__label">This Month</span>
        </Tooltip>
        <strong className="quick-stat__value">{stats.thisMonthCount}</strong>
      </div>
      <div className="quick-stat">
        <Tooltip content={tooltipContent['Money In']}>
          <span className="quick-stat__label">Money In</span>
        </Tooltip>
        <strong className="quick-stat__value quick-stat__value--income">
          KES {formatNumber(summary.income)}
        </strong>
      </div>
      <div className="quick-stat">
        <Tooltip content={tooltipContent['Money Out']}>
          <span className="quick-stat__label">Money Out</span>
        </Tooltip>
        <strong className="quick-stat__value quick-stat__value--expense">
          KES {formatNumber(summary.expenses)}
        </strong>
      </div>
      <div className="quick-stat">
        <Tooltip content={tooltipContent['Balance']}>
          <span className="quick-stat__label">Balance</span>
        </Tooltip>
        <strong
          className={
            summary.balance >= 0
              ? 'quick-stat__value quick-stat__value--balance'
              : 'quick-stat__value quick-stat__value--deficit'
          }
        >
          KES {formatNumber(summary.balance)}
        </strong>
      </div>
    </div>
  )
}