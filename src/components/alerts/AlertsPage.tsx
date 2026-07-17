interface Props {
  onOpenModal: (key: string) => void
}

export function AlertsPage({ onOpenModal }: Props) {
  return (
    <div className="alerts-page">
      <div className="empty-hero">
        <div className="empty-illus" aria-hidden>
          <div className="empty-orb" />
        </div>
        <button className="empty-title link-title" onClick={() => onOpenModal('alerts-page')}>
          Alerts haven't been set up.
        </button>
        <p className="empty-body">
          Double-check you've completed all of the{' '}
          <button className="link-btn inline" onClick={() => onOpenModal('alerts-config')}>configuration requirements</button>{' '}
          and that Agentforce Session Tracing is turned on.
        </p>
      </div>
    </div>
  )
}
