import type { ModalContent } from '../../data/types'

interface Props {
  isOpen: boolean
  content: ModalContent | null
  onClose: () => void
}

export function Modal({ isOpen, content, onClose }: Props) {
  if (!content) return null

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="tab-label">{content.tabLabel}</div>
            <h2>{content.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {content.rows.map((row, i) => (
            <div className="modal-row" key={i}>
              <div className="modal-row-label">{row.label}</div>
              <div className="modal-row-value">{row.value}</div>
            </div>
          ))}
          {content.useCase && (
            <div className="modal-uc">
              <div className="modal-uc-label">Use Case Context</div>
              <p>{content.useCase}</p>
            </div>
          )}
          {content.action && (
            <div className="modal-action">
              <strong>Recommended Action:</strong> {content.action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
