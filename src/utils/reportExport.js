import { formatCurrency } from './formatCurrency'
import { getTransactionSummary, sortTransactionsNewestFirst } from './transactionSummary'

function buildRows(transactions) {
  return sortTransactionsNewestFirst(transactions).map((transaction) => ({
    type: transaction.type === 'in' ? 'Money In' : 'Money Out',
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note || '',
    date: transaction.date,
  }))
}

export function downloadCashflowCsvReport({ openingBalance, transactions }) {
  const summary = getTransactionSummary(transactions, openingBalance)
  const rows = buildRows(transactions)
  const csvLines = [
    ['Upper Hill Academy Morit Cashflow Report'],
    ['Opening Balance', openingBalance],
    ['Money In', summary.income],
    ['Money Out', summary.expenses],
    ['Closing Balance', summary.balance],
    [],
    ['Type', 'Amount', 'Category', 'Note', 'Date'],
    ...rows.map((row) => [row.type, row.amount, row.category, row.note, row.date]),
  ]

  const csvContent = csvLines
    .map((line) => line.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'upperhill-morit-cashflow-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function printCashflowReport({ openingBalance, transactions }) {
  const summary = getTransactionSummary(transactions, openingBalance)
  const rows = buildRows(transactions)
  const reportWindow = window.open('', '_blank', 'width=980,height=720')

  if (!reportWindow) {
    return
  }

  const rowsMarkup = rows
    .map(
      (row) => `
        <tr>
          <td>${row.type}</td>
          <td>${formatCurrency(row.amount)}</td>
          <td>${row.category}</td>
          <td>${row.note || '-'}</td>
          <td>${row.date}</td>
        </tr>
      `,
    )
    .join('')

  reportWindow.document.write(`
    <html>
      <head>
        <title>Upper Hill Academy Morit Cashflow Report</title>
        <style>
          body { font-family: Georgia, serif; padding: 32px; color: #1f2937; }
          h1 { margin-bottom: 8px; }
          .summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 24px 0; }
          .card { border: 1px solid #d1d5db; border-radius: 16px; padding: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
          th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
        </style>
      </head>
      <body>
        <h1>Upper Hill Academy Morit</h1>
        <p>Cashflow Report</p>
        <div class="summary">
          <div class="card"><strong>Opening Balance</strong><div>${formatCurrency(openingBalance)}</div></div>
          <div class="card"><strong>Money In</strong><div>${formatCurrency(summary.income)}</div></div>
          <div class="card"><strong>Money Out</strong><div>${formatCurrency(summary.expenses)}</div></div>
          <div class="card"><strong>Closing Balance</strong><div>${formatCurrency(summary.balance)}</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>${rowsMarkup}</tbody>
        </table>
      </body>
    </html>
  `)
  reportWindow.document.close()
  reportWindow.focus()
  reportWindow.print()
}
