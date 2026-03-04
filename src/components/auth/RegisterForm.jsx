// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
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
    // TODO: здесь подключите реальный запрос на бэкенд
    console.log("Регистрация:", form);
  };

  const isDisabled =
    !form.name ||
    !form.email ||
    !form.phone ||
    !form.password ||
    form.password !== form.confirmPassword ||
    !form.agree;

  return (
    <div className="glass-card auth-card">
      <h2 className="auth-title">Регистрация</h2>
      <p className="auth-subtitle">
        Создайте личный кабинет в экосистеме МТС Digital
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="name">Имя и фамилия</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Почта</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="phone">Телефон</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+7 (900) 000‑00‑00"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field auth-field-inline">
          <div>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Минимум 8 символов"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Повторите пароль</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Ещё раз пароль"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="auth-checkbox">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span>
              Я согласен(а) с условиями обработки персональных данных
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mts-btn"
          disabled={isDisabled}
        >
          Зарегистрироваться
        </button>

        <p className="auth-helper">
          Уже есть аккаунт? <button type="button" className="link-like">Войти</button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;