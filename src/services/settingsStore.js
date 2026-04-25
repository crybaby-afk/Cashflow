import { hasSupabaseConfig, supabase } from './supabase'

const STORAGE_KEY = 'upperhill-morit-cashflow-settings'
const TABLE_NAME = 'finance_settings'
const SETTINGS_ROW_ID = 1

function getLocalSettings() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{"openingBalance":0}')
}

function setLocalSettings(settings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export async function loadFinanceSettings() {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', SETTINGS_ROW_ID)
      .single()

    if (!error && data) {
      const settings = {
        openingBalance: Number(data.opening_balance || 0),
      }
      setLocalSettings(settings)
      return settings
    }
  }

  return getLocalSettings()
}

export async function saveOpeningBalance(openingBalance) {
  const nextSettings = {
    openingBalance: Number(openingBalance),
  }

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(
        {
          id: SETTINGS_ROW_ID,
          opening_balance: nextSettings.openingBalance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )

    if (error) {
      throw error
    }
  }

  setLocalSettings(nextSettings)
  return nextSettings
}

export async function resetFinanceSettings() {
  return saveOpeningBalance(0)
}
