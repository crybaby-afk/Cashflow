import { formatCurrency } from '../utils/formatCurrency'

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export default function TransactionTable({
  transactions,
  emptyMessage,
  onDelete,
  onEdit,
}) {
  if (!transactions.length) {
    return (
      <div className="empty-state">
        <h3>{emptyMessage || 'No transactions match this view yet.'}</h3>
        <p>Add a new entry or switch filters to see more of the cashbook.</p>
      </div>
    )
  }

  return (
    <div className="table-card">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Note</th>
            <th>Date</th>
            {onEdit || onDelete ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <span
                  className={
                    transaction.type === 'in'
                      ? 'type-badge type-badge--in'
                      : 'type-badge type-badge--out'
                  }
                >
                  {transaction.type === 'in' ? 'Money In' : 'Money Out'}
                </span>
              </td>
              <td>{formatCurrency(transaction.amount)}</td>
              <td>{transaction.category}</td>
              <td>{transaction.note || '-'}</td>
              <td>{formatDate(transaction.date)}</td>
              {onEdit || onDelete ? (
                <td>
                  <div className="table-actions">
                    {onEdit ? (
                      <button
                        type="button"
                        className="table-action table-action--edit"
                        onClick={() => onEdit(transaction)}
                      >
                        Edit
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        className="table-action table-action--delete"
                        onClick={() => onDelete(transaction)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
