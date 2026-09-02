import React from 'react';

const StatCard = ({ title, value, subtitle, icon, variant = 'primary' }) => {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <h3 className="stat-card-value">{value}</h3>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
      <div className="stat-card-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
