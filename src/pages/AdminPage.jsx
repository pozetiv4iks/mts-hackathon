import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import GlassCard from '../components/UI/GlassCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const TABS = [
  { id: 'plans', label: 'Тарифы' },
  { id: 'quotas', label: 'Квоты' },
  { id: 'requests', label: 'Заявки' },
  { id: 'tenants', label: 'Тенанты' },
  { id: 'users', label: 'Пользователи' },
];

const PAYMENT_LABELS = { UNPAID: 'Не оплачено', PAID: 'Оплачено', REFUNDED: 'Возврат' };
const REQUEST_LABELS = { PENDING: 'На рассмотрении', APPROVED: 'Одобрено', REJECTED: 'Отклонено' };

function AdminPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState('plans');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [plans, setPlans] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [allQuotas, setAllQuotas] = useState([]);
  const [requests, setRequests] = useState([]);

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, cpu_limit: 4, ram_limit: 8192, disk_limit: 100 });

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const loadAll = useCallback(async () => {
    if (!token) return;
    try {
      const [p, t, u, q, r] = await Promise.all([
        api.getPlans(0, 100, token),
        api.getTenants(0, 100, token),
        api.getUsers(0, 100, token),
        api.getTenantQuotas(0, 200, token),
        api.getCustomPlanRequests(0, 100, token).catch(() => []),
      ]);
      setPlans(Array.isArray(p) ? p : []);
      setTenants(Array.isArray(t) ? t : []);
      setUsers(Array.isArray(u) ? u : []);
      setAllQuotas(Array.isArray(q) ? q : []);
      setRequests(Array.isArray(r) ? r : []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // --- Plans ---
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createPlan({
        name: planForm.name,
        price: Number(planForm.price),
        cpu_limit: Number(planForm.cpu_limit),
        ram_limit: Number(planForm.ram_limit),
        disk_limit: Number(planForm.disk_limit),
        is_custom: false
      }, token);
      const p = await api.getPlans(0, 100, token);
      setPlans(Array.isArray(p) ? p : []);
      setShowPlanForm(false);
      setPlanForm({ name: '', price: 0, cpu_limit: 4, ram_limit: 8192, disk_limit: 100 });
      flash('Тариф создан');
    } catch (err) { setError(err.message); }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Удалить тариф?')) return;
    try {
      await api.deletePlan(id, token);
      setPlans(prev => prev.filter(p => p.plans_plan_id !== id));
      flash('Тариф удалён');
    } catch (err) { setError(err.message); }
  };

  // --- Quotas ---
  const handleSetPaymentStatus = async (quotaId, status) => {
    setError(null);
    try {
      await api.updateTenantQuota(quotaId, { payment_status: status }, token);
      const q = await api.getTenantQuotas(0, 200, token);
      setAllQuotas(Array.isArray(q) ? q : []);
      flash(`Статус оплаты: ${PAYMENT_LABELS[status]}`);
    } catch (err) { setError(err.message); }
  };

  // --- Custom Requests ---
  const handleRequestAction = async (reqId, status) => {
    setError(null);
    try {
      await api.updateCustomPlanRequest(reqId, { status }, token);
      const r = await api.getCustomPlanRequests(0, 100, token);
      setRequests(Array.isArray(r) ? r : []);
      flash(`Заявка ${REQUEST_LABELS[status].toLowerCase()}`);
    } catch (err) { setError(err.message); }
  };

  const tenantName = (id) => tenants.find(t => t.tenants_tenant_id === id)?.tenants_name || id?.slice(0, 8) + '…';
  const userName = (id) => users.find(u => u.users_user_id === id)?.users_username || id?.slice(0, 8) + '…';

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">Панель администратора</h1>
        <p className="admin-subtitle">Управление тарифами, квотами, заявками и пользователями</p>
      </header>

      {error && <div className="error-message" onClick={() => setError(null)}>{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} type="button" className={`admin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* PLANS TAB */}
      {tab === 'plans' && (
        <GlassCard className="admin-section">
          <div className="admin-section-head">
            <div>
              <h2 className="admin-section-title">Тарифные планы</h2>
              <p className="admin-section-desc">Шаблоны ресурсов с лимитами CPU, RAM, Disk</p>
            </div>
            <button type="button" className="mts-btn primary" onClick={() => setShowPlanForm(!showPlanForm)}>
              {showPlanForm ? 'Отмена' : '+ Создать тариф'}
            </button>
          </div>

          {showPlanForm && (
            <form onSubmit={handleCreatePlan} className="dash-inline-form" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Название</label>
                <input type="text" value={planForm.name} onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))} placeholder="Starter, Pro, Enterprise..." required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CPU</label>
                  <input type="number" min="1" value={planForm.cpu_limit} onChange={e => setPlanForm(f => ({ ...f, cpu_limit: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>RAM (MB)</label>
                  <input type="number" min="512" value={planForm.ram_limit} onChange={e => setPlanForm(f => ({ ...f, ram_limit: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Disk (GB)</label>
                  <input type="number" min="10" value={planForm.disk_limit} onChange={e => setPlanForm(f => ({ ...f, disk_limit: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Цена (₽)</label>
                <input type="number" min="0" value={planForm.price} onChange={e => setPlanForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="form-actions">
                <button type="submit" className="mts-btn primary">Создать</button>
              </div>
            </form>
          )}

          {plans.length === 0 ? (
            <p className="empty-hint">Тарифов пока нет.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>CPU</th>
                    <th>RAM (MB)</th>
                    <th>Disk (GB)</th>
                    <th>Цена</th>
                    <th>Кастом</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(p => (
                    <tr key={p.plans_plan_id}>
                      <td><strong>{p.plans_name}</strong></td>
                      <td>{p.plans_cpu_limit}</td>
                      <td>{p.plans_ram_limit}</td>
                      <td>{p.plans_disk_limit}</td>
                      <td>{p.plans_price ? `${p.plans_price} ₽` : '—'}</td>
                      <td>{p.plans_is_custom ? 'Да' : 'Нет'}</td>
                      <td><button type="button" className="mts-btn small danger" onClick={() => handleDeletePlan(p.plans_plan_id)}>Удалить</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* QUOTAS TAB */}
      {tab === 'quotas' && (
        <GlassCard className="admin-section">
          <h2 className="admin-section-title">Квоты тенантов</h2>
          <p className="admin-section-desc">Управление оплатой и лимитами ресурсов</p>
          {allQuotas.length === 0 ? (
            <p className="empty-hint">Квот нет.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Тенант</th>
                    <th>Тариф</th>
                    <th>CPU</th>
                    <th>RAM</th>
                    <th>Disk</th>
                    <th>Цена</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {allQuotas.map(q => {
                    const qid = q.tenant_quotas_quota_id || q.quota_id;
                    const tid = q.tenant_quotas_tenant_id || q.tenant_id;
                    const pid = q.tenant_quotas_plan_id || q.plan_id;
                    const status = q.tenant_quotas_payment_status || q.payment_status || 'UNPAID';
                    const plan = plans.find(p => p.plans_plan_id === pid);
                    return (
                      <tr key={qid}>
                        <td>{tenantName(tid)}</td>
                        <td>{plan?.plans_name || '—'}</td>
                        <td>{q.tenant_quotas_total_cpu_limit || q.total_cpu_limit}</td>
                        <td>{q.tenant_quotas_total_ram_limit || q.total_ram_limit} MB</td>
                        <td>{q.tenant_quotas_total_disk_limit || q.total_disk_limit} GB</td>
                        <td>{(q.tenant_quotas_total_price || q.total_price) > 0 ? `${q.tenant_quotas_total_price || q.total_price} ₽` : '—'}</td>
                        <td><span className={`status-badge status-${status}`}>{PAYMENT_LABELS[status]}</span></td>
                        <td className="admin-action-cell">
                          {status !== 'PAID' && (
                            <button type="button" className="mts-btn small primary" onClick={() => handleSetPaymentStatus(qid, 'PAID')}>Подтвердить</button>
                          )}
                          {status === 'PAID' && (
                            <button type="button" className="mts-btn small danger" onClick={() => handleSetPaymentStatus(qid, 'REFUNDED')}>Возврат</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* REQUESTS TAB */}
      {tab === 'requests' && (
        <GlassCard className="admin-section">
          <h2 className="admin-section-title">Заявки на кастомные тарифы</h2>
          <p className="admin-section-desc">Рассмотрение запросов пользователей на индивидуальные ресурсы</p>
          {requests.length === 0 ? (
            <p className="empty-hint">Заявок нет.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Тенант</th>
                    <th>CPU</th>
                    <th>RAM</th>
                    <th>Disk</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => {
                    const rid = r.custom_plan_requests_request_id || r.request_id;
                    const tid = r.custom_plan_requests_tenant_id || r.tenant_id;
                    const status = r.custom_plan_requests_status || r.status || 'PENDING';
                    return (
                      <tr key={rid}>
                        <td>{tenantName(tid)}</td>
                        <td>{r.custom_plan_requests_cpu || r.cpu}</td>
                        <td>{r.custom_plan_requests_ram || r.ram} MB</td>
                        <td>{r.custom_plan_requests_disk || r.disk} GB</td>
                        <td><span className={`status-badge status-${status}`}>{REQUEST_LABELS[status]}</span></td>
                        <td className="admin-action-cell">
                          {status === 'PENDING' && (
                            <>
                              <button type="button" className="mts-btn small primary" onClick={() => handleRequestAction(rid, 'APPROVED')}>Одобрить</button>
                              <button type="button" className="mts-btn small danger" onClick={() => handleRequestAction(rid, 'REJECTED')}>Отклонить</button>
                            </>
                          )}
                          {status !== 'PENDING' && <span className="text-secondary">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* TENANTS TAB */}
      {tab === 'tenants' && (
        <GlassCard className="admin-section">
          <h2 className="admin-section-title">Тенанты (проекты)</h2>
          <p className="admin-section-desc">Все зарегистрированные проекты на платформе</p>
          {tenants.length === 0 ? (
            <p className="empty-hint">Тенантов нет.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>ID</th>
                    <th>Владелец</th>
                    <th>Статус</th>
                    <th>Квот</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => {
                    const tQuotas = allQuotas.filter(q => (q.tenant_quotas_tenant_id || q.tenant_id) === t.tenants_tenant_id);
                    return (
                      <tr key={t.tenants_tenant_id}>
                        <td><strong>{t.tenants_name}</strong></td>
                        <td className="admin-cell-mono">{t.tenants_tenant_id?.slice(0, 8)}…</td>
                        <td>{userName(t.tenants_owner_id)}</td>
                        <td><span className={`status-badge status-${t.tenants_status || 'ACTIVE'}`}>{t.tenants_status || 'ACTIVE'}</span></td>
                        <td>{tQuotas.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* USERS TAB */}
      {tab === 'users' && (
        <GlassCard className="admin-section">
          <h2 className="admin-section-title">Пользователи</h2>
          <p className="admin-section-desc">Все зарегистрированные пользователи платформы</p>
          {users.length === 0 ? (
            <p className="empty-hint">Пользователей нет.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Логин</th>
                    <th>ID</th>
                    <th>Роль</th>
                    <th>Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.users_user_id}>
                      <td><strong>{u.users_username}</strong></td>
                      <td className="admin-cell-mono">{u.users_user_id?.slice(0, 8)}…</td>
                      <td><span className={`status-badge status-${u.users_user_role === 'admin' ? 'ACTIVE' : 'STOPPED'}`}>{u.users_user_role}</span></td>
                      <td className="admin-cell-mono">{u.users_created_at ? new Date(u.users_created_at).toLocaleDateString('ru') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}

export default AdminPage;
