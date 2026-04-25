import { hasSupabaseConfig, supabase } from './supabase'

const STORAGE_KEY = 'upperhill-morit-cashflow-transactions'
const TABLE_NAME = 'transactions'

function sortTransactionsNewestFirst(transactions) {
  return [...transactions].sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date)
    if (dateCompare !== 0) {
      return dateCompare
    }

    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

function normalizeTransaction(data) {
  return {
    id: data.id,
    type: data.type,
    amount: Number(data.amount),
    category: data.category,
    note: data.note || '',
    date: data.date,
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt || data.created_at || new Date().toISOString(),
  }
}

function getLocalTransactions() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}

function setLocalTransactions(transactions) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

function replaceTransactionInList(transactions, transaction) {
  return sortTransactionsNewestFirst([
    transaction,
    ...transactions.filter((item) => item.id !== transaction.id),
  ])
}

export async function loadTransactions(seedTransactions = []) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data?.length) {
      const normalizedTransactions = data.map(normalizeTransaction)
      setLocalTransactions(normalizedTransactions)
      return normalizedTransactions
    }
  }

  const storedTransactions = getLocalTransactions()
  if (storedTransactions.length) {
    return sortTransactionsNewestFirst(storedTransactions)
  }

  setLocalTransactions(seedTransactions)
  return seedTransactions
}

export async function saveTransaction(transaction) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        note: transaction.note,
        date: transaction.date,
        created_at: transaction.createdAt,
        updated_at: transaction.updatedAt,
      })
      .select()
      .single()

    if (!error && data) {
      const savedTransaction = normalizeTransaction(data)
      const nextTransactions = replaceTransactionInList(getLocalTransactions(), savedTransaction)
      setLocalTransactions(nextTransactions)
      return nextTransactions
    }
  }

  const nextTransactions = replaceTransactionInList(getLocalTransactions(), transaction)
  setLocalTransactions(nextTransactions)
  return nextTransactions
}

export async function updateTransaction(transaction) {
  const updatedTransaction = {
    ...transaction,
    amount: Number(transaction.amount),
    updatedAt: new Date().toISOString(),
  }

  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        type: updatedTransaction.type,
        amount: updatedTransaction.amount,
        category: updatedTransaction.category,
        note: updatedTransaction.note,
        date: updatedTransaction.date,
        updated_at: updatedTransaction.updatedAt,
      })
      .eq('id', updatedTransaction.id)
      .select()
      .single()

    if (!error && data) {
      const savedTransaction = normalizeTransaction(data)
      const nextTransactions = replaceTransactionInList(getLocalTransactions(), savedTransaction)
      setLocalTransactions(nextTransactions)
      return nextTransactions
    }
  }

  const nextTransactions = replaceTransactionInList(getLocalTransactions(), updatedTransaction)
  setLocalTransactions(nextTransactions)
  return nextTransactions
}

export async function deleteTransaction(transactionId) {
  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', transactionId)

    if (error) {
      throw error
    }
  }

  const nextTransactions = sortTransactionsNewestFirst(
    getLocalTransactions().filter((transaction) => transaction.id !== transactionId),
  )
  setLocalTransactions(nextTransactions)
  return nextTransactions
}
