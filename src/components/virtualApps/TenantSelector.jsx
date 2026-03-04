import React from 'react';

function TenantSelector({ tenants, selected, onSelect }) {
  return (
    <div className="tenant-selector" role="group" aria-label="Выбор тенанта">
      <label htmlFor="tenant-select" className="tenant-selector-label">
        Тенант
      </label>
      <select
        id="tenant-select"
        className="tenant-selector-select"
        value={selected?.tenants_tenant_id || ''}
        onChange={(e) => {
          const tenant = tenants.find(t => t.tenants_tenant_id === e.target.value);
          onSelect(tenant);
        }}
        aria-label="Выберите тенант"
      >
        {tenants.map(tenant => (
          <option key={tenant.tenants_tenant_id} value={tenant.tenants_tenant_id}>
            {tenant.tenants_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TenantSelector;