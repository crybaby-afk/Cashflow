import { useState, useEffect } from 'react'
import Icon from './Icon'

const themes = ['light', 'dark', 'dim']

export default function ThemeToggle({ onThemeChange }) {
  const [currentTheme, setCurrentTheme] = useState('light')

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('upperhill-theme')
    if (saved && themes.includes(saved)) {
      setCurrentTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const newTheme = prefersDark ? 'dark' : 'light'
      setCurrentTheme(newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }, [])

  function cycleTheme() {
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    
    setCurrentTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('upperhill-theme', nextTheme)
    
    if (onThemeChange) {
      onThemeChange(nextTheme)
    }
  }

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    dim: 'Dim'
  }

  return (
    <button 
      type="button" 
      className="theme-toggle"
      onClick={cycleTheme}
      title={`Current: ${themeLabels[currentTheme]}. Click to change.`}
      aria-label={`Switch theme. Current: ${themeLabels[currentTheme]}`}
    >
      <Icon name={currentTheme === 'light' ? 'sun' : currentTheme === 'dark' ? 'moon' : 'star'} size={16} />
      <span className="theme-label">{themeLabels[currentTheme]}</span>
    </button>
  )
}