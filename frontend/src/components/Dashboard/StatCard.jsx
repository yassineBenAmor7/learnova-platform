import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard - Composant réutilisable d'affichage d'une statistique clé
 */
export const StatCard = ({
  icon: Icon,
  value,
  label,
  color = 'primary',
  trend,
  className = '',
}) => {
  return (
    <div className={`stat-card stat-${color} ${className}`}>
      {Icon && (
        <div className="stat-icon-wrapper">
          <Icon size={24} className="stat-icon" />
        </div>
      )}
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  trend: PropTypes.string,
  className: PropTypes.string,
};

export default StatCard;
