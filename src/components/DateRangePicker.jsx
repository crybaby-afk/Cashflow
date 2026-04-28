import { useState, useMemo } from 'react'

export default function DateRangePicker({ onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preset, setPreset] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const presets = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  const dateRange = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    
    switch (preset) {
      case 'today':
        return { start: today, end: today }
        
      case 'week': {
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        return { 
          start: weekStart.toISOString().slice(0, 10), 
          end: today 
        }
      }
        
      case 'month':
        return { 
          start: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`, 
          end: today 
        }
        
      case 'quarter': {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        return { 
          start: `${now.getFullYear()}-${String(quarterStart + 1).padStart(2, '0')}-01`, 
          end: today 
        }
      }
        
      case 'year':
        return { 
          start: `${now.getFullYear()}-01-01`, 
          end: today 
        }
        
      case 'custom':
        return { start: customStart, end: customEnd }
        
      default:
        return { start: '', end: '' }
    }
  }, [preset, customStart, customEnd])

  function handleApply() {
    if (onDateRangeChange) {
      onDateRangeChange(dateRange)
    }
    setIsOpen(false)
  }

  function handlePresetChange(value) {
    setPreset(value)
    if (value !== 'custom' && onDateRangeChange) {
      onDateRangeChange(dateRange)
    }
  }

  return (
    <div className="date-range-picker">
      <button 
        type="button" 
        className="date-range-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="date-range-label">
          {presets.find(p => p.value === preset)?.label || 'Select Range'}
        </span>
      </button>
      
      {isOpen && (
        <div className="date-range-dropdown" role="dialog" aria-label="Date range picker">
          <div className="date-range-options">
            {presets.map(option => (
              <button
                key={option.value}
                type="button"
                className={`date-range-option ${preset === option.value ? 'active' : ''}`}
                onClick={() => handlePresetChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {preset === 'custom' && (
            <div className="date-range-custom">
              <label>
                <span>From</span>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </label>
              <button 
                type="button" 
                className="apply-btn"
                onClick={handleApply}
                disabled={!customStart || !customEnd}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}