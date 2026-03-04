import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './MobileNav.css';

const MobileNav = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.users_user_role === 'admin';

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end>
        <span className="icon">🏠</span>
        <span className="label">Главная</span>
      </NavLink>

      {isAuthenticated ? (
        <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <span className="icon">🖥️</span>
          <span className="label">Кабинет</span>
        </NavLink>
      ) : (
        <NavLink to="/login" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <span className="icon">🔑</span>
          <span className="label">Войти</span>
        </NavLink>
      )}

      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <span className="icon">⚙️</span>
          <span className="label">Админ</span>
        </NavLink>
      )}
    </nav>
  );
};

export default MobileNav;
