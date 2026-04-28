import { useMemo } from 'react'
import { getTransactionSummary } from '../utils/transactionSummary'

function formatNumber(value) {
  return value.toLocaleString('en-KE')
}

export default function BudgetAlerts({ 
  transactions, 
  openingBalance, 
  monthlyBudget = 0,
  showAlerts = true 
}) {
  const alerts = useMemo(() => {
    if (!showAlerts || !transactions.length) return []
    
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7)
    
    const monthTransactions = transactions.filter(t => 
      t.date && t.date.startsWith(currentMonth)
    )
    
    const summary = getTransactionSummary(monthTransactions, 0)
    const alertList = []
    
    // Check if monthly budget is set
    if (monthlyBudget > 0) {
      const spent = summary.expenses
      const percentage = (spent / monthlyBudget) * 100
      
      if (percentage >= 100) {
        alertList.push({
          type: 'danger',
          title: 'Budget Exceeded',
          message: `Expenses (KES ${formatNumber(spent)}) have exceeded monthly budget (KES ${formatNumber(monthlyBudget)})`
        })
      } else if (percentage >= 80) {
        alertList.push({
          type: 'warning',
          title: 'Budget Warning',
          message: `Expenses are at ${Math.round(percentage)}% of monthly budget (KES ${formatNumber(monthlyBudget)})`
        })
      } else if (percentage >= 50) {
        alertList.push({
          type: 'info',
          title: 'Budget Notice',
          message: `Expenses are at ${Math.round(percentage)}% of monthly budget`
        })
      }
    }
    
    // Check for deficit
    if (summary.balance < 0) {
      alertList.push({
        type: 'danger',
        title: 'Deficit Alert',
        message: `Current month shows a deficit of KES ${formatNumber(Math.abs(summary.balance))}`
      })
    }
    
    // Check for high expenses
    if (summary.expenses > openingBalance * 0.5 && openingBalance > 0) {
      alertList.push({
        type: 'warning',
        title: 'High Spending',
        message: `Expenses exceed 50% of opening balance`
      })
    }
    
    return alertList
  }, [transactions, openingBalance, monthlyBudget, showAlerts])

  if (!alerts.length) {
    return null
  }

  return (
    <div className="budget-alerts" aria-label="Budget alerts">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert-item alert-item--${alert.type}`}>
          <strong>{alert.title}</strong>
          <p>{alert.message}</p>
        </div>
      ))}
    </div>
  )
}