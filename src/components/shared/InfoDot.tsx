interface Props {
  modalKey: string
  onOpenModal: (key: string) => void
  label?: string
  className?: string
}

// A small circled-i affordance placed next to a functional control (tab,
// toggle, heading). Clicking it opens the explanatory modal without triggering
// the control it sits beside (stopPropagation).
export function InfoDot({ modalKey, onOpenModal, label, className }: Props) {
  return (
    <button
      type="button"
      className={`info-mini ${className ?? ''}`}
      aria-label={label ? `About ${label}` : 'More info'}
      title={label ? `About ${label}` : 'More info'}
      onClick={e => {
        e.stopPropagation()
        onOpenModal(modalKey)
      }}
    >
      &#9432;
    </button>
  )
}
