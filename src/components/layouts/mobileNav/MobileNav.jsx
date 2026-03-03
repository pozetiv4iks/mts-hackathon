// src/components/Layout/MobileNav.jsx
import React from "react";
import "./MobileNav.css";

const MobileNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-nav-item active">
        <span className="icon">🏠</span>
        <span className="label">Главная</span>
      </div>
      <div className="mobile-nav-item">
        <span className="icon">📊</span>
        <span className="label">Услуги</span>
      </div>
      <div className="mobile-nav-item">
        <span className="icon">👤</span>
        <span className="label">Профиль</span>
      </div>
    </div>
  );
};

export default MobileNav;
