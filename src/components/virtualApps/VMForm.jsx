import React, { useState } from 'react';

function VMForm({ onSubmit, onCancel, defaultTenant }) {
  const [formData, setFormData] = useState({
    name: '',
    cpu: 2,
    ram: 4096,
    disk: 50,
    status: 'STOPPED' // API: ACTIVE | STOPPED | INACTIVE
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="vm-form">
      <h3 className="vm-form-title">Новая виртуальная машина</h3>

      <div className="vm-form-block">
        <label className="vm-form-block-label">Основные параметры</label>
        <div className="form-group">
          <label htmlFor="vm-name">Название</label>
          <input
            id="vm-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="my-vm-01"
          />
        </div>
      </div>

      <div className="vm-form-block">
        <label className="vm-form-block-label">Ресурсы</label>
        <div className="form-row form-row-vm">
          <div className="form-group">
            <label htmlFor="vm-cpu">CPU (ядра)</label>
            <input
              id="vm-cpu"
              name="cpu"
              type="number"
              min="1"
              max="16"
              value={formData.cpu}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vm-ram">RAM (MB)</label>
            <input
              id="vm-ram"
              name="ram"
              type="number"
              min="512"
              step="512"
              value={formData.ram}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vm-disk">Disk (GB)</label>
            <input
              id="vm-disk"
              name="disk"
              type="number"
              min="10"
              step="10"
              value={formData.disk}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="vm-status">Статус при создании</label>
        <select id="vm-status" name="status" value={formData.status} onChange={handleChange}>
          <option value="STOPPED">Остановлена</option>
          <option value="ACTIVE">Запущена</option>
          <option value="INACTIVE">Неактивна</option>
        </select>
      </div>

      <div className="form-actions form-actions-vm">
        <button type="button" className="mts-btn secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="mts-btn primary">
          Создать ВМ
        </button>
      </div>
    </form>
  );
}

export default VMForm;