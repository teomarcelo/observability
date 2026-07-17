import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string
  options: string[]
  onChange: (v: string) => void
  width?: number
  ariaLabel?: string
}

// SLDS-style combobox: button shows current value; click opens a listbox.
export function Dropdown({ value, options, onChange, width, ariaLabel }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="dd" ref={ref} style={width ? { width } : undefined}>
      <button
        type="button"
        className="dd-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="dd-value">{value}</span>
        <span className="dd-caret">&#9662;</span>
      </button>
      {open && (
        <ul className="dd-list" role="listbox">
          {options.map(opt => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`dd-option ${opt === value ? 'selected' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
