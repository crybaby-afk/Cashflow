import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { expenseCategories, incomeCategories } from '../data/mockTransactions'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getInitialFormState() {
  return {
    type: 'in',
    amount: '',
    category: incomeCategories[0],
    date: getTodayDate(),
    note: '',
  }
}

export default function AddTransactionPage({ adminName, onAddTransaction, openingBalance }) {
  const [formData, setFormData] = useState(getInitialFormState)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const categoryOptions = useMemo(
    () => (formData.type === 'in' ? incomeCategories : expenseCategories),
    [formData.type],
  )

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'type') {
      const nextCategories = value === 'in' ? incomeCategories : expenseCategories
      setFormData((currentFormData) => ({
        ...currentFormData,
        type: value,
        category: nextCategories[0],
      }))
      return
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const amount = Number(formData.amount)

    if (!formData.date || !formData.category || Number.isNaN(amount)) {
      setErrorMessage('Amount, category, and date are required before saving.')
      return
    }

    if (amount <= 0) {
      setErrorMessage('Amount must be greater than zero.')
      return
    }

    setIsSaving(true)
    const result = await onAddTransaction({
      ...formData,
      amount,
    })
    setIsSaving(false)

    if (!result?.ok) {
      setErrorMessage('The transaction could not be saved. Please try again.')
      return
    }

    setFormData({
      type: formData.type,
      amount: '',
      category: formData.type === 'in' ? incomeCategories[0] : expenseCategories[0],
      date: getTodayDate(),
      note: '',
    })
    setSuccessMessage('Transaction saved. UpperHill finance records are now updated.')
  }

  return (
    <div className="page-grid two-column-layout">
      <section className="content-card form-intro form-intro--school">
        <p className="section-kicker">Add Entry</p>
        <h2>New Transaction</h2>
        <p className="muted-copy">
          Record money in or out for the school.
        </p>
        <div className="status-strip single-column-strip">
          <article className="status-tile">
            <span>Opening Balance</span>
            <strong>KES {Number(openingBalance).toLocaleString('en-KE')}</strong>
            <p>From Settings</p>
          </article>
        </div>
      </section>

      <section className="content-card content-card--form">
        <div className="section-heading compact-heading">
          <div>
            <p className="section-kicker">Details</p>
            <h3>New Entry</h3>
          </div>
          <Link className="text-link" to="/transactions">
            View All
          </Link>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <label>
            <span>Type</span>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="in">Money In</option>
              <option value="out">Money Out</option>
            </select>
          </label>

          <label>
            <span>Category</span>
            <select name="category" value={formData.category} onChange={handleChange}>
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
              placeholder="5000"
              value={formData.amount}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Date</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </label>

          <label>
            <span>Note</span>
            <input
              type="text"
              name="note"
              placeholder="Optional note"
              value={formData.note}
              onChange={handleChange}
            />
          </label>

          {errorMessage ? <p className="form-message form-message--error">{errorMessage}</p> : null}
          {successMessage ? <p className="form-message form-message--success">{successMessage}</p> : null}

          <div className="editor-actions editor-actions--wide">
            <button type="submit">{isSaving ? 'Saving...' : 'Save Transaction'}</button>
            <Link className="secondary-button" to="/transactions">
              Review Cashbook
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}
