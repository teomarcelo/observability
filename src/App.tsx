import './App.css'
import { useNavigation } from './hooks/useNavigation'
import { useModal } from './hooks/useModal'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Modal } from './components/shared/Modal'
import { AnalyticsPage } from './components/analytics/AnalyticsPage'
import { SessionsPage } from './components/sessions/SessionsPage'
import { ScorersPage } from './components/scorers/ScorersPage'
import { AlertsPage } from './components/alerts/AlertsPage'
import type { Section } from './data/types'

const APP_TAB: Record<Section, string> = {
  analytics: 'Analytics',
  sessions: 'Sessions & Intents',
  scorers: 'Scorers',
  alerts: 'Alerts',
}

function App() {
  const nav = useNavigation()
  const modal = useModal()

  return (
    <div className="app-shell">
      <Header appTab={APP_TAB[nav.section]} onOpenModal={modal.openModal} />
      <div className="app-body">
        <Sidebar activeSection={nav.section} onNavigate={nav.navigate} onOpenModal={modal.openModal} />
        <div className="main-content">
          {nav.section === 'analytics' && <AnalyticsPage nav={nav} onOpenModal={modal.openModal} />}
          {nav.section === 'sessions' && <SessionsPage nav={nav} onOpenModal={modal.openModal} />}
          {nav.section === 'scorers' && <ScorersPage onOpenModal={modal.openModal} />}
          {nav.section === 'alerts' && <AlertsPage onOpenModal={modal.openModal} />}
        </div>
      </div>
      <Modal isOpen={modal.isOpen} content={modal.content} onClose={modal.closeModal} />
    </div>
  )
}

export default App
