import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import GlassCard from '../components/UI/GlassCard';

function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="auth-page">
      <GlassCard className="auth-card">
        <h2 className="auth-title">Вход в аккаунт</h2>
        <p className="auth-subtitle">Введите данные для входа в личный кабинет</p>
        {message && <div className="success-message">{message}</div>}
        <LoginForm />
      </GlassCard>
    </div>
  );
}

export default LoginPage;