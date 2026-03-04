// src/components/virtualApps/VirtualAppsDashboard.jsx
import React, { useState, useMemo } from "react";
import VirtualAppCard from "./VirtualAppCard";
import VirtualAppFilters from "./VirtualAppFilters";
import "./VirtualApps.css";

const MOCK_APPS = [
  {
    id: "va-1",
    name: "CRM виртуальный стенд",
    env: "prod",
    status: "running",
    owner: "Digital Core",
    region: "Москва",
    lastDeployed: "2026-03-01 12:34",
    cpu: 62,
    memory: 78,
  },
  {
    id: "va-2",
    name: "Документооборот",
    env: "stage",
    status: "stopped",
    owner: "Backoffice",
    region: "СПб",
    lastDeployed: "2026-02-28 09:12",
    cpu: 0,
    memory: 0,
  },
  {
    id: "va-3",
    name: "Аналитика трафика",
    env: "dev",
    status: "degraded",
    owner: "Big Data",
    region: "Казань",
    lastDeployed: "2026-03-03 18:10",
    cpu: 88,
    memory: 91,
  },
];

const VirtualAppsDashboard = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    env: "all",
  });
  const [selectedId, setSelectedId] = useState(null);

  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter((app) => {
      const matchesSearch =
        !filters.search ||
        app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.id.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || app.status === filters.status;

      const matchesEnv =
        filters.env === "all" || app.env === filters.env;

      return matchesSearch && matchesStatus && matchesEnv;
    });
  }, [filters]);

  const selectedApp =
    filteredApps.find((a) => a.id === selectedId) ||
    filteredApps[0] ||
    null;

  const handleAction = (action, app) => {
    // TODO: сюда потом воткнёшь реальные API вызовы
    console.log(`Action: ${action} on`, app);
  };

  return (
    <section className="va-layout">
      <header className="va-header">
        <div>
          <h2 className="va-title">Виртуальные приложения</h2>
          <p className="va-subtitle">
            Управляйте виртуальными стендами МТС Digital в едином окне
          </p>
        </div>
        <div className="va-header-badge">
          {MOCK_APPS.length} приложений
        </div>
      </header>

      <VirtualAppFilters filters={filters} onChange={setFilters} />

      <div className="va-main">
        <div className="va-grid">
          {filteredApps.map((app) => (
            <VirtualAppCard
              key={app.id}
              app={app}
              active={selectedApp && selectedApp.id === app.id}
              onSelect={() => setSelectedId(app.id)}
              onAction={handleAction}
            />
          ))}
          {filteredApps.length === 0 && (
            <div className="va-empty glass-card">
              <p>По текущим фильтрам приложений не найдено.</p>
            </div>
          )}
        </div>

        {selectedApp && (
          <aside className="va-details glass-card">
            <h3 className="va-details-title">
              {selectedApp.name}
            </h3>
            <p className="va-details-id">{selectedApp.id}</p>

            <div className="va-details-row">
              <span>Окружение</span>
              <span className={`va-pill va-pill-${selectedApp.env}`}>
                {selectedApp.env}
              </span>
            </div>

            <div className="va-details-row">
              <span>Статус</span>
              <span
                className={`va-status-pill va-status-${selectedApp.status}`}
              >
                {selectedApp.status === "running" && "Работает"}
                {selectedApp.status === "stopped" && "Остановлено"}
                {selectedApp.status === "degraded" && "Проблемы"}
              </span>
            </div>

            <div className="va-details-row">
              <span>Ответственный</span>
              <span>{selectedApp.owner}</span>
            </div>

            <div className="va-details-row">
              <span>Регион</span>
              <span>{selectedApp.region}</span>
            </div>

            <div className="va-metrics">
              <div className="va-metric">
                <div className="va-metric-label">
                  CPU
                  <span>{selectedApp.cpu}%</span>
                </div>
                <div className="va-metric-bar">
                  <div
                    className="va-metric-bar-fill"
                    style={{ width: `${selectedApp.cpu}%` }}
                  />
                </div>
              </div>
              <div className="va-metric">
                <div className="va-metric-label">
                  RAM
                  <span>{selectedApp.memory}%</span>
                </div>
                <div className="va-metric-bar">
                  <div
                    className="va-metric-bar-fill va-metric-ram"
                    style={{ width: `${selectedApp.memory}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              className="mts-btn va-details-btn"
              onClick={() => handleAction("open-details", selectedApp)}
            >
              Открыть в консоли
            </button>
          </aside>
        )}
      </div>
    </section>
  );
};

export default VirtualAppsDashboard;