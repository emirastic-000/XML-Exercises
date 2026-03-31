export default function ProgressBar({ value = 0, label }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {(label || clamped > 0) && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'inline-block' }}>
          {label || `${clamped}%`}
        </span>
      )}
    </div>
  );
}
