import './Badge.css';

function Badge({ badge, size = 'medium', showLabel = true }) {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'badge-small';
      case 'large':
        return 'badge-large';
      default:
        return 'badge-medium';
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'first_course':
        return '🎯';
      case 'streak_7':
        return '🔥';
      case 'streak_30':
        return '⚡';
      case 'quiz_master':
        return '🏆';
      case 'perfect_score':
        return '💯';
      case 'fast_learner':
        return '🚀';
      case 'dedicated':
        return '💎';
      case 'expert':
        return '🌟';
      default:
        return '🏅';
    }
  };

  if (!badge) return null;

  return (
    <div className={`badge ${getSizeClass()}`}>
      <div className="badge-icon">
        {getBadgeIcon(badge.type)}
      </div>
      {showLabel && (
        <div className="badge-info">
          <div className="badge-name">{badge.name}</div>
          <div className="badge-description">{badge.description}</div>
        </div>
      )}
    </div>
  );
}

export default Badge;
