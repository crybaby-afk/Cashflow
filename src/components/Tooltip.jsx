import { useState } from 'react'

export default function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <span className="tooltip-content" role="tooltip">
          {content}
        </span>
      )}
    </span>
  )
}