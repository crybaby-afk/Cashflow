import { useState, useMemo, useRef, useEffect } from 'react'

export default function SearchAutocomplete({ 
  transactions, 
  onSelect,
  placeholder = 'Search transactions...'
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    if (!query.trim() || !transactions.length) return []

    const lowerQuery = query.toLowerCase()
    
    // Get unique categories
    const categories = [...new Set(transactions.map(t => t.category))]
    
    // Get unique notes
    const notes = [...new Set(
      transactions
        .map(t => t.note)
        .filter(Boolean)
    )]
    
    // Combine and filter
    const allSuggestions = [
      ...categories.map(c => ({ type: 'category', value: c })),
      ...notes.map(n => ({ type: 'note', value: n })),
      ...transactions.map(t => ({ type: 'amount', value: t.amount.toString() })),
      ...transactions.map(t => ({ type: 'date', value: t.date })),
    ]
    
    return allSuggestions
      .filter(s => s.value.toLowerCase().includes(lowerQuery))
      .slice(0, 8)
  }, [query, transactions])

  function handleInputChange(e) {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0)
    setSelectedIndex(-1)
  }

  function handleKeyDown(e) {
    if (!isOpen || !suggestions.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
        
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex])
        }
        break
        
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
        
      default:
        break
    }
  }

  function handleSelect(suggestion) {
    setQuery(suggestion.value)
    setIsOpen(false)
    if (onSelect) {
      onSelect(suggestion)
    }
  }

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="search-autocomplete" ref={inputRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query && setIsOpen(true)}
        placeholder={placeholder}
        className="search-input"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="search-suggestions"
      />
      
      {isOpen && suggestions.length > 0 && (
        <ul 
          id="search-suggestions" 
          className="search-suggestions" 
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${index}`}
              className={`search-suggestion ${index === selectedIndex ? 'selected' : ''}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(suggestion)}
            >
              <span className="suggestion-type">{suggestion.type}</span>
              <span className="suggestion-value">{suggestion.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}