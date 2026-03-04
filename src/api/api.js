/**
 * MTS Hackathon API Client
 * Все запросы к API: https://mts-hackathon.onrender.com/docs
 * Использование: fetch API (нативный)
 * Экспорт: ES Modules (для Vite/React)
 */

// ============================================================================
// ⚙️ КОНФИГУРАЦИЯ
// ============================================================================

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
export const BASE_URL = isDev ? '/api' : 'https://mts-hackathon.onrender.com';

const HEADERS = {
  'Content-Type': 'application/json',
};

export const getAuthHeaders = (token) => ({
  ...HEADERS,
  ...(token && { 'Authorization': `Bearer ${token}` })
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = Array.isArray(error.detail)
      ? error.detail.map((e) => e.msg || JSON.stringify(e)).join(', ')
      : (error.detail || `HTTP error! status: ${response.status}`);
    throw new Error(message);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// ============================================================================
// 🔐 AUTH
// ============================================================================

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

// ============================================================================
// 👥 USERS
// ============================================================================

export async function getUsers(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/users/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createUser(userData, token = null) {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
}

export async function getUser(identifier, token = null) {
  const response = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(identifier)}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function updateUser(userId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteUser(userId, token = null) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

/** Список ролей пользователей (user, admin). Документация: /users/roles */
export async function getUserRoles(token = null) {
  const response = await fetch(`${BASE_URL}/users/roles`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

// ============================================================================
// 📋 PLANS
// ============================================================================

export async function getPlans(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/plans/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createPlan(planData, token = null) {
  const response = await fetch(`${BASE_URL}/plans/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(planData)
  });
  return handleResponse(response);
}

export async function getPlan(planId, token = null) {
  const response = await fetch(
    `${BASE_URL}/plans/${planId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function updatePlan(planId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/plans/${planId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deletePlan(planId, token = null) {
  const response = await fetch(`${BASE_URL}/plans/${planId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

// ============================================================================
// 🏢 TENANTS
// ============================================================================

export async function getTenants(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createTenant(tenantData, token = null) {
  const response = await fetch(`${BASE_URL}/tenants/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(tenantData)
  });
  return handleResponse(response);
}

export async function getTenant(tenantId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/${tenantId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function updateTenant(tenantId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/tenants/${tenantId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteTenant(tenantId, token = null) {
  const response = await fetch(`${BASE_URL}/tenants/${tenantId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function getTenantsByOwner(ownerId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/owner/${ownerId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function getTenantUsers(tenantId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/${tenantId}/users`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

/** Добавить пользователя в тенант (если бэкенд поддерживает POST /tenants/{id}/users) */
export async function addTenantUser(tenantId, userId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/${tenantId}/users`,
    {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ user_id: userId })
    }
  );
  return handleResponse(response);
}

export async function getUserTenants(userId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenants/user/${userId}/all`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

// ============================================================================
// 📊 TENANT QUOTAS (лимиты ресурсов для тенантов)
// ============================================================================

export async function getTenantQuotas(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenant_quotas/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createTenantQuota(quotaData, token = null) {
  const response = await fetch(`${BASE_URL}/tenant_quotas/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(quotaData)
  });
  return handleResponse(response);
}

export async function getTenantQuota(quotaId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenant_quotas/${quotaId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function getTenantQuotasByTenant(tenantId, token = null) {
  const response = await fetch(
    `${BASE_URL}/tenant_quotas/tenant/${tenantId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function updateTenantQuota(quotaId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/tenant_quotas/${quotaId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteTenantQuota(quotaId, token = null) {
  const response = await fetch(`${BASE_URL}/tenant_quotas/${quotaId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function getPaymentStatuses(token = null) {
  const response = await fetch(`${BASE_URL}/tenant_quotas/payment_statuses`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

// ============================================================================
// 💻 VIRTUAL MACHINES
// ============================================================================

export async function getVirtualMachines({ skip = 0, limit = 100, tenant_id = null, created_by = null } = {}, token = null) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (tenant_id) params.append('tenant_id', tenant_id);
  if (created_by) params.append('created_by', created_by);
  
  const response = await fetch(
    `${BASE_URL}/virtual_machines/?${params}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createVirtualMachine(vmData, token = null) {
  const response = await fetch(`${BASE_URL}/virtual_machines/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(vmData)
  });
  return handleResponse(response);
}

export async function getVirtualMachine(vmId, token = null) {
  const response = await fetch(
    `${BASE_URL}/virtual_machines/${vmId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

/** Доступные статусы ВМ: ACTIVE, STOPPED, INACTIVE. Документация: /virtual_machines/statuses */
export async function getVmStatuses(token = null) {
  const response = await fetch(`${BASE_URL}/virtual_machines/statuses`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function updateVirtualMachine(vmId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/virtual_machines/${vmId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteVirtualMachine(vmId, token = null) {
  const response = await fetch(`${BASE_URL}/virtual_machines/${vmId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

// ============================================================================
// 📜 VM LOGS
// ============================================================================

export async function getVmLogs(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/vm_logs/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createVmLog(logData, token = null) {
  const response = await fetch(`${BASE_URL}/vm_logs/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(logData)
  });
  return handleResponse(response);
}

export async function getVmLog(logId, token = null) {
  const response = await fetch(
    `${BASE_URL}/vm_logs/${logId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function updateVmLog(logId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/vm_logs/${logId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteVmLog(logId, token = null) {
  const response = await fetch(`${BASE_URL}/vm_logs/${logId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function getVmLogsByVm(vmId, token = null) {
  const response = await fetch(
    `${BASE_URL}/vm_logs/vm/${vmId}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

// ============================================================================
// 📝 CUSTOM PLAN REQUESTS
// ============================================================================

export async function getCustomPlanRequests(skip = 0, limit = 100, token = null) {
  const response = await fetch(
    `${BASE_URL}/custom_plan_requests/?skip=${skip}&limit=${limit}`,
    { headers: getAuthHeaders(token) }
  );
  return handleResponse(response);
}

export async function createCustomPlanRequest(requestData, token = null) {
  const response = await fetch(`${BASE_URL}/custom_plan_requests/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(requestData)
  });
  return handleResponse(response);
}

export async function getCustomPlanRequestStatuses(token = null) {
  const response = await fetch(`${BASE_URL}/custom_plan_requests/statuses`, {
    headers: getAuthHeaders(token)
  });
  return handleResponse(response);
}

export async function updateCustomPlanRequest(requestId, updateData, token = null) {
  const response = await fetch(`${BASE_URL}/custom_plan_requests/${requestId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

// ============================================================================
// 🏠 ROOT / HEALTH CHECK
// ============================================================================

export async function getRoot() {
  const response = await fetch(`${BASE_URL}/`);
  return handleResponse(response);
}

// ============================================================================
// 🎯 DEFAULT EXPORT (обязательно для import * as api)
// ============================================================================

export default {
  BASE_URL,
  getAuthHeaders,
  handleResponse,
  login,
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserRoles,
  getPlans,
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
  getTenants,
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
  getTenantsByOwner,
  getTenantUsers,
  addTenantUser,
  getUserTenants,
  getTenantQuotas,
  createTenantQuota,
  getTenantQuota,
  getTenantQuotasByTenant,
  updateTenantQuota,
  deleteTenantQuota,
  getPaymentStatuses,
  getVirtualMachines,
  createVirtualMachine,
  getVirtualMachine,
  getVmStatuses,
  updateVirtualMachine,
  deleteVirtualMachine,
  getVmLogs,
  createVmLog,
  getVmLog,
  updateVmLog,
  deleteVmLog,
  getVmLogsByVm,
  getCustomPlanRequests,
  createCustomPlanRequest,
  getCustomPlanRequestStatuses,
  updateCustomPlanRequest,
  getRoot
};