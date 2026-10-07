interface Props {
  appTab: string
  onOpenModal: (key: string) => void
}

export function Header({ appTab, onOpenModal }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="waffle" aria-label="App Launcher" title="App Launcher" onClick={() => onOpenModal('hdr-app-launcher')}>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </button>
        <button className="header-btn" onClick={() => onOpenModal('hdr-brand')} aria-label="Agentforce Studio">
          <svg className="sf-cloud" viewBox="0 0 32 22" fill="none" aria-hidden>
            <path d="M24 9.5a6 6 0 0 0-11.3-2A5 5 0 0 0 5 12a5 5 0 0 0 5 5h13a4.5 4.5 0 0 0 1-8.9Z" fill="#00A1E0" />
          </svg>
          <span className="header-title">Agentforce Studio</span>
        </button>
        <button className="app-tab" onClick={() => onOpenModal('hdr-app-tab')}>{appTab}<span className="app-tab-caret">&#9662;</span></button>
        <button className="header-btn" onClick={() => onOpenModal('hdr-show-nav-menu')} aria-label="Show Navigation Menu">
          Show Navigation Menu
        </button>
      </div>
      <div className="header-search" onClick={() => onOpenModal('hdr-search')} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenModal('hdr-search') }} aria-label="Global Search">
        <span className="search-icon">&#x1F50D;</span>
        <input type="text" placeholder="Search..." readOnly tabIndex={-1} />
      </div>
      <div className="header-icons">
        <button className="header-icon" title="Favorites" aria-label="Favorites" onClick={() => onOpenModal('hdr-favorites')}>&#9733;</button>
        <button className="header-icon" title="Global Actions" aria-label="Global Actions" onClick={() => onOpenModal('hdr-global-actions')}>&#43;</button>
        <button className="header-icon" title="Guidance Center" aria-label="Guidance Center" onClick={() => onOpenModal('hdr-guidance')}>&#9729;</button>
        <button className="header-icon" title="Help" aria-label="Help" onClick={() => onOpenModal('hdr-help')}>&#63;</button>
        <button className="header-icon" title="Setup" aria-label="Setup" onClick={() => onOpenModal('hdr-setup')}>&#9881;</button>
        <button className="header-icon" title="Notifications" aria-label="Notifications" onClick={() => onOpenModal('hdr-notifications')}>&#128276;</button>
        <button className="header-avatar" title="View profile" aria-label="Profile" onClick={() => onOpenModal('hdr-profile')}>
          <span>&#128100;</span>
        </button>
      </div>
    </header>
  )
}
