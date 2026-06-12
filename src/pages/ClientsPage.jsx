import React, { useState, useMemo } from 'react';
import { initialClients, CLIENT_STATUSES } from '../data/mockData';

// ── Client Modal (Add / Edit) ─────────────────────────────
function ClientModal({ client, onClose, onSave }) {
  const isEdit = !!client?.id;
  const [form, setForm] = useState(
    client || {
      name: '', email: '', phone: '', address: '', notes: '',
      status: 'active', joinDate: new Date().toISOString().slice(0, 10),
      avatar: '', avatarColor: '#6366f1',
      totalPurchases: 0, totalSpent: 0,
    }
  );

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#a855f7', '#ec4899', '#64748b'];

  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function set(key, val) {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'name') next.avatar = initials(val);
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, avatar: initials(form.name), id: isEdit ? form.id : Date.now(), lastVisit: form.lastVisit || form.joinDate });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Avatar preview + color picker */}
            <div className="avatar-picker">
              <div
                className="avatar avatar-lg"
                style={{ background: form.avatarColor, color: '#fff', fontSize: 20 }}
              >
                {initials(form.name) || '?'}
              </div>
              <div className="color-options">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-dot ${form.avatarColor === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => set('avatarColor', c)}
                  />
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej. María López" required />
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                  {CLIENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (809) 555-0000" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Calle, número, sector" />
            </div>

            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observaciones sobre el cliente..." />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? '💾 Guardar cambios' : '✅ Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Client Detail Panel ───────────────────────────────────
function ClientDetail({ client, onClose, onEdit }) {
  if (!client) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 className="modal-title">Detalle de Cliente</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Header card */}
        <div className="client-detail-header">
          <div className="avatar avatar-lg" style={{ background: client.avatarColor, color: '#fff', fontSize: 22 }}>
            {client.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{client.name}</div>
            <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-rose'}`}>
              {client.status === 'active' ? '● Activo' : '● Inactivo'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="client-stats-grid">
          <div className="client-stat">
            <div className="client-stat-value">{client.totalPurchases}</div>
            <div className="client-stat-label">Compras</div>
          </div>
          <div className="client-stat">
            <div className="client-stat-value" style={{ color: 'var(--accent-green)' }}>
              ${client.totalSpent.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
            </div>
            <div className="client-stat-label">Total gastado</div>
          </div>
          <div className="client-stat">
            <div className="client-stat-value">{client.lastVisit}</div>
            <div className="client-stat-label">Última visita</div>
          </div>
        </div>

        {/* Details */}
        <div className="client-detail-rows">
          {client.email && <div className="client-detail-row"><span>📧</span><span>{client.email}</span></div>}
          {client.phone && <div className="client-detail-row"><span>📱</span><span>{client.phone}</span></div>}
          {client.address && <div className="client-detail-row"><span>📍</span><span>{client.address}</span></div>}
          <div className="client-detail-row"><span>📅</span><span>Cliente desde {client.joinDate}</span></div>
          {client.notes && (
            <div className="client-detail-row client-notes">
              <span>📝</span><span>{client.notes}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={() => onEdit(client)}>✏️ Editar</button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete ────────────────────────────────────────
function ConfirmDelete({ client, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">🗑️ Eliminar Cliente</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          ¿Estás seguro de que deseas eliminar a <strong style={{ color: 'var(--text-primary)' }}>{client?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>🗑️ Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── Clients Page ──────────────────────────────────────────
export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'detail' | 'delete'
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = clients.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'purchases') return b.totalPurchases - a.totalPurchases;
      if (sortBy === 'last') return b.lastVisit.localeCompare(a.lastVisit);
      return 0;
    });

    return list;
  }, [clients, search, statusFilter, sortBy]);

  function openDetail(c) { setSelected(c); setModal('detail'); }
  function openEdit(c)   { setSelected(c); setModal('edit'); }
  function openDelete(c) { setSelected(c); setModal('delete'); }
  function closeModal()  { setModal(null); setSelected(null); }

  function handleSave(data) {
    if (data.id && clients.find(c => c.id === data.id)) {
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      setClients(prev => [...prev, data]);
    }
    closeModal();
  }

  function handleDelete() {
    setClients(prev => prev.filter(c => c.id !== selected.id));
    closeModal();
  }

  const activeCount = clients.filter(c => c.status === 'active').length;
  const totalSpent = clients.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clients.length} clientes registrados · {activeCount} activos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          ＋ Nuevo Cliente
        </button>
      </div>

      {/* Summary cards */}
      <div className="clients-summary">
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#6366f122', color: '#818cf8' }}>👥</span>
          <div>
            <div className="summary-chip-value">{clients.length}</div>
            <div className="summary-chip-label">Total</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#10b98122', color: '#34d399' }}>✅</span>
          <div>
            <div className="summary-chip-value">{activeCount}</div>
            <div className="summary-chip-label">Activos</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#f43f5e22', color: '#fb7185' }}>💤</span>
          <div>
            <div className="summary-chip-value">{clients.length - activeCount}</div>
            <div className="summary-chip-label">Inactivos</div>
          </div>
        </div>
        <div className="summary-chip">
          <span className="summary-chip-icon" style={{ background: '#f59e0b22', color: '#fbbf24' }}>💰</span>
          <div>
            <div className="summary-chip-value">${(totalSpent / 1000).toFixed(1)}k</div>
            <div className="summary-chip-label">Ingresos totales</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="clients-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            className="form-select"
            style={{ width: 'auto', padding: '10px 36px 10px 14px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '10px 36px 10px 14px' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Ordenar: Nombre</option>
            <option value="spent">Ordenar: Mayor gasto</option>
            <option value="purchases">Ordenar: Más compras</option>
            <option value="last">Ordenar: Última visita</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="results-count">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        {search && ` para "${search}"`}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div className="page-title" style={{ fontSize: 18 }}>Sin resultados</div>
          <div className="text-muted mt-2">Intenta con otra búsqueda o filtro</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Compras</th>
                <th>Total gastado</th>
                <th>Última visita</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(c)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: c.avatarColor, color: '#fff' }}>
                        {c.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div className="text-xs text-muted">Desde {c.joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">{c.email || '—'}</div>
                    <div className="text-xs text-muted">{c.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{c.totalPurchases}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                    ${c.totalSpent.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-sm text-muted">{c.lastVisit}</td>
                  <td>
                    <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-rose'}`}>
                      {c.status === 'active' ? '● Activo' : '● Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ display: 'flex', gap: 6, justifyContent: 'center' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="btn-icon"
                        title="Ver detalle"
                        onClick={() => openDetail(c)}
                      >👁️</button>
                      <button
                        className="btn-icon"
                        title="Editar"
                        onClick={() => openEdit(c)}
                      >✏️</button>
                      <button
                        className="btn-icon"
                        title="Eliminar"
                        style={{ color: 'var(--accent-rose)' }}
                        onClick={() => openDelete(c)}
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <ClientModal
          client={modal === 'edit' ? selected : null}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
      {modal === 'detail' && (
        <ClientDetail
          client={selected}
          onClose={closeModal}
          onEdit={c => { setSelected(c); setModal('edit'); }}
        />
      )}
      {modal === 'delete' && (
        <ConfirmDelete
          client={selected}
          onClose={closeModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
