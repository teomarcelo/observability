import type { Section } from '../../data/types'

interface Props {
  activeSection: Section
  onNavigate: (s: Section) => void
  optExpanded: boolean
  onToggleOpt: () => void
}

export function Sidebar({ activeSection, onNavigate, optExpanded, onToggleOpt }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">Build</div>
      <div className="nav-group">
        <div className="nav-item"><span className="nav-icon">&#x1F916;</span><span>Agents</span></div>
        <div className="nav-item"><span className="nav-icon">&#x1F9EA;</span><span>Tests</span></div>
        <div className="nav-item"><span className="nav-icon">&#x1F4DD;</span><span>Prompt Templates</span></div>
        <div className="nav-item"><span className="nav-icon">&#x1F4BE;</span><span>Data</span><span className="nav-chevron">&#9660;</span></div>
        <div className="nav-item"><span className="nav-icon">&#x1F9E0;</span><span>AI Models</span></div>
        <div className="nav-item"><span className="nav-icon">&#x1F4BB;</span><span>Agentforce DX</span></div>
      </div>

      <div className="nav-divider" />
      <div className="sidebar-header">Observe &amp; Optimize</div>
      <div className="nav-group">
        <div
          className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => onNavigate('analytics')}
        >
          <span className="nav-icon">&#x1F4C8;</span>
          <span>Analytics</span>
        </div>

        <div
          className={`nav-item ${optExpanded ? 'expanded' : ''} ${activeSection === 'insights' || activeSection === 'sessions' ? 'active' : ''}`}
          onClick={onToggleOpt}
        >
          <span className="nav-icon">&#x1F4C9;</span>
          <span>Optimization</span>
          <span className="nav-chevron">&#9650;</span>
        </div>
        <div className={`nav-sub ${optExpanded ? 'open' : ''}`}>
          <div
            className={`nav-sub-item ${activeSection === 'insights' ? 'active' : ''}`}
            onClick={() => onNavigate('insights')}
          >
            Insights
          </div>
          <div
            className={`nav-sub-item ${activeSection === 'sessions' ? 'active' : ''}`}
            onClick={() => onNavigate('sessions')}
          >
            Sessions &amp; Intents
          </div>
        </div>

        <div className="nav-divider" />

        <div
          className={`nav-item ${activeSection === 'scorers' ? 'active' : ''}`}
          onClick={() => onNavigate('scorers')}
        >
          <span className="nav-icon">&#x1F4CB;</span>
          <span>Scorers</span>
          <span className="sidebar-badge">Beta</span>
        </div>

        <div
          className={`nav-item ${activeSection === 'alerts' ? 'active' : ''}`}
          onClick={() => onNavigate('alerts')}
        >
          <span className="nav-icon">&#x1F514;</span>
          <span>Alerts</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button>&#x21A4; Collapse</button>
      </div>
    </nav>
  )
}
