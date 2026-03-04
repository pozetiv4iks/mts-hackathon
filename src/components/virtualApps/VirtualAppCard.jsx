// src/components/virtualApps/VirtualAppCard.jsx
import React from "react";

const statusText = {
  running: "Работает",
  stopped: "Остановлено",
  degraded: "Проблемы",
};

const VirtualAppCard = ({ app, active, onSelect, onAction }) => {
  return (
    <article
      className={`glass-card va-card ${active ? "va-card-active" : ""}`}
      onClick={onSelect}
    >
      <div className="va-card-header">
        <div>
          <h3 className="va-card-title">{app.name}</h3>
          <p className="va-card-id">{app.id}</p>
        </div>
        <span className={`va-status-pill va-status-${app.status}`}>
          {statusText[app.status]}
        </span>
      </div>

      <div className="va-card-meta">
        <span className={`va-pill va-pill-${app.env}`}>
          {app.env}
        </span>
        <span className="va-pill va-pill-light">{app.region}</span>
        <span className="va-owner">{app.owner}</span>
      </div>

      <div className="va-card-metrics">
        <div className="va-mini-metric">
          <span>CPU</span>
          <strong>{app.cpu}%</strong>
        </div>
        <div className="va-mini-metric">
          <span>RAM</span>
          <strong>{app.memory}%</strong>
        </div>
        <div className="va-mini-metric">
          <span>Deploy</span>
          <span className="va-mini-muted">{app.lastDeployed}</span>
        </div>
      </div>

      <div
        className="va-card-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mts-btn va-btn-ghost"
          onClick={() => onAction("restart", app)}
        >
          Перезапустить
        </button>
        {app.status === "running" ? (
          <button
            className="mts-btn va-btn-secondary"
            onClick={() => onAction("stop", app)}
          >
            Остановить
          </button>
        ) : (
          <button
            className="mts-btn"
            onClick={() => onAction("start", app)}
          >
            Запустить
          </button>
        )}
      </div>
    </article>
  );
};

export default VirtualAppCard;