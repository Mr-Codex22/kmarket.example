import React from 'react';
import { initialClients, initialSales, initialProducts, weeklyStats } from '../data/mockData';

// ── KPI Card ──────────────────────────────────────────────
function KpiCard({ label, value, sub, trend, color }) {
  const trendUp = trend >= 0;
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: color + '15', color }}>
        <span style={{ fontSize: 16, fontWeight: 800 }}>
          {label === 'Ingresos (semana)' ? '$' : label === 'Ventas hoy' ? '#' : label === 'Clientes activos' ? '◉' : '▢'}
        </span>
      </div>
      <div className="kpi-body">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-sub">
          <span className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span>{sub}</span>
        </div>
      </div>
    </div>
  );
}

// ── Bar Chart (pure CSS) ──────────────────────────────────
function WeeklyChart({ data }) {
  const max = Math.max(...data.map(d => d.sales));
  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((d, i) => (
          <div key={i} className="chart-col">
            <div className="chart-bar-wrap">
              <div
                className="chart-bar"
                style={{ height: `${(d.sales / max) * 100}%` }}
                title={`${d.day}: ${d.sales} ventas`}
              >
                <span className="chart-bar-tooltip">{d.sales}</span>
              </div>
            </div>
            <div className="chart-label">{d.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent Sales Table ────────────────────────────────────
function RecentSales({ sales }) {
  const paymentLabel = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia' };
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th># Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Método</th>
            <th style={{ textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td><span className="badge badge-indigo">{s.id}</span></td>
              <td>{s.clientName}</td>
              <td className="text-muted text-sm">{s.date}</td>
              <td>{paymentLabel[s.paymentMethod] || '—'}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: '#2d8a4e' }}>
                ${s.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Low Stock Alert ───────────────────────────────────────
function LowStockAlert({ products }) {
  const low = products.filter(p => p.stock <= p.minStock);
  return (
    <div className="stock-list">
      {low.length === 0 ? (
        <div className="empty-state">Todo el stock está en orden</div>
      ) : (
        low.map(p => (
          <div key={p.id} className="stock-item">
            <div className="stock-item-left">
              <span className="stock-dot" style={{ background: p.stock === 0 ? '#dc2626' : '#d97706' }} />
              <div>
                <div className="stock-name">{p.name}</div>
                <div className="text-xs text-muted">{p.sku} · {p.category}</div>
              </div>
            </div>
            <div className="stock-qty">
              <span className={`badge ${p.stock === 0 ? 'badge-rose' : 'badge-amber'}`}>
                {p.stock === 0 ? 'Sin stock' : `${p.stock} unid.`}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Top Clients ───────────────────────────────────────────
function TopClients({ clients }) {
  const top = [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  return (
    <div className="top-clients-list">
      {top.map((c, i) => (
        <div key={c.id} className="top-client-item">
          <div className="top-client-rank">#{i + 1}</div>
          <div className="avatar avatar-sm" style={{ background: c.avatarColor, color: '#fff' }}>
            {c.avatar}
          </div>
          <div className="top-client-info">
            <div className="top-client-name">{c.name}</div>
            <div className="text-xs text-muted">{c.totalPurchases} compras</div>
          </div>
          <div className="top-client-spent">${c.totalSpent.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────
export default function DashboardHome() {
  const totalRevenue = initialSales.reduce((sum, s) => sum + s.total, 0);
  const totalClients = initialClients.length;
  const activeClients = initialClients.filter(c => c.status === 'active').length;
  const totalProducts = initialProducts.length;
  const todaySales = initialSales.filter(s => s.date === '2026-06-12');

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general de tu negocio</p>
        </div>
        <button className="btn btn-primary">
          + Nueva Venta
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          label="Ingresos (semana)"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="vs semana anterior"
          trend={12.4}
          color="#00fd3f93"
        />
        <KpiCard
          label="Ventas hoy"
          value={todaySales.length}
          sub="transacciones"
          trend={8.1}
          color="#225ab3ff"
        />
        <KpiCard
          label="Clientes activos"
          value={activeClients}
          sub={`de ${totalClients} totales`}
          trend={3.5}
          color="#0891b2"
        />
        <KpiCard
          label="Productos"
          value={totalProducts}
          sub="en catálogo"
          trend={-1.2}
          color="#d97706"
        />
      </div>

      {/* Charts row */}
      <div className="dashboard-grid-2">
        {/* Weekly chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ventas por día</div>
              <div className="card-subtitle">Semana actual</div>
            </div>
            <span className="badge badge-green">Esta semana</span>
          </div>
          <WeeklyChart data={weeklyStats} />
        </div>

        {/* Top clients */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top Clientes</div>
              <div className="card-subtitle">Por gasto total</div>
            </div>
            <span className="badge badge-indigo">Top 5</span>
          </div>
          <TopClients clients={initialClients} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="dashboard-grid-3">
        {/* Recent sales */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Últimas Ventas</div>
              <div className="card-subtitle">Transacciones recientes</div>
            </div>
            <button className="btn btn-secondary btn-sm">Ver todo</button>
          </div>
          <RecentSales sales={initialSales.slice(0, 5)} />
        </div>

        {/* Low stock */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stock Bajo</div>
              <div className="card-subtitle">Requieren reposición</div>
            </div>
            <span className="badge badge-rose">Alerta</span>
          </div>
          <LowStockAlert products={initialProducts} />
        </div>
      </div>
    </div>
  );
}
