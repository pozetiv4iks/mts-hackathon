import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {authError && <div className="error-message">{authError}</div>}
      
      <div className="auth-field">
        <label htmlFor="username">Имя пользователя</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={submitting}
          placeholder="Введите username"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={submitting}
          placeholder="••••••••"
        />
      </div>

      <button type="submit" className="mts-btn primary" disabled={submitting}>
        {submitting ? 'Вход...' : 'Войти'}
      </button>

      <p className="auth-helper">
        Нет аккаунта? <Link to="/register" className="link-like">Зарегистрироваться</Link>
      </p>
    </form>
  );
}

export default LoginForm;