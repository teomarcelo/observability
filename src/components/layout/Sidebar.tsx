import type { Section } from '../../data/types'
import { InfoDot } from '../shared/InfoDot'

interface Props {
  activeSection: Section
  onNavigate: (s: Section) => void
  onOpenModal: (key: string) => void
}

const buildItems: { icon: string; label: string; modalKey: string; external?: boolean; chevron?: boolean; badge?: string }[] = [
  { icon: '\u{1F916}', label: 'Agents', modalKey: 'build-agents' },
  { icon: '\u{1F9EA}', label: 'Tests', modalKey: 'build-tests' },
  { icon: '\u{1F5FA}', label: 'Grids', modalKey: 'build-grids', badge: 'New' },
  { icon: '\u{1F4DD}', label: 'Prompt Templates', modalKey: 'build-prompts', external: true },
  { icon: '\u{1F5C4}', label: 'Data', modalKey: 'build-data', chevron: true },
  { icon: '\u{1F9E0}', label: 'AI Models', modalKey: 'build-models' },
  { icon: '\u{1F4BB}', label: 'Agentforce DX', modalKey: 'build-dx' },
]

// Observe & Optimize nav mirrors the AGT505 trial org (Analytics, Sessions & Intents, Alerts).
// Scorers is not present in that org's Observe group; keep the page reachable only if needed for older demos.
const observeItems: { icon: string; label: string; section: Section; beta?: boolean; infoKey: string }[] = [
  { icon: '\u{1F4C8}', label: 'Analytics', section: 'analytics', infoKey: 'agent-analytics-help' },
  { icon: '\u{1F5C2}', label: 'Sessions & Intents', section: 'sessions', infoKey: 'sessions-page' },
  { icon: '\u{1F514}', label: 'Alerts', section: 'alerts', infoKey: 'alerts-page' },
]

export function Sidebar({ activeSection, onNavigate, onOpenModal }: Props) {
  return (
    <nav className="sidebar">
      <button className="sidebar-header link-header" onClick={() => onOpenModal('sidebar-build-group')}>Build</button>
      <div className="nav-group">
        {buildItems.map(item => (
          <div
            key={item.label}
            className="nav-item build-item"
            onClick={() => onOpenModal(item.modalKey)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            {item.external && <span className="nav-ext">&#8599;</span>}
            {item.chevron && <span className="nav-chevron">&#9662;</span>}
          </div>
        ))}
      </div>

      <div className="nav-divider" />
      <button className="sidebar-header link-header" onClick={() => onOpenModal('sidebar-observe-group')}>Observe &amp; Optimize</button>
      <div className="nav-group">
        {observeItems.map(item => (
          <div
            key={item.label}
            className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
            onClick={() => onNavigate(item.section)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.beta && <span className="sidebar-badge">Beta</span>}
            <InfoDot modalKey={item.infoKey} onOpenModal={onOpenModal} label={item.label} className="nav-info" />
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button onClick={() => onOpenModal('sidebar-collapse')}>&#8676; Collapse</button>
      </div>
    </nav>
  )
}
