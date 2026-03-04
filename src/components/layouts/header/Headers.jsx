// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.users_user_role === 'admin';

  return (
    <header className="glass-header">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <span className="logo-text">MTS <b>Digital</b></span>
        </Link>

        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Главная</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">Личный кабинет</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-link-admin">Панель администратора</Link>
              )}
            </>
          )}
          {isAuthenticated ? (
            <span className="header-user">
              <span className="header-username">{user?.users_username}</span>
              <button type="button" className="glass-auth-btn" onClick={handleLogout}>Выйти</button>
            </span>
          ) : (
            <Link to="/login" className="glass-auth-btn">Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;