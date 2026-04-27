import Icon from './Icon'
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
        <h3>{emptyMessage || 'No transactions'}</h3>
        <p>Add a new entry to get started.</p>
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
              <td data-label="Type">
                <span
                  className={
                    transaction.type === 'in'
                      ? 'type-badge type-badge--in'
                      : 'type-badge type-badge--out'
                  }
                >
                  <Icon name={transaction.type === 'in' ? 'income' : 'expense'} size={14} />
                  {transaction.type === 'in' ? 'Money In' : 'Money Out'}
                </span>
              </td>
              <td data-label="Amount">{formatCurrency(transaction.amount)}</td>
              <td data-label="Category">{transaction.category}</td>
              <td data-label="Note">{transaction.note || '-'}</td>
              <td data-label="Date">{formatDate(transaction.date)}</td>
              {onEdit || onDelete ? (
                <td data-label="Actions">
                  <div className="table-actions">
                    {onEdit ? (
                      <button
                        type="button"
                        className="table-action table-action--edit"
                        onClick={() => onEdit(transaction)}
                      >
                        <Icon name="settings" size={14} />
                        Edit
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        className="table-action table-action--delete"
                        onClick={() => onDelete(transaction)}
                      >
                        <Icon name="reset" size={14} />
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
