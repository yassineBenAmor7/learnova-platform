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

  const getBadgeIconUrl = (badge) => {
    if (badge.iconUrl) return badge.iconUrl;
    
    // Map badge IDs to SVG files
    const badgeIconMap = {
      'first_steps': '/badges/first_steps.svg',
      'first_session': '/badges/first_session.svg',
      'first_quiz': '/badges/first_quiz.svg',
      'first_certificate': '/badges/first_certificate.svg',
      'bronze_learner': '/badges/bronze_learner.svg',
      'silver_learner': '/badges/silver_learner.svg',
      'gold_learner': '/badges/gold_learner.svg',
      'platinum_learner': '/badges/platinum_learner.svg',
      'diamond_master': '/badges/diamond_master.svg',
      'level_5': '/badges/level_5.svg',
      'level_10': '/badges/level_10.svg',
      'level_25': '/badges/level_25.svg',
      'level_50': '/badges/level_50.svg',
      'quiz_ace': '/badges/quiz_master.svg',
      'quiz_master': '/badges/quiz_master.svg',
      'quiz_legend': '/badges/quiz_legend.svg',
      'hour_10': '/badges/hour_10.svg',
      'hour_50': '/badges/hour_50.svg',
      'hour_100': '/badges/hour_100.svg',
      'hour_500': '/badges/hour_500.svg',
      'streak_3': '/badges/streak_3.svg',
      'streak_7': '/badges/streak_7.svg',
      'streak_30': '/badges/streak_30.svg',
      'polyglot': '/badges/polyglot.svg',
      'renaissance': '/badges/renaissance.svg',
      'polymath': '/badges/polymath.svg',
      'fast_learner': '/badges/fast_learner.svg',
      'perfect_student': '/badges/perfect_student.svg',
    };
    
    return badgeIconMap[badge.id] || '/badges/first_steps.svg';
  };

  if (!badge) return null;

  return (
    <div className={`badge ${getSizeClass()} ${badge.unlocked === false ? 'badge-locked' : ''}`}>
      <div className="badge-icon">
        <img 
          src={getBadgeIconUrl(badge)} 
          alt={badge.name} 
          className="badge-artwork-img" 
        />
      </div>
      {showLabel && (
        <div className="badge-info">
          <div className="badge-tier" style={{ color: '#1e40af' }}>{badge.tier}</div>
        </div>
      )}
    </div>
  );
}

export default Badge;
