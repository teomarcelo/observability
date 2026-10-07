import { useState } from 'react'

interface Props {
  displayed: string[]
  available: string[]
  onClose: () => void
  onSave: (next: string[]) => void
  onLearnMore: () => void
}

const SESSION_FIELD_SET = new Set([
  'Session ID', 'Timestamp', 'Session Duration', 'Session Outcome',
])

export function SelectFieldsModal({ displayed, available, onClose, onSave, onLearnMore }: Props) {
  const [fields, setFields] = useState(displayed)
  const [avail, setAvail] = useState(
    available.filter(a => !displayed.includes(a)),
  )
  const [pickAvail, setPickAvail] = useState<string | null>(null)
  const [pickDisp, setPickDisp] = useState<string | null>(null)

  const moveRight = () => {
    if (!pickAvail) return
    setFields(f => [...f, pickAvail])
    setAvail(a => a.filter(x => x !== pickAvail))
    setPickAvail(null)
  }
  const moveLeft = () => {
    if (!pickDisp || SESSION_FIELD_SET.has(pickDisp) && fields.length <= 4) return
    // Keep core session fields unless explicitly removed after intent fields — allow remove of non-core.
    if (['Session ID', 'Timestamp'].includes(pickDisp)) return
    setAvail(a => [...a, pickDisp])
    setFields(f => f.filter(x => x !== pickDisp))
    setPickDisp(null)
  }

  const sessionFields = fields.filter(f => SESSION_FIELD_SET.has(f))
  const intentFields = fields.filter(f => !SESSION_FIELD_SET.has(f))

  return (
    <div className="sf-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sf-fields-modal"
        role="dialog"
        aria-labelledby="sf-fields-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="sf-fields-head">
          <div>
            <h2 id="sf-fields-title">Select Fields to Display</h2>
            <p>Add the fields you want to display in your Session &amp; Intents table.</p>
          </div>
          <button type="button" className="sf-icon-btn" aria-label="Close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="sf-fields-body">
          <div className="sf-fields-pane">
            <div className="sf-fields-pane-title">Available Fields</div>
            <ul className="sf-fields-list">
              {avail.map(f => (
                <li key={f}>
                  <button
                    type="button"
                    className={pickAvail === f ? 'active' : ''}
                    onClick={() => { setPickAvail(f); setPickDisp(null) }}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="sf-fields-movers">
            <button type="button" className="sf-btn" onClick={moveRight} disabled={!pickAvail} aria-label="Add field">&#9654;</button>
            <button type="button" className="sf-btn" onClick={moveLeft} disabled={!pickDisp} aria-label="Remove field">&#9664;</button>
          </div>
          <div className="sf-fields-pane">
            <div className="sf-fields-pane-title">Fields to Display</div>
            <ul className="sf-fields-list">
              {sessionFields.length > 0 && <li className="sf-fields-group">Session Fields</li>}
              {sessionFields.map(f => (
                <li key={f}>
                  <button
                    type="button"
                    className={pickDisp === f ? 'active' : ''}
                    onClick={() => { setPickDisp(f); setPickAvail(null) }}
                  >
                    {f}
                  </button>
                </li>
              ))}
              {intentFields.length > 0 && <li className="sf-fields-group">Intent Fields</li>}
              {intentFields.map(f => (
                <li key={f}>
                  <button
                    type="button"
                    className={pickDisp === f ? 'active' : ''}
                    onClick={() => { setPickDisp(f); setPickAvail(null) }}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sf-fields-foot">
          <button type="button" className="link-btn" onClick={onLearnMore}>What this control does</button>
          <div className="sf-fields-foot-actions">
            <button type="button" className="sf-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="sf-btn-primary" onClick={() => onSave(fields)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
