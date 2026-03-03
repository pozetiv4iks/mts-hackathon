// src/components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  // Эффект изменения прозрачности при скролле
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`glass-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <div className="mts-square"></div>
          <span className="logo-text">MTS <b>Digital</b></span>
        </div>

        {/* Десктопное меню */}
        <nav className="desktop-nav">
          <a href="#solutions" className="nav-link">Решения</a>
          <a href="#tariffs" className="nav-link">Тарифы</a>
          <a href="#about" className="nav-link">О нас</a>
          <button className="glass-auth-btn">Войти</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;