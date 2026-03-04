import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';
import VMList from './VMList';
import VMForm from './VMForm';
import TenantSelector from './TenantSelector';
import GlassCard from '../UI/GlassCard';
import LoadingSpinner from '../UI/LoadingSpinner';

function VirtualAppsDashboard() {
  const { token, user } = useAuth();
  const [vms, setVms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchVMs = async (tenantOverride = null) => {
    if (!token) return;
    try {
      const params = tenantOverride
        ? { tenant_id: tenantOverride.tenants_tenant_id }
        : (selectedTenant ? { tenant_id: selectedTenant.tenants_tenant_id } : {});
      const data = await api.getVirtualMachines(params, token);
      setVms(data);
    } catch (err) {
      setError(err.message);
      setVms([]);
    }
  };

  // Загрузка тенантов и начальная загрузка ВМ
  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) return;

      try {
        const tenantIds = await api.getUserTenants(user.users_user_id, token);
        if (tenantIds.length > 0) {
          const tenantDetails = await Promise.all(
            tenantIds.map(id => api.getTenant(id, token))
          );
          setTenants(tenantDetails);
          setSelectedTenant(tenantDetails[0]);
        }
        // ВМ подгрузим в отдельном эффекте после установки selectedTenant
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, user]);

  // Загрузка списка ВМ при появлении токена/тенанта
  useEffect(() => {
    if (!token || loading) return;
    fetchVMs(selectedTenant || undefined);
  }, [token, loading, selectedTenant]);

  const handleCreateVM = async (vmData) => {
    if (!token || !user) return;
    if (!selectedTenant?.tenants_tenant_id) {
      setError('Выберите тенант для создания ВМ.');
      return;
    }

    setError(null);
    const payload = {
      name: vmData.name || 'Virtual Machine',
      cpu: Number(vmData.cpu),
      ram: Number(vmData.ram),
      disk: Number(vmData.disk),
      status: vmData.status || 'STOPPED',
      tenant_id: selectedTenant.tenants_tenant_id,
      created_by: user.users_user_id
    };

    try {
      await api.createVirtualMachine(payload, token);
      await fetchVMs(selectedTenant);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteVM = async (vmId) => {
    if (!token) return;
    if (window.confirm('Удалить эту виртуальную машину?')) {
      await api.deleteVirtualMachine(vmId, token);
      await fetchVMs();
    }
  };

  const handleStartStop = async (vmId, newStatus) => {
    if (!token) return;
    try {
      await api.updateVirtualMachine(vmId, { status: newStatus }, token);
      await fetchVMs(selectedTenant);
    } catch (err) {
      console.error('Ошибка смены статуса ВМ:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="dashboard">
      <section className="dashboard-toolbar">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-section-title">Виртуальные машины</h2>
            <p className="dashboard-section-desc">Создавайте ВМ и управляйте их состоянием</p>
          </div>
          <button
            type="button"
            className="mts-btn primary"
            onClick={() => { setShowCreateForm(!showCreateForm); setError(null); }}
          >
            {showCreateForm ? 'Отмена' : '+ Создать ВМ'}
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        {tenants.length > 1 && (
          <TenantSelector
            tenants={tenants}
            selected={selectedTenant}
            onSelect={setSelectedTenant}
          />
        )}

        {tenants.length === 0 && !loading && (
          <div className="empty-block">
            <p>Нет доступных тенантов. Обратитесь к администратору для подключения.</p>
          </div>
        )}
      </section>

      {showCreateForm && (
        <section className="dashboard-form-section">
          <GlassCard className="glass-card-form">
            <VMForm
              onSubmit={handleCreateVM}
              onCancel={() => setShowCreateForm(false)}
              defaultTenant={selectedTenant}
            />
          </GlassCard>
        </section>
      )}

      <section className="dashboard-list-section" aria-label="Список виртуальных машин">
        <VMList
          vms={vms}
          onDelete={handleDeleteVM}
          onRefresh={fetchVMs}
          onStartStop={handleStartStop}
        />
      </section>
    </div>
  );
}

export default VirtualAppsDashboard;