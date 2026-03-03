// src/components/UI/GlassCard.jsx
import React from 'react';
import '../../styles/GlassCard.css'

const GlassCard = ({ children, delay = 0 }) => {
  return (
    <div 
      className="glass-card" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="glass-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;