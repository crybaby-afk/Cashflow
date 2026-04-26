import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  clearActivityLog,
  loadActivityLog,
  logFinanceActivity,
} from './activityStore.js'
import {
  loadFinanceSettings,
  resetFinanceSettings,
  saveOpeningBalance,
} from './settingsStore.js'
import {
  clearTransactions,
  deleteTransaction,
  loadTransactions,
  saveTransaction,
  updateTransaction,
} from './transactionStore.js'

function createLocalStorage() {
  const storage = new Map()

  return {
    clear() {
      storage.clear()
    },
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null
    },
    removeItem(key) {
      storage.delete(key)
    },
    setItem(key, value) {
      storage.set(key, String(value))
    },
  }
}

beforeEach(() => {
  global.window = { localStorage: createLocalStorage() }
})

test('saveTransaction adds a new transaction to local storage', async () => {
  const transactions = await saveTransaction({
    id: 'txn-1',
    type: 'in',
    amount: 4500,
    category: 'Fees',
    note: 'April fees',
    date: '2026-04-20',
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-20T08:00:00.000Z',
  })

  assert.equal(transactions.length, 1)
  assert.equal(transactions[0].category, 'Fees')
  assert.equal(transactions[0].amount, 4500)
})

test('updateTransaction edits an existing transaction in local storage', async () => {
  await saveTransaction({
    id: 'txn-1',
    type: 'out',
    amount: 1200,
    category: 'Supplies',
    note: 'Pens',
    date: '2026-04-20',
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-20T08:00:00.000Z',
  })

  const transactions = await updateTransaction({
    id: 'txn-1',
    type: 'out',
    amount: 1700,
    category: 'Supplies',
    note: 'Pens and books',
    date: '2026-04-20',
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-20T08:00:00.000Z',
  })

  assert.equal(transactions.length, 1)
  assert.equal(transactions[0].amount, 1700)
  assert.equal(transactions[0].note, 'Pens and books')
})

test('deleteTransaction removes a transaction from local storage', async () => {
  await saveTransaction({
    id: 'txn-1',
    type: 'in',
    amount: 4500,
    category: 'Fees',
    note: '',
    date: '2026-04-20',
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-20T08:00:00.000Z',
  })

  const transactions = await deleteTransaction('txn-1')

  assert.equal(transactions.length, 0)
})

test('reset flow clears transactions, settings, and activity logs', async () => {
  await saveOpeningBalance(9000)
  await saveTransaction({
    id: 'txn-1',
    type: 'in',
    amount: 4500,
    category: 'Fees',
    note: 'April fees',
    date: '2026-04-20',
    createdAt: '2026-04-20T08:00:00.000Z',
    updatedAt: '2026-04-20T08:00:00.000Z',
  })
  await logFinanceActivity({
    action: 'create',
    message: 'Created a test transaction.',
  })

  await Promise.all([clearTransactions(), resetFinanceSettings(), clearActivityLog()])
  const [transactions, settings, activity] = await Promise.all([
    loadTransactions([]),
    loadFinanceSettings(),
    loadActivityLog(),
  ])

  assert.equal(transactions.length, 0)
  assert.equal(settings.openingBalance, 0)
  assert.equal(activity.length, 0)
})
