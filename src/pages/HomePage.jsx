import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/UI/GlassCard';

function HomePage() {
  return (
    <section className="page-section hero-section">
      <header className="hero">
        <h1 className="fade-in">
          IaaS МТС — <span className="highlight">облачная платформа</span>
        </h1>
        <p className="subtitle fade-in">
          Управление виртуальными ресурсами, мультитенантность и контроль квот
        </p>
        <div className="hero-actions">
          <Link to="/register" className="mts-btn primary">Начать бесплатно</Link>
          <Link to="/login" className="mts-btn secondary">Войти</Link>
        </div>
      </header>

      <div className="grid card-grid">
        <GlassCard delay={0.1}>
          <div className="card-body">
            <div className="card-badge">Клиентам</div>
            <h3 className="card-title">Личный кабинет</h3>
            <p className="card-desc">Просматривайте свои ВМ, создавайте и управляйте состоянием: запуск, остановка.</p>
            <div className="card-actions">
              <Link to="/dashboard" className="mts-btn">Перейти в кабинет</Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="card-body">
            <div className="card-icon">🖥️</div>
            <h3 className="card-title">Виртуальные машины</h3>
            <p className="card-desc">Виртуальные ресурсы с изоляцией по тенантам и контролем CPU, RAM, диск.</p>
            <div className="card-actions">
              <Link to="/dashboard" className="mts-btn secondary">Управление ВМ</Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="card-body">
            <div className="card-icon">⚙️</div>
            <h3 className="card-title">Для администраторов</h3>
            <p className="card-desc">Управление клиентами (тенантами), назначение квот и мониторинг использования.</p>
            <div className="card-actions">
              <Link to="/admin" className="mts-btn secondary">Панель администратора</Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default HomePage;