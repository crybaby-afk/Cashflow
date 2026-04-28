import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useKeyboardShortcuts({ 
  onNewEntry, 
  onSearch,
  onEscape,
  enabled = true 
}) {
  const navigate = useNavigate()

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return
    
    // Ignore if typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }

    switch (event.key.toLowerCase()) {
      case 'n':
        // New entry
        event.preventDefault()
        if (onNewEntry) {
          onNewEntry()
        } else {
          navigate('/add')
        }
        break
        
      case '/':
        // Focus search
        event.preventDefault()
        if (onSearch) {
          onSearch()
        }
        break
        
      case 'escape':
        // Escape/back
        event.preventDefault()
        if (onEscape) {
          onEscape()
        } else {
          navigate('/')
        }
        break
        
      case 'd':
        // Dashboard
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          navigate('/')
        }
        break
        
      case 't':
        // Transactions
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          navigate('/transactions')
        }
        break
        
      case 's':
        // Settings
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          navigate('/settings')
        }
        break
        
      default:
        break
    }
  }, [enabled, navigate, onNewEntry, onSearch, onEscape])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    shortcuts: [
      { key: 'N', action: 'New Entry', path: '/add' },
      { key: '/', action: 'Search', target: 'search' },
      { key: 'Esc', action: 'Go Home', path: '/' },
      { key: 'Ctrl+D', action: 'Dashboard', path: '/' },
      { key: 'Ctrl+T', action: 'Transactions', path: '/transactions' },
      { key: 'Ctrl+S', action: 'Settings', path: '/settings' },
    ]
  }
}