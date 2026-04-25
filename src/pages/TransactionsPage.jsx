import { useEffect, useMemo, useState } from 'react'
import TransactionTable from '../components/TransactionTable'
import { expenseCategories, incomeCategories } from '../data/mockTransactions'
import { sortTransactionsNewestFirst } from '../utils/transactionSummary'

const filterOptions = [
  { label: 'All Transactions', value: 'all' },
  { label: 'Money In', value: 'in' },
  { label: 'Money Out', value: 'out' },
]

function createEditForm(transaction) {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: String(transaction.amount),
    category: transaction.category,
    date: transaction.date,
    note: transaction.note,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  }
}

export default function TransactionsPage({
  adminName,
  isLoadingTransactions,
  onDeleteTransaction,
  onUpdateTransaction,
  transactions,
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [formMessage, setFormMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredTransactions = useMemo(() => {
    const sortedTransactions = sortTransactionsNewestFirst(transactions)
    if (activeFilter === 'all') {
      return sortedTransactions
    }

    return sortedTransactions.filter((transaction) => transaction.type === activeFilter)
  }, [activeFilter, transactions])

  const categoryOptions = useMemo(() => {
    if (!editForm) {
      return incomeCategories
    }

    return editForm.type === 'in' ? incomeCategories : expenseCategories
  }, [editForm])

  useEffect(() => {
    if (!editingTransaction) {
      return
    }

    const freshTransaction = transactions.find((item) => item.id === editingTransaction.id)
    if (!freshTransaction) {
      setEditingTransaction(null)
      setEditForm(null)
      setFormMessage('')
      return
    }

    setEditingTransaction(freshTransaction)
    setEditForm(createEditForm(freshTransaction))
  }, [editingTransaction, transactions])

  function handleStartEdit(transaction) {
    setEditingTransaction(transaction)
    setEditForm(createEditForm(transaction))
    setFormMessage('')
  }

  function handleEditChange(event) {
    const { name, value } = event.target

    if (name === 'type') {
      const nextCategories = value === 'in' ? incomeCategories : expenseCategories
      setEditForm((currentForm) => ({
        ...currentForm,
        type: value,
        category: nextCategories.includes(currentForm.category)
          ? currentForm.category
          : nextCategories[0],
      }))
      return
    }

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmitEdit(event) {
    event.preventDefault()
    setFormMessage('')

    const amount = Number(editForm.amount)
    if (!editForm.date || !editForm.category || Number.isNaN(amount) || amount <= 0) {
      setFormMessage('Amount, category, and date must be valid before updating.')
      return
    }

    setIsSaving(true)
    const result = await onUpdateTransaction({
      ...editForm,
      amount,
      note: editForm.note.trim(),
    })
    setIsSaving(false)

    if (!result.ok) {
      setFormMessage('The transaction could not be updated. Please try again.')
      return
    }

    setEditingTransaction(null)
    setEditForm(null)
    setFormMessage('')
  }

  async function handleDelete(transaction) {
    const shouldDelete = window.confirm(
      `Delete ${transaction.category} for KES ${transaction.amount.toLocaleString('en-KE')}?`,
    )

    if (!shouldDelete) {
      return
    }

    setIsDeleting(true)
    const result = await onDeleteTransaction(transaction.id)
    setIsDeleting(false)

    if (!result.ok) {
      window.alert('The transaction could not be deleted. Please try again.')
    }
  }

  function handleCloseEditor() {
    setEditingTransaction(null)
    setEditForm(null)
    setFormMessage('')
  }

  return (
    <div className="page-grid">
      <section className="content-card ledger-toolbar ledger-toolbar--school">
        <div>
          <p className="section-kicker">Cashbook</p>
          <h2>Hello, {adminName}. Review and correct UpperHill Morit's ledger here.</h2>
          <p className="muted-copy">
            Every movement lives in one place so you can filter, edit, and clean the books without
            losing sight of the school's real balance.
          </p>
        </div>

        <div className="filter-row" aria-label="Transaction type filters">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                activeFilter === option.value
                  ? 'filter-chip filter-chip--active'
                  : 'filter-chip'
              }
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="content-card content-card--ledger">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Recorded Entries</p>
            <h3>{filteredTransactions.length} transactions in the current view</h3>
          </div>
          <span className="pill">Sorted newest first</span>
        </div>
        <TransactionTable
          emptyMessage={isLoadingTransactions ? 'Loading transactions...' : undefined}
          onDelete={handleDelete}
          onEdit={handleStartEdit}
          transactions={filteredTransactions}
        />
      </section>

      {editingTransaction && editForm ? (
        <section className="content-card content-card--form">
          <div className="section-heading compact-heading">
            <div>
              <p className="section-kicker">Edit Entry</p>
              <h3>Update the selected transaction</h3>
            </div>
            <button type="button" className="text-link" onClick={handleCloseEditor}>
              Close editor
            </button>
          </div>

          <form className="transaction-form" onSubmit={handleSubmitEdit}>
            <label>
              <span>Transaction Type</span>
              <select name="type" value={editForm.type} onChange={handleEditChange}>
                <option value="in">Money In</option>
                <option value="out">Money Out</option>
              </select>
            </label>

            <label>
              <span>Category</span>
              <select name="category" value={editForm.category} onChange={handleEditChange}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Amount (KES)</span>
              <input
                type="number"
                name="amount"
                min="1"
                step="1"
                value={editForm.amount}
                onChange={handleEditChange}
              />
            </label>

            <label>
              <span>Date</span>
              <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
            </label>

            <label>
              <span>Note</span>
              <input type="text" name="note" value={editForm.note} onChange={handleEditChange} />
            </label>

            {formMessage ? <p className="form-message form-message--error">{formMessage}</p> : null}

            <div className="editor-actions editor-actions--wide">
              <button type="submit">{isSaving ? 'Updating...' : 'Save Changes'}</button>
              <button
                type="button"
                className="secondary-button"
                onClick={handleCloseEditor}
                disabled={isSaving || isDeleting}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
