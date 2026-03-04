// src/components/UI/GlassCard.jsx
import React from 'react';
import '../../styles/GlassCard.css'

const GlassCard = ({ children, delay = 0, className }) => {
  return (
    <div
      className={['glass-card', className].filter(Boolean).join(' ')}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="glass-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;