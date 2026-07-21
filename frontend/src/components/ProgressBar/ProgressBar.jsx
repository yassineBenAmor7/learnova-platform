import './ProgressBar.css';

function ProgressBar({ progress, label, showPercentage = true, size = 'medium' }) {
  const getProgressColor = (value) => {
    if (value >= 80) return 'var(--success-dark)';
    if (value >= 50) return 'var(--primary)';
    if (value >= 30) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'progress-small';
      case 'large':
        return 'progress-large';
      default:
        return 'progress-medium';
    }
  };

  return (
    <div className={`progress-bar-container ${getSizeClass()}`}>
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            background: getProgressColor(progress),
          }}
        ></div>
      </div>
      {showPercentage && (
        <div className="progress-percentage">
          {Math.round(Math.min(100, Math.max(0, progress)))}%
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
