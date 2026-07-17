import { useEffect } from 'react'
import type { ModalContent } from '../../data/types'

interface Props {
  isOpen: boolean
  content: ModalContent | null
  onClose: () => void
}

export function Modal({ isOpen, content, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!content) return null

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="tab-label">{content.tabLabel}</div>
            <h2>{content.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal-body">
          {content.rows.map((row, i) => (
            <div className="modal-row" key={i}>
              <div className="modal-row-label">{row.label}</div>
              <div className="modal-row-value">{row.value}</div>
            </div>
          ))}

          {content.scale && (
            <div className="modal-section">
              <div className="modal-section-label">What the number means</div>
              <p>{content.scale}</p>
            </div>
          )}
          {(content.higher || content.lower) && (
            <div className="reading-grid">
              {content.higher && (
                <div className={`reading-card ${content.higherIs ?? 'depends'}`}>
                  <div className="reading-head">Higher value {arrow('up', content.higherIs)}</div>
                  <p>{content.higher}</p>
                </div>
              )}
              {content.lower && (
                <div className={`reading-card ${invert(content.higherIs)}`}>
                  <div className="reading-head">Lower value {arrow('down', content.higherIs)}</div>
                  <p>{content.lower}</p>
                </div>
              )}
            </div>
          )}

          {content.purpose && (
            <div className="modal-section">
              <div className="modal-section-label">Purpose</div>
              <p>{content.purpose}</p>
            </div>
          )}
          {content.useCase && (
            <div className="modal-section">
              <div className="modal-section-label">Use Case</div>
              <p>{content.useCase}</p>
            </div>
          )}
          {content.practical && (
            <div className="modal-section">
              <div className="modal-section-label">Practical Reason</div>
              <p>{content.practical}</p>
            </div>
          )}
          {content.note && (
            <div className="modal-note">
              <strong>Sourcing note:</strong> {content.note}
            </div>
          )}
          {content.sources && content.sources.length > 0 && (
            <div className="modal-sources">
              <div className="modal-section-label">Official Salesforce sources</div>
              <ul>
                {content.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function invert(h?: 'good' | 'bad' | 'depends'): 'good' | 'bad' | 'depends' {
  return h === 'good' ? 'bad' : h === 'bad' ? 'good' : 'depends'
}

function arrow(dir: 'up' | 'down', higherIs?: 'good' | 'bad' | 'depends') {
  if (!higherIs || higherIs === 'depends') return <span className="tag depends">context</span>
  const isGood = dir === 'up' ? higherIs === 'good' : higherIs === 'bad'
  return <span className={`tag ${isGood ? 'good' : 'bad'}`}>{isGood ? 'usually good' : 'usually a concern'}</span>
}
