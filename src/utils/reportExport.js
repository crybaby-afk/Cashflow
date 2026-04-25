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

function getReportDate() {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date())
}

export function downloadCashflowCsvReport({ openingBalance, transactions }) {
  const summary = getTransactionSummary(transactions, openingBalance)
  const rows = buildRows(transactions)
  const csvLines = [
    ['Upper Hill Academy Morit Cashflow Report'],
    ['Generated On', getReportDate()],
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
  const reportWindow = window.open('', '_blank', 'width=1080,height=800')

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

  const logoUrl = `${window.location.origin}/upperhill-lockup.svg`

  reportWindow.document.write(`
    <html>
      <head>
        <title>Upper Hill Academy Morit Cashflow Report</title>
        <style>
          :root {
            --ink: #132142;
            --muted: #586274;
            --line: #d7dce4;
            --paper: #f8f5ef;
            --blue: #153062;
            --green: #0b5a38;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 28px;
            color: var(--ink);
            background: white;
            font-family: 'Segoe UI', sans-serif;
          }
          .report-shell {
            border: 1px solid var(--line);
            border-radius: 24px;
            overflow: hidden;
          }
          .report-header {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 20px;
            padding: 24px;
            background: linear-gradient(135deg, #0f1d38 0%, #153062 60%, #0b5a38 100%);
            color: #f8f7f2;
            align-items: center;
          }
          .report-header img {
            width: 100%;
            max-width: 190px;
            justify-self: center;
            background: rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 12px;
          }
          .report-header h1 {
            margin: 0 0 8px;
            font-family: Georgia, serif;
            font-size: 36px;
            line-height: 1;
          }
          .report-header p {
            margin: 0;
            color: rgba(248,247,242,0.86);
            max-width: 56ch;
          }
          .report-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 16px;
          }
          .report-meta span {
            display: inline-flex;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.14);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .report-body {
            padding: 22px;
            background: var(--paper);
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 20px;
          }
          .card {
            background: white;
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 16px;
          }
          .card span {
            display: block;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--blue);
          }
          .card strong {
            display: block;
            margin-top: 10px;
            font-size: 24px;
            font-family: Georgia, serif;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 1px solid var(--line);
            border-radius: 18px;
            overflow: hidden;
          }
          th, td {
            padding: 12px 14px;
            border-bottom: 1px solid #e7ebf0;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #edf2f9;
            color: var(--blue);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          tr:last-child td {
            border-bottom: 0;
          }
          .signature-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
            margin-top: 30px;
          }
          .signature-box {
            padding-top: 18px;
            border-top: 1px solid #9ba8ba;
            color: var(--muted);
          }
          @media print {
            body { padding: 0; }
            .report-shell { border: 0; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="report-shell">
          <div class="report-header">
            <img src="${logoUrl}" alt="Upper Hill Academy Morit logo" />
            <div>
              <h1>Upper Hill Academy Morit Cashflow Report</h1>
              <p>
                Official finance summary for the school bursar and administration, showing
                opening balance, recorded income, expenses, and current closing position.
              </p>
              <div class="report-meta">
                <span>Generated ${getReportDate()}</span>
                <span>Sailing to Success</span>
                <span>School Finance Desk</span>
              </div>
            </div>
          </div>

          <div class="report-body">
            <div class="summary">
              <div class="card"><span>Opening Balance</span><strong>${formatCurrency(openingBalance)}</strong></div>
              <div class="card"><span>Money In</span><strong>${formatCurrency(summary.income)}</strong></div>
              <div class="card"><span>Money Out</span><strong>${formatCurrency(summary.expenses)}</strong></div>
              <div class="card"><span>Closing Balance</span><strong>${formatCurrency(summary.balance)}</strong></div>
            </div>

            <table class="report-table">
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

            <div class="signature-row">
              <div class="signature-box">Prepared by: ______________________________</div>
              <div class="signature-box">Approved by: ______________________________</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `)
  reportWindow.document.close()
  reportWindow.focus()
  reportWindow.print()
}
