import React from "react";
import Header from "./components/layouts/header/Headers";
import MobileNav from "./components/layouts/mobileNav/MobileNav";
import GlassCard from "./components/UI/GlassCard";
import LoginForm from "./components/auth/LoginForm";
// Стили подгружаются из отдельных файлов, которые мы создали ранее
import "./styles/variables.css";
import "./styles/global.css";
import RegisterForm from "./components/auth/RegisterForm";
import VirtualAppsDashboard from "./components/virtualApps/VirtualAppsDashboard";

function App() {
  return (
    <>
      <Header />

    <div className="mts-layout">
      {/* Стеклянный хедер (Бело-красный) */}

      <main className="content-container">
        {/* Секция Hero */}
        <header className="hero">
          <h1 className="fade-in">
            Будущее в <span className="highlight">стекле</span>
          </h1>
          <p className="subtitle fade-in">
            Адаптивный шаблон экосистемы МТС Digital
          </p>
        </header>

        {/* Сетка карточек с разной задержкой анимации */}
        <div className="grid">
          <GlassCard delay={0.1}>
            <div className="card-badge">Хит</div>
            <h3>Тариф №1</h3>
            <p>Безлимитный интернет и музыка в прозрачном исполнении.</p>
            <div className="price-tag">550 ₽/мес</div>
            <button className="mts-btn">Выбрать</button>
          </GlassCard>

          <GlassCard delay={0.2}>
            <div className="card-icon">💎</div>
            <h3>Premium</h3>
            <p>Приоритетное обслуживание и кэшбэк до 20% на всё.</p>
            <button className="mts-btn secondary">Подробнее</button>
          </GlassCard>

          <GlassCard delay={0.3}>
            <div className="card-icon">🚀</div>
            <h3>5G Скорость</h3>
            <p>Тестируйте возможности сети нового поколения уже сегодня.</p>
            <button className="mts-btn secondary">Карта покрытия</button>
          </GlassCard>
        </div>
      </main>

      {/* Навигация для смартфонов (Bottom Bar) */}
      <MobileNav />

      <style jsx>{`

      `}</style>
      <RegisterForm />
      <LoginForm />
      <VirtualAppsDashboard />
    </div>
    
    </>

  );
}

export default App;