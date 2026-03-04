import React from 'react';
import GlassCard from '../UI/GlassCard';

const STATUS_LABELS = {
  ACTIVE: 'Запущена',
  STOPPED: 'Остановлена',
  INACTIVE: 'Неактивна'
};

function VMList({ vms, onDelete, onRefresh, onStartStop }) {
  if (!vms?.length) {
    return (
      <GlassCard className="vm-empty-card">
        <div className="empty-state empty-state-vm">
          <div className="empty-state-icon">🖥️</div>
          <h3 className="empty-state-title">Виртуальные машины не найдены</h3>
          <p className="empty-state-desc">Создайте первую ВМ, чтобы начать работу</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="vm-grid" role="list">
      {vms.map(vm => {
        const status = vm.virtual_machines_status || 'INACTIVE';
        return (
          <GlassCard key={vm.virtual_machines_vm_id} className="vm-card" role="listitem">
            <div className="vm-card-inner">
              <div className="vm-header">
                <h4 className="vm-name">{vm.virtual_machines_name || 'Без названия'}</h4>
                <span className={`status-badge status-${status}`}>
                  {STATUS_LABELS[status] || status}
                </span>
              </div>

              <div className="vm-specs">
                <div className="spec-item">
                  <span className="label">CPU</span>
                  <span className="value">{vm.virtual_machines_cpu} ядра</span>
                </div>
                <div className="spec-item">
                  <span className="label">RAM</span>
                  <span className="value">{vm.virtual_machines_ram} MB</span>
                </div>
                <div className="spec-item">
                  <span className="label">Disk</span>
                  <span className="value">{vm.virtual_machines_disk} GB</span>
                </div>
              </div>

              <div className="vm-actions">
                <button
                  type="button"
                  className="mts-btn small primary"
                  onClick={() => status === 'ACTIVE' ? onStartStop?.(vm.virtual_machines_vm_id, 'STOPPED') : onStartStop?.(vm.virtual_machines_vm_id, 'ACTIVE')}
                >
                  {status === 'ACTIVE' ? 'Остановить' : 'Запустить'}
                </button>
                <button
                  type="button"
                  className="mts-btn small danger"
                  onClick={() => onDelete(vm.virtual_machines_vm_id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

export default VMList;