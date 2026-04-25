import { hasSupabaseConfig, supabase } from './supabase'

const STORAGE_KEY = 'upperhill-morit-cashflow-activity'
const TABLE_NAME = 'activity_logs'

function getLocalActivity() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
}

function setLocalActivity(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function sortNewestFirst(items) {
  return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function normalizeActivity(item) {
  return {
    id: item.id,
    action: item.action,
    message: item.message,
    metadata: item.metadata || {},
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
  }
}

export async function loadActivityLog() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      const normalized = data.map(normalizeActivity)
      setLocalActivity(normalized)
      return normalized
    }
  }

  return sortNewestFirst(getLocalActivity()).slice(0, 20)
}

export async function logFinanceActivity({ action, message, metadata = {} }) {
  const entry = {
    id: crypto.randomUUID(),
    action,
    message,
    metadata,
    createdAt: new Date().toISOString(),
  }

  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        action: entry.action,
        message: entry.message,
        metadata: entry.metadata,
        created_at: entry.createdAt,
      })
      .select()
      .single()

    if (!error && data) {
      const saved = normalizeActivity(data)
      const nextItems = sortNewestFirst([saved, ...getLocalActivity()]).slice(0, 20)
      setLocalActivity(nextItems)
      return nextItems
    }
  }

  const nextItems = sortNewestFirst([entry, ...getLocalActivity()]).slice(0, 20)
  setLocalActivity(nextItems)
  return nextItems
}

export async function clearActivityLog() {
  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from(TABLE_NAME).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      throw error
    }
  }

  setLocalActivity([])
  return []
}
