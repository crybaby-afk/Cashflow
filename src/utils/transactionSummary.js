export function getTransactionSummary(transactions, openingBalance = 0) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'in') {
        summary.income += transaction.amount
      } else {
        summary.expenses += transaction.amount
      }

      summary.balance = summary.openingBalance + summary.income - summary.expenses
      return summary
    },
    {
      income: 0,
      expenses: 0,
      openingBalance,
      balance: openingBalance,
    },
  )
}

export function sortTransactionsNewestFirst(transactions) {
  return [...transactions].sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date)
    if (dateCompare !== 0) {
      return dateCompare
    }

    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function getLatestTransactionDate(transactions) {
  const [latestTransaction] = sortTransactionsNewestFirst(transactions)
  return latestTransaction ? new Date(latestTransaction.date) : new Date()
}

export function getTransactionsForMonth(transactions, referenceDate) {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)

    return (
      transactionDate.getFullYear() === referenceDate.getFullYear() &&
      transactionDate.getMonth() === referenceDate.getMonth()
    )
  })
}
