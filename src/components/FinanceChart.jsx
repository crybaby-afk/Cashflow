import { useMemo } from 'react'
import { getTransactionSummary, getTransactionsForMonth } from '../utils/transactionSummary'

function formatNumber(value) {
  return value.toLocaleString('en-KE')
}

export default function FinanceChart({ transactions, openingBalance, period = 'month' }) {
  const chartData = useMemo(() => {
    const now = new Date()
    const months = []
    
    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthTransactions = getTransactionsForMonth(transactions, date.toISOString().slice(0, 10))
      const summary = getTransactionSummary(monthTransactions, 0)
      
      months.push({
        month: date.toLocaleDateString('en-GB', { month: 'short' }),
        income: summary.income,
        expenses: summary.expenses,
        balance: summary.balance
      })
    }
    
    return months
  }, [transactions])

  const maxValue = useMemo(() => {
    const allValues = chartData.flatMap(d => [d.income, d.expenses])
    return Math.max(...allValues, 1)
  }, [chartData])

  const maxBalance = useMemo(() => {
    return Math.max(...chartData.map(d => Math.abs(d.balance)), 1)
  }, [chartData])

  if (!transactions.length) {
    return null
  }

  return (
    <div className="finance-chart" aria-label="Finance chart">
      <div className="chart-header">
        <h3>6-Month Overview</h3>
        <div className="chart-legend">
          <span className="legend-item legend-item--income">Income</span>
          <span className="legend-item legend-item--expense">Expenses</span>
        </div>
      </div>
      
      <div className="chart-body">
        {chartData.map((data, index) => (
          <div key={index} className="chart-bar-group">
            <div className="chart-bars">
              <div 
                className="chart-bar chart-bar--income"
                style={{ height: `${(data.income / maxValue) * 100}%` }}
                title={`Income: KES ${formatNumber(data.income)}`}
              />
              <div 
                className="chart-bar chart-bar--expense"
                style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                title={`Expenses: KES ${formatNumber(data.expenses)}`}
              />
            </div>
            <span className="chart-label">{data.month}</span>
            <span className={`chart-balance ${data.balance >= 0 ? 'positive' : 'negative'}`}>
              {data.balance >= 0 ? '+' : ''}{formatNumber(data.balance)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}