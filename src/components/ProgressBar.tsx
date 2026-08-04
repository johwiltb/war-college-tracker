export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const bounded = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-wrap" aria-label={label ?? `${bounded}% complete`}>
      <div className="progress-track"><span style={{ width: `${bounded}%` }} /></div>
      {label && <span className="progress-label">{label}</span>}
    </div>
  )
}
