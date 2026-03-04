import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    setSubmitting(true);
    const result = await register(formData.username, formData.password);
    
    if (result.success) {
      // После регистрации — автоматический логин или переход на login
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Теперь войдите в систему.' } 
      });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {authError && <div className="error-message">{authError}</div>}

      <div className="auth-field">
        <label htmlFor="reg-username">Имя пользователя</label>
        <input
          id="reg-username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={submitting}
          minLength={3}
          placeholder="От 3 символов"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password">Пароль</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={submitting}
          minLength={6}
          placeholder="Минимум 6 символов"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-confirmPassword">Подтвердите пароль</label>
        <input
          id="reg-confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={submitting}
          placeholder="Повторите пароль"
        />
      </div>

      <button type="submit" className="mts-btn primary" disabled={submitting}>
        {submitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <p className="auth-helper">
        Уже есть аккаунт? <Link to="/login" className="link-like">Войти</Link>
      </p>
    </form>
  );
}

export default RegisterForm;