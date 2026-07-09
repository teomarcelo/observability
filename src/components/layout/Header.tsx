export function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <svg viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#00A1E0" />
          <path d="M8 20c2-4 4-8 8-8s6 4 8 8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
        <span className="header-title">Agentforce Studio</span>
      </div>
      <div className="header-search">
        <span className="search-icon">&#x1F50D;</span>
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-icons">
        <span className="header-icon">&#x2606;</span>
        <span className="header-icon">&#x2795;</span>
        <span className="header-icon">&#x2753;</span>
        <span className="header-icon">&#x2699;</span>
        <span className="header-icon">&#x1F514;</span>
        <div className="header-avatar">U</div>
      </div>
    </header>
  )
}
