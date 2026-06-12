import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardHome from './pages/DashboardHome';
import ClientsPage from './pages/ClientsPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [collapsed, setCollapsed] = useState(false);

  function renderPage() {
    switch (activePage) {
      case 'home':      return <DashboardHome />;
      case 'clients':   return <ClientsPage />;
      case 'sales':     return <PlaceholderPage title="Ventas" icon="🧾" description="Módulo de gestión de ventas y transacciones." />;
      case 'products':  return <PlaceholderPage title="Productos" icon="📦" description="Catálogo de productos y gestión de precios." />;
      case 'inventory': return <PlaceholderPage title="Inventario" icon="🗄️" description="Control de stock y movimientos de inventario." />;
      case 'reports':   return <PlaceholderPage title="Reportes" icon="📈" description="Reportes de ventas, ingresos y análisis del negocio." />;
      case 'settings':  return <PlaceholderPage title="Configuración" icon="⚙️" description="Ajustes del sistema, usuario y preferencias." />;
      default:          return <DashboardHome />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Topbar activePage={activePage} collapsed={collapsed} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
