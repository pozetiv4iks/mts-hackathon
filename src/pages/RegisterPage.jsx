import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import GlassCard from '../components/UI/GlassCard';

function RegisterPage() {
  return (
    <div className="auth-page">
      <GlassCard className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        <p className="auth-subtitle">Создайте аккаунт для доступа к облачной платформе</p>
        <RegisterForm />
      </GlassCard>
    </div>
  );
}

export default RegisterPage;