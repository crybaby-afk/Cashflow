import { createClient } from '@supabase/supabase-js'

const env = import.meta.env ?? {}
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY
const adminEmails = (env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function isAllowedAdminEmail(email) {
  return adminEmails.includes((email || '').trim().toLowerCase())
}

function requireAdminSession(session) {
  const email = session?.user?.email || ''

  if (!isAllowedAdminEmail(email)) {
    throw new Error('This account is not approved for the finance desk.')
  }

  return session
}

async function getCurrentSession() {
  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    return null
  }

  try {
    return requireAdminSession(data.session)
  } catch {
    await supabase.auth.signOut()
    return null
  }
}

async function signInAdmin({ email, password }) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  try {
    return requireAdminSession(data.session)
  } catch (validationError) {
    await supabase.auth.signOut()
    throw validationError
  }
}

async function signOutAdmin() {
  if (!supabase) {
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

function onAuthStateChange(callback) {
  if (!supabase) {
    return () => {}
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      callback(null)
      return
    }

    try {
      callback(requireAdminSession(session))
    } catch {
      await supabase.auth.signOut()
      callback(null)
    }
  })

  return () => subscription.unsubscribe()
}

export {
  getCurrentSession,
  hasSupabaseConfig,
  isAllowedAdminEmail,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
  supabase,
}
