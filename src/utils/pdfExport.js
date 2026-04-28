import { formatCurrency } from '../utils/formatCurrency'

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function formatNumber(value) {
  return value.toLocaleString('en-KE')
}

export function generatePDFReport({ openingBalance, transactions, title = 'UpperHill Morit Finance Report' }) {
  const totalIncome = transactions
    .filter(t => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = openingBalance + totalIncome - totalExpenses
  const today = new Date().toISOString().slice(0, 10)

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      padding: 40px; 
      color: #172033;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #224588;
    }
    .header h1 {
      font-size: 24px;
      color: #224588;
      margin-bottom: 5px;
    }
    .header p {
      color: #5f6b78;
      font-size: 14px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-box {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }
    .summary-box span {
      display: block;
      font-size: 12px;
      color: #5f6b78;
      margin-bottom: 5px;
    }
    .summary-box strong {
      font-size: 18px;
      color: #172033;
    }
    .summary-box.income strong { color: #0d8b52; }
    .summary-box.expense strong { color: #b04661; }
    .summary-box.balance strong { color: #224588; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #224588;
      color: white;
      padding: 12px 10px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 13px;
    }
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    .type-in { color: #0d8b52; }
    .type-out { color: #b04661; }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #5f6b78;
    }
    
    @media print {
      body { padding: 20px; }
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Upper Hill Academy Morit</h1>
    <p>Finance Department - Official Report</p>
    <p>Generated on ${formatDate(today)}</p>
  </div>
  
  <div class="summary-grid">
    <div class="summary-box">
      <span>Opening Balance</span>
      <strong>KES ${formatNumber(openingBalance)}</strong>
    </div>
    <div class="summary-box income">
      <span>Total Income</span>
      <strong>KES ${formatNumber(totalIncome)}</strong>
    </div>
    <div class="summary-box expense">
      <span>Total Expenses</span>
      <strong>KES ${formatNumber(totalExpenses)}</strong>
    </div>
    <div class="summary-box balance">
      <span>Closing Balance</span>
      <strong>KES ${formatNumber(balance)}</strong>
    </div>
  </div>
  
  <h2>Transaction Details</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Category</th>
        <th>Note</th>
        <th>Amount (KES)</th>
      </tr>
    </thead>
    <tbody>
      ${transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(t => `
          <tr>
            <td>${formatDate(t.date)}</td>
            <td class="type-${t.type}">${t.type === 'in' ? 'Money In' : 'Money Out'}</td>
            <td>${t.category}</td>
            <td>${t.note || '-'}</td>
            <td>${formatNumber(t.amount)}</td>
          </tr>
        `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>This is an official financial document from Upper Hill Academy Morit Cashflow System.</p>
    <p>Total Transactions: ${transactions.length} | Report Date: ${formatDate(today)}</p>
  </div>
</body>
</html>
`

  return htmlContent
}

export function printPDFReport(data) {
  const html = generatePDFReport(data)
  const printWindow = window.open('', '_blank')
  
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

export function downloadPDFReport(data, filename = 'finance-report.html') {
  const html = generatePDFReport(data)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}