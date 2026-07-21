import './Level.css';

function Level({ level, points, maxPoints, showProgress = true, size = 'medium' }) {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'level-small';
      case 'large':
        return 'level-large';
      default:
        return 'level-medium';
    }
  };

  const getLevelColor = (lvl) => {
    if (lvl >= 10) return 'var(--accent)';
    if (lvl >= 7) return 'var(--secondary)';
    if (lvl >= 5) return 'var(--primary)';
    if (lvl >= 3) return 'var(--success)';
    return 'var(--text-tertiary)';
  };

  const progressPercentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  return (
    <div className={`level ${getSizeClass()}`}>
      <div className="level-icon" style={{ color: getLevelColor(level) }}>
        ⭐
      </div>
      <div className="level-info">
        <div className="level-number">Level {level}</div>
        {showProgress && (
          <div className="level-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                  background: getLevelColor(level),
                }}
              ></div>
            </div>
            <div className="level-points">
              {points} / {maxPoints} XP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Level;
