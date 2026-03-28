import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import CreateOrder from './pages/CreateOrder';
import Notifications from './pages/Notifications';
import { orders as initialOrders, notifications } from './data/mockData';
import './index.css';

const pageTitles = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  create: 'New Order',
  notifications: 'Notifications',
  detail: 'Order Detail',
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [orders, setOrders] = useState(() => {
  const saved = localStorage.getItem('orders');
  return saved ? JSON.parse(saved) : initialOrders;
});


  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = (p) => {
    setPage(p);
    setSidebarOpen(false);
  };

  const selectOrder = (id) => {
    setSelectedOrderId(id);
    setPage('detail');
  };

  const goBack = () => {
    setPage('orders');
    setSelectedOrderId(null);
  };

 const addOrder = (newOrder) => {
  const updated = [newOrder, ...orders];
  setOrders(updated);
  localStorage.setItem('orders', JSON.stringify(updated));
  navigate('orders');
};
const editOrder = (id) => {
  setEditingOrder(orders.find(o => o.id === id));
  setPage('create');
};

const onEditOrder = (updatedOrder) => {
  const updated = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
  setOrders(updated);
  localStorage.setItem('orders', JSON.stringify(updated));
  setEditingOrder(null);
  navigate('orders');
};

 const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} onSelectOrder={selectOrder} orders={orders} />;
      case 'orders':
        return <OrderList orders={orders} onSelectOrder={selectOrder} onNavigate={navigate} onEditOrder={editOrder} />;
      case 'detail':
        return <OrderDetail orderId={selectedOrderId} onBack={goBack} orders={orders} />;
      case 'create':
        return <CreateOrder 
          onBack={() => { navigate('orders'); setEditingOrder(null); }} 
          onAddOrder={addOrder}
          editingOrder={editingOrder}
          onEditOrder={onEditOrder}
        />;
      case 'notifications':
        return <Notifications onSelectOrder={selectOrder} />;
      default:
        return <Dashboard onNavigate={navigate} onSelectOrder={selectOrder} orders={orders} />;
    }
  };

  const activeNav = ['dashboard', 'orders', 'create', 'notifications'].includes(page) ? page : 'orders';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        active={activeNav}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
      />

      <div style={{ marginLeft: '240px', flex: 1, minWidth: 0 }} className="main-content-area">
        <Navbar
          title={pageTitles[page] || 'OrderFlow'}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          unreadCount={unreadCount}
          onNavigate={navigate}
        />
        <main style={{ minHeight: 'calc(100vh - 65px)' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}