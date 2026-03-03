import React from "react";
import Header from "./components/layouts/header/Headers";
import MobileNav from "./components/layouts/mobileNav/MobileNav";
import GlassCard from "./components/UI/GlassCard";

// Стили подгружаются из отдельных файлов, которые мы создали ранее
import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <div className="mts-layout">
      {/* Стеклянный хедер (Бело-красный) */}
      <Header />

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
        .mts-layout {
          min-height: 100vh;
          background-color: var(--mts-red);
          /* Градиент добавляет глубины для эффекта стекла */
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.1) 0%, transparent 35%);
          padding-bottom: 100px; /* Отступ под мобильное меню */
        }

        .content-container {
          padding: 120px 20px 40px; /* Отступ сверху, чтобы не заходило под хедер */
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero {
          text-align: center;
          margin-bottom: 60px;
          color: white;
        }

        .hero h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 900;
          margin: 0;
          line-height: 1.1;
        }

        .highlight {
          color: rgba(255, 255, 255, 0.5);
          -webkit-text-stroke: 1px white;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        /* Декоративные элементы внутри карточек */
        .card-badge {
          background: white;
          color: var(--mts-red);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .price-tag {
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }

        /* Кнопки */
        .mts-btn {
          width: 100%;
          background: white;
          color: var(--mts-red);
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mts-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .mts-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .mts-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .content-container {
            padding-top: 100px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;