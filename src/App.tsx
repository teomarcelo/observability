import './App.css'
import { useNavigation } from './hooks/useNavigation'
import { useModal } from './hooks/useModal'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Modal } from './components/shared/Modal'
import { AnalyticsPage } from './components/analytics/AnalyticsPage'
import { InsightsPage } from './components/optimization/InsightsPage'
import { SessionsPage } from './components/optimization/SessionsPage'
import { ScorersPage } from './components/scorers/ScorersPage'
import { AlertsPage } from './components/alerts/AlertsPage'

function App() {
  const nav = useNavigation()
  const modal = useModal()

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar
          activeSection={nav.section}
          onNavigate={nav.navigate}
          optExpanded={nav.optExpanded}
          onToggleOpt={nav.toggleOpt}
        />
        <div className="main-content">
          {nav.section === 'analytics' && (
            <AnalyticsPage
              agentType={nav.agentType}
              onAgentTypeChange={nav.setAgentType}
              analyticsTab={nav.analyticsTab}
              onAnalyticsTabChange={nav.setAnalyticsTab}
              innerTab={nav.innerTab}
              onInnerTabChange={nav.setInnerTab}
              perfBreakdown={nav.perfBreakdown}
              onPerfBreakdownChange={nav.setPerfBreakdown}
              onOpenModal={modal.openModal}
            />
          )}
          {nav.section === 'insights' && (
            <InsightsPage onOpenModal={modal.openModal} />
          )}
          {nav.section === 'sessions' && (
            <SessionsPage
              sessionTab={nav.sessionTab}
              onSessionTabChange={nav.setSessionTab}
            />
          )}
          {nav.section === 'scorers' && <ScorersPage />}
          {nav.section === 'alerts' && <AlertsPage onOpenModal={modal.openModal} />}
        </div>
      </div>
      <Modal
        isOpen={modal.isOpen}
        content={modal.content}
        onClose={modal.closeModal}
      />
    </div>
  )
}

export default App
