// src/components/virtualApps/VirtualAppFilters.jsx
import React, { useState, useRef, useEffect } from "react";

const optionsStatus = [
  { value: "all", label: "Все" },
  { value: "running", label: "Работает" },
  { value: "stopped", label: "Остановлено" },
  { value: "degraded", label: "Проблемы" },
];

const optionsEnv = [
  { value: "all", label: "Все окружения" },
  { value: "prod", label: "prod" },
  { value: "stage", label: "stage" },
  { value: "dev", label: "dev" },
];

const VADropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="va-field" ref={ref}>
      {label && <label>{label}</label>}
      <button
        type="button"
        className={`va-dropdown ${open ? "va-dropdown-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="va-dropdown-label">{selected.label}</span>
        <span className="va-dropdown-icon">▾</span>
      </button>
      {open && (
        <div className="va-dropdown-menu">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`va-dropdown-item ${
                opt.value === value ? "va-dropdown-item-active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const VirtualAppFilters = ({ filters, onChange }) => {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="va-filters glass-card">
      <div className="va-filters-left">
        <div className="va-field">
          <label>Поиск</label>
          <input
            type="text"
            placeholder="Название или ID приложения"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="va-filters-right">
        <VADropdown
          label="Статус"
          value={filters.status}
          options={optionsStatus}
          onChange={(val) => update({ status: val })}
        />
        <VADropdown
          label="Окружение"
          value={filters.env}
          options={optionsEnv}
          onChange={(val) => update({ env: val })}
        />
      </div>
    </div>
  );
};

export default VirtualAppFilters;