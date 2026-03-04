// src/components/auth/LoginForm.jsx
import React, { useState } from "react";

const LoginForm = () => {
  const [form, setForm] = useState({
    login: "",
    password: "",
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: сюда подключите реальный запрос авторизации
    console.log("Вход:", form);
  };

  const isDisabled = !form.login || !form.password;

  return (
    <div className="glass-card auth-card">
      <h2 className="auth-title">Войти</h2>
      <p className="auth-subtitle">
        Авторизуйтесь, чтобы продолжить работу в МТС Digital
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="login">Телефон или почта</label>
          <input
            id="login"
            name="login"
            type="text"
            placeholder="+7 900 000‑00‑00 или email"
            value={form.login}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Введите пароль"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="auth-row">
          <div className="auth-checkbox">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Запомнить меня</span>
            </label>
          </div>
          <button
            type="button"
            className="link-like auth-forgot"
            onClick={() => console.log("Нажали «Забыли пароль?»")}
          >
            Забыли пароль?
          </button>
        </div>

        <button
          type="submit"
          className="mts-btn"
          disabled={isDisabled}
        >
          Войти
        </button>

        <p className="auth-helper">
          Нет аккаунта?{" "}
          <button type="button" className="link-like">
            Зарегистрироваться
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;