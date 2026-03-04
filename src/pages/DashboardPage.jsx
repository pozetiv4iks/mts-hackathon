import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import GlassCard from '../components/UI/GlassCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const STATUS_LABELS = { ACTIVE: 'Запущена', STOPPED: 'Остановлена', INACTIVE: 'Неактивна' };
const PAYMENT_LABELS = { UNPAID: 'Не оплачено', PAID: 'Оплачено', REFUNDED: 'Возврат' };

function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showCreateTenant, setShowCreateTenant] = useState(false);
  const [showBuyPlan, setShowBuyPlan] = useState(false);
  const [showCustomRequest, setShowCustomRequest] = useState(false);
  const [showCreateVM, setShowCreateVM] = useState(false);

  const [tenantForm, setTenantForm] = useState({ name: '' });
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [customForm, setCustomForm] = useState({ cpu: 4, ram: 8192, disk: 100 });
  const [vmForm, setVmForm] = useState({ name: '', cpu: 2, ram: 4096, disk: 50 });

  const selectedTenant = tenants.find(t => t.tenants_tenant_id === selectedTenantId);

  const userId = user?.users_user_id;

  const loadTenants = useCallback(async () => {
    if (!token || !userId) return;
    try {
      let tenantList = [];
      try {
        const ids = await api.getUserTenants(userId, token);
        if (Array.isArray(ids) && ids.length > 0) {
          tenantList = await Promise.all(ids.map(id => api.getTenant(id, token)));
        }
      } catch {
        const owned = await api.getTenantsByOwner(userId, token);
        tenantList = Array.isArray(owned) ? owned : [];
      }
      setTenants(tenantList);
      if (tenantList.length > 0 && !selectedTenantId) {
        setSelectedTenantId(tenantList[0].tenants_tenant_id);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [token, userId, selectedTenantId]);

  const loadPlans = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getPlans(0, 100, token);
      setPlans(Array.isArray(data) ? data.filter(p => !p.plans_is_custom) : []);
    } catch {}
  }, [token]);

  const loadTenantData = useCallback(async (tenantId) => {
    if (!token || !tenantId) return;
    try {
      const [q, v] = await Promise.all([
        api.getTenantQuotasByTenant(tenantId, token),
        api.getVirtualMachines({ tenant_id: tenantId }, token)
      ]);
      setQuotas(Array.isArray(q) ? q : []);
      setVms(Array.isArray(v) ? v : []);
    } catch (err) {
      setQuotas([]);
      setVms([]);
    }
  }, [token]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadTenants(), loadPlans()]);
      setLoading(false);
    };
    init();
  }, [loadTenants, loadPlans]);

  useEffect(() => {
    if (selectedTenantId) loadTenantData(selectedTenantId);
  }, [selectedTenantId, loadTenantData]);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!tenantForm.name.trim()) return;
    setError(null);
    try {
      const created =       await api.createTenant({ name: tenantForm.name.trim(), owner_id: userId }, token);
      try { await api.addTenantUser(created.tenants_tenant_id, userId, token); } catch {}
      await loadTenants();
      setSelectedTenantId(created.tenants_tenant_id);
      setShowCreateTenant(false);
      setTenantForm({ name: '' });
      flash('Проект создан');
    } catch (err) { setError(err.message); }
  };

  const handleBuyPlan = async (e) => {
    e.preventDefault();
    if (!selectedPlanId || !selectedTenantId) return;
    setError(null);
    const plan = plans.find(p => p.plans_plan_id === selectedPlanId);
    if (!plan) return;
    try {
      await api.createTenantQuota({
        tenant_id: selectedTenantId,
        plan_id: selectedPlanId,
        total_price: plan.plans_price || 0,
        total_cpu_limit: plan.plans_cpu_limit || 0,
        total_ram_limit: plan.plans_ram_limit || 0,
        total_disk_limit: plan.plans_disk_limit || 0
      }, token);
      await loadTenantData(selectedTenantId);
      setShowBuyPlan(false);
      setSelectedPlanId('');
      flash('Тариф приобретён. Ожидайте подтверждения оплаты.');
    } catch (err) { setError(err.message); }
  };

  const handleCustomRequest = async (e) => {
    e.preventDefault();
    if (!selectedTenantId) return;
    setError(null);
    try {
      await api.createCustomPlanRequest({
        tenant_id: selectedTenantId,
        cpu: Number(customForm.cpu),
        ram: Number(customForm.ram),
        disk: Number(customForm.disk)
      }, token);
      setShowCustomRequest(false);
      setCustomForm({ cpu: 4, ram: 8192, disk: 100 });
      flash('Заявка на кастомный тариф отправлена');
    } catch (err) { setError(err.message); }
  };

  const handleCreateVM = async (e) => {
    e.preventDefault();
    if (!selectedTenantId) return;
    setError(null);
    try {
      await api.createVirtualMachine({
        name: vmForm.name || 'Virtual Machine',
        cpu: Number(vmForm.cpu),
        ram: Number(vmForm.ram),
        disk: Number(vmForm.disk),
        status: 'ACTIVE',
        tenant_id: selectedTenantId,
        created_by: userId
      }, token);
      await loadTenantData(selectedTenantId);
      setShowCreateVM(false);
      setVmForm({ name: '', cpu: 2, ram: 4096, disk: 50 });
      flash('Виртуальная машина создана');
    } catch (err) { setError(err.message); }
  };

  const handleToggleVM = async (vmId, currentStatus) => {
    try {
      const next = currentStatus === 'ACTIVE' ? 'STOPPED' : 'ACTIVE';
      await api.updateVirtualMachine(vmId, { status: next }, token);
      await loadTenantData(selectedTenantId);
    } catch (err) { setError(err.message); }
  };

  const handleDeleteVM = async (vmId) => {
    if (!window.confirm('Удалить виртуальную машину?')) return;
    try {
      await api.deleteVirtualMachine(vmId, token);
      await loadTenantData(selectedTenantId);
      flash('ВМ удалена');
    } catch (err) { setError(err.message); }
  };

  const paidQuotas = quotas.filter(q => (q.tenant_quotas_payment_status || q.payment_status) === 'PAID');
  const totalLimits = paidQuotas.reduce((a, q) => ({
    cpu: a.cpu + (q.tenant_quotas_total_cpu_limit || 0),
    ram: a.ram + (q.tenant_quotas_total_ram_limit || 0),
    disk: a.disk + (q.tenant_quotas_total_disk_limit || 0)
  }), { cpu: 0, ram: 0, disk: 0 });
  const usedRes = vms.reduce((a, v) => ({
    cpu: a.cpu + (v.virtual_machines_cpu || 0),
    ram: a.ram + (v.virtual_machines_ram || 0),
    disk: a.disk + (v.virtual_machines_disk || 0)
  }), { cpu: 0, ram: 0, disk: 0 });
  const hasPaid = paidQuotas.length > 0;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <section className="dash-welcome">
        <div>
          <h2 className="dash-welcome-title">Добро пожаловать, {user?.users_username || 'Пользователь'}</h2>
          <p className="dash-welcome-desc">Управляйте проектами, квотами и виртуальными машинами</p>
        </div>
        <button type="button" onClick={logout} className="mts-btn small secondary">Выйти</button>
      </section>

      {error && <div className="error-message" onClick={() => setError(null)}>{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Tenants */}
      <section className="dash-section">
        <div className="dash-section-header">
          <div>
            <h3 className="dash-section-title">Мои проекты</h3>
            <p className="dash-section-desc">Изолированные рабочие пространства для ваших ресурсов</p>
          </div>
          <button type="button" className="mts-btn primary" onClick={() => { setShowCreateTenant(!showCreateTenant); setError(null); }}>
            {showCreateTenant ? 'Отмена' : '+ Новый проект'}
          </button>
        </div>

        {showCreateTenant && (
          <GlassCard className="glass-card-form dash-inline-form">
            <form onSubmit={handleCreateTenant}>
              <div className="form-group">
                <label htmlFor="tenant-name">Название проекта</label>
                <input id="tenant-name" type="text" value={tenantForm.name} onChange={e => setTenantForm({ name: e.target.value })} placeholder="Мой проект" required />
              </div>
              <div className="form-actions">
                <button type="button" className="mts-btn secondary" onClick={() => setShowCreateTenant(false)}>Отмена</button>
                <button type="submit" className="mts-btn primary">Создать</button>
              </div>
            </form>
          </GlassCard>
        )}

        {tenants.length === 0 ? (
          <GlassCard className="glass-card-form">
            <div className="empty-state-centered">
              <div className="empty-state-icon">📁</div>
              <h4>У вас пока нет проектов</h4>
              <p>Создайте первый проект, чтобы начать работу с облачными ресурсами</p>
            </div>
          </GlassCard>
        ) : (
          <div className="tenant-cards">
            {tenants.map(t => (
              <div
                key={t.tenants_tenant_id}
                className={`tenant-card ${t.tenants_tenant_id === selectedTenantId ? 'active' : ''}`}
                onClick={() => setSelectedTenantId(t.tenants_tenant_id)}
              >
                <div className="tenant-card-top">
                  <h4 className="tenant-card-name">{t.tenants_name}</h4>
                  <span className={`status-badge status-${t.tenants_status || 'ACTIVE'}`}>{t.tenants_status || 'ACTIVE'}</span>
                </div>
                <p className="tenant-card-id">ID: {t.tenants_tenant_id?.slice(0, 8)}…</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Selected Tenant Detail */}
      {selectedTenant && (
        <>
          {/* Resource Overview */}
          <section className="dash-section">
            <h3 className="dash-section-title">Ресурсы: {selectedTenant.tenants_name}</h3>
            {hasPaid ? (
              <div className="resource-overview">
                <ResourceBar label="CPU" used={usedRes.cpu} limit={totalLimits.cpu} unit="ядер" />
                <ResourceBar label="RAM" used={usedRes.ram} limit={totalLimits.ram} unit="MB" />
                <ResourceBar label="Disk" used={usedRes.disk} limit={totalLimits.disk} unit="GB" />
              </div>
            ) : (
              <GlassCard className="glass-card-form">
                <div className="empty-state-centered">
                  <div className="empty-state-icon">📊</div>
                  <h4>Нет оплаченных квот</h4>
                  <p>Приобретите тариф и дождитесь подтверждения оплаты, чтобы получить ресурсы</p>
                </div>
              </GlassCard>
            )}
          </section>

          {/* Quotas & Plans */}
          <section className="dash-section">
            <div className="dash-section-header">
              <div>
                <h3 className="dash-section-title">Тарифы и квоты</h3>
                <p className="dash-section-desc">Управление ресурсными лимитами проекта</p>
              </div>
              <div className="dash-actions-row">
                <button type="button" className="mts-btn primary" onClick={() => { setShowBuyPlan(!showBuyPlan); setShowCustomRequest(false); }}>
                  {showBuyPlan ? 'Отмена' : 'Купить тариф'}
                </button>
                <button type="button" className="mts-btn secondary" onClick={() => { setShowCustomRequest(!showCustomRequest); setShowBuyPlan(false); }}>
                  {showCustomRequest ? 'Отмена' : 'Кастомный запрос'}
                </button>
              </div>
            </div>

            {showBuyPlan && (
              <GlassCard className="glass-card-form dash-inline-form">
                <h4 className="dash-form-title">Выберите тариф</h4>
                {plans.length === 0 ? (
                  <p className="text-secondary">Нет доступных тарифов</p>
                ) : (
                  <form onSubmit={handleBuyPlan}>
                    <div className="plan-grid">
                      {plans.map(p => (
                        <label key={p.plans_plan_id} className={`plan-option ${selectedPlanId === p.plans_plan_id ? 'selected' : ''}`}>
                          <input type="radio" name="plan" value={p.plans_plan_id} checked={selectedPlanId === p.plans_plan_id} onChange={e => setSelectedPlanId(e.target.value)} />
                          <div className="plan-option-body">
                            <span className="plan-option-name">{p.plans_name}</span>
                            <span className="plan-option-price">{p.plans_price ? `${p.plans_price} ₽` : 'Бесплатно'}</span>
                            <div className="plan-option-specs">
                              <span>CPU: {p.plans_cpu_limit}</span>
                              <span>RAM: {p.plans_ram_limit} MB</span>
                              <span>Disk: {p.plans_disk_limit} GB</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="mts-btn primary" disabled={!selectedPlanId}>Оформить</button>
                    </div>
                  </form>
                )}
              </GlassCard>
            )}

            {showCustomRequest && (
              <GlassCard className="glass-card-form dash-inline-form">
                <h4 className="dash-form-title">Запрос кастомного тарифа</h4>
                <p className="dash-section-desc">Укажите нужные ресурсы — администратор рассмотрит заявку</p>
                <form onSubmit={handleCustomRequest}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>CPU (ядра)</label>
                      <input type="number" min="1" value={customForm.cpu} onChange={e => setCustomForm(f => ({ ...f, cpu: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>RAM (MB)</label>
                      <input type="number" min="512" step="512" value={customForm.ram} onChange={e => setCustomForm(f => ({ ...f, ram: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Disk (GB)</label>
                      <input type="number" min="10" step="10" value={customForm.disk} onChange={e => setCustomForm(f => ({ ...f, disk: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="mts-btn primary">Отправить заявку</button>
                  </div>
                </form>
              </GlassCard>
            )}

            {quotas.length === 0 ? (
              <div className="empty-hint">Квот ещё нет. Приобретите тариф или отправьте кастомный запрос.</div>
            ) : (
              <div className="quota-cards">
                {quotas.map(q => {
                  const status = q.tenant_quotas_payment_status || q.payment_status || 'UNPAID';
                  const planObj = plans.find(p => p.plans_plan_id === (q.tenant_quotas_plan_id || q.plan_id));
                  return (
                    <div key={q.tenant_quotas_quota_id || q.quota_id} className={`quota-card quota-${status}`}>
                      <div className="quota-card-header">
                        <span className="quota-plan-name">{planObj?.plans_name || 'Тариф'}</span>
                        <span className={`status-badge status-${status}`}>{PAYMENT_LABELS[status] || status}</span>
                      </div>
                      <div className="quota-card-specs">
                        <span>CPU: {q.tenant_quotas_total_cpu_limit || q.total_cpu_limit}</span>
                        <span>RAM: {q.tenant_quotas_total_ram_limit || q.total_ram_limit} MB</span>
                        <span>Disk: {q.tenant_quotas_total_disk_limit || q.total_disk_limit} GB</span>
                      </div>
                      {(q.tenant_quotas_total_price || q.total_price) > 0 && (
                        <div className="quota-price">{q.tenant_quotas_total_price || q.total_price} ₽</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Virtual Machines */}
          <section className="dash-section">
            <div className="dash-section-header">
              <div>
                <h3 className="dash-section-title">Виртуальные машины</h3>
                <p className="dash-section-desc">{vms.length} {vms.length === 1 ? 'машина' : vms.length < 5 ? 'машины' : 'машин'}</p>
              </div>
              <button
                type="button"
                className="mts-btn primary"
                disabled={!hasPaid}
                title={hasPaid ? '' : 'Нужна оплаченная квота'}
                onClick={() => { setShowCreateVM(!showCreateVM); setError(null); }}
              >
                {showCreateVM ? 'Отмена' : '+ Создать ВМ'}
              </button>
            </div>

            {!hasPaid && (
              <div className="empty-hint">Для создания ВМ необходима оплаченная квота. Приобретите тариф выше.</div>
            )}

            {showCreateVM && hasPaid && (
              <GlassCard className="glass-card-form dash-inline-form">
                <h4 className="dash-form-title">Новая виртуальная машина</h4>
                <form onSubmit={handleCreateVM}>
                  <div className="form-group">
                    <label>Название</label>
                    <input type="text" value={vmForm.name} onChange={e => setVmForm(f => ({ ...f, name: e.target.value }))} placeholder="my-vm-01" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>CPU (ядра)</label>
                      <input type="number" min="1" max="16" value={vmForm.cpu} onChange={e => setVmForm(f => ({ ...f, cpu: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>RAM (MB)</label>
                      <input type="number" min="512" step="512" value={vmForm.ram} onChange={e => setVmForm(f => ({ ...f, ram: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Disk (GB)</label>
                      <input type="number" min="10" step="10" value={vmForm.disk} onChange={e => setVmForm(f => ({ ...f, disk: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="mts-btn secondary" onClick={() => setShowCreateVM(false)}>Отмена</button>
                    <button type="submit" className="mts-btn primary">Создать ВМ</button>
                  </div>
                </form>
              </GlassCard>
            )}

            {vms.length > 0 && (
              <div className="vm-grid">
                {vms.map(vm => {
                  const status = vm.virtual_machines_status || 'INACTIVE';
                  return (
                    <GlassCard key={vm.virtual_machines_vm_id} className="vm-card">
                      <div className="vm-card-inner">
                        <div className="vm-header">
                          <h4 className="vm-name">{vm.virtual_machines_name || 'Без названия'}</h4>
                          <span className={`status-badge status-${status}`}>{STATUS_LABELS[status] || status}</span>
                        </div>
                        <div className="vm-specs">
                          <div className="spec-item"><span className="label">CPU</span><span className="value">{vm.virtual_machines_cpu} ядер</span></div>
                          <div className="spec-item"><span className="label">RAM</span><span className="value">{vm.virtual_machines_ram} MB</span></div>
                          <div className="spec-item"><span className="label">Disk</span><span className="value">{vm.virtual_machines_disk} GB</span></div>
                        </div>
                        <div className="vm-actions">
                          <button type="button" className="mts-btn small primary" onClick={() => handleToggleVM(vm.virtual_machines_vm_id, status)}>
                            {status === 'ACTIVE' ? 'Остановить' : 'Запустить'}
                          </button>
                          <button type="button" className="mts-btn small danger" onClick={() => handleDeleteVM(vm.virtual_machines_vm_id)}>Удалить</button>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}

            {vms.length === 0 && hasPaid && !showCreateVM && (
              <GlassCard className="glass-card-form">
                <div className="empty-state-centered">
                  <div className="empty-state-icon">🖥️</div>
                  <h4>Нет виртуальных машин</h4>
                  <p>Создайте первую ВМ, чтобы начать работу</p>
                </div>
              </GlassCard>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ResourceBar({ label, used, limit, unit }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const isHigh = pct > 80;
  return (
    <div className="resource-bar-wrap">
      <div className="resource-bar-header">
        <span className="resource-bar-label">{label}</span>
        <span className="resource-bar-values">{used} / {limit} {unit}</span>
      </div>
      <div className="resource-bar-track">
        <div className={`resource-bar-fill ${isHigh ? 'high' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default DashboardPage;
