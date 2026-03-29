import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Clock, CheckCircle, XCircle, Package, ArrowUpRight } from 'lucide-react';
import { stats, orders } from '../data/mockData';

const StatusBadge = ({ status }) => {
  const labels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };
  return <span className={`badge badge-${status}`}>{labels[status]}</span>;
};

const StatCard = ({ label, value, icon: Icon, gradient, sub }) => (
  <div className="glass-card p-5 flex items-start justify-between gap-4">
    <div>
      <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: gradient }}>
      <Icon size={20} color="white" />
    </div>
  </div>
);

const MiniChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.orders));
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Orders</p>
          <p className="text-xl font-bold mt-0.5" style={{ fontFamily: 'Syne' }}>Last 6 Months</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,229,160,0.1)', color: 'var(--accent-emerald)' }}>
          <TrendingUp size={12} /> +18% vs last quarter
        </div>
      </div>
      <div className="flex items-end gap-3 h-28">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full chart-bar" style={{ height: `${(d.orders / max) * 100}%`, minHeight: '8px' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.total;
  const segments = [
    { label: 'Completed', val: data.completed, color: '#00e5a0' },
    { label: 'In Progress', val: data.inProgress, color: '#7c5cfc' },
    { label: 'Pending', val: data.pending, color: '#ffb300' },
    { label: 'Cancelled', val: data.cancelled, color: '#ff4f7b' },
  ];

  let cumulative = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="glass-card p-5">
      <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Order Breakdown</p>
      <p className="text-xl font-bold mb-4" style={{ fontFamily: 'Syne' }}>Status Distribution</p>
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            {segments.map((seg, i) => {
              const pct = seg.val / total;
              const dash = circumference * pct;
              const offset = circumference * (1 - cumulative);
              cumulative += pct;
              return (
                <circle key={i} cx="55" cy="55" r={radius}
                  fill="none" stroke={seg.color} strokeWidth="10"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 55 55)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              );
            })}
            <text x="55" y="51" textAnchor="middle" fill="var(--text-primary)"
              style={{ fontSize: '18px', fontFamily: 'Syne', fontWeight: '700' }}>{total}</text>
            <text x="55" y="64" textAnchor="middle" fill="var(--text-muted)"
              style={{ fontSize: '8px', fontFamily: 'DM Sans' }}>Total</text>
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{seg.label}</span>
              </div>
              <span className="text-xs font-semibold">{seg.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ onNavigate, onSelectOrder }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="p-6 page-enter">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="skeleton h-48 rounded-2xl lg:col-span-2" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    </div>
  );

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="p-4 md:p-6 page-enter space-y-4">
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.2) 0%, rgba(0,212,255,0.15) 100%)', border: '1px solid rgba(124,92,252,0.2)' }}>
        <div className="relative z-10">
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}></p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>Welcome back, Admin</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            You have <span style={{ color: 'var(--accent-violet)', fontWeight: '600' }}>2 pending</span> orders that need attention today.
          </p>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'var(--accent-violet)', filter: 'blur(24px)' }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Orders" value={stats.total} icon={ShoppingCart}
          gradient="linear-gradient(135deg,#7c5cfc,#00d4ff)" sub="All time" />
        <StatCard label="Pending" value={stats.pending} icon={Clock}
          gradient="linear-gradient(135deg,#ffb300,#ff7043)" sub="Awaiting action" />
           <StatCard label="In Progress" value={stats.inProgress} icon={Clock}
          gradient="linear-gradient(135deg,#ffb300,#ff7043)" sub="In Progress" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle}
          gradient="linear-gradient(135deg,#00e5a0,#00b8d4)" sub="This month" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle}
          gradient="linear-gradient(135deg,#ff4f7b,#ff7043)" sub="This month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <MiniChart data={stats.monthlyData} />
        <DonutChart data={stats} />
      </div>

      <div className="glass-card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
          <p className="text-3xl font-bold mt-1" style={{ fontFamily: 'Syne' }}>
            ₹{stats.revenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--accent-emerald)' }}>
            <TrendingUp size={12} /> +23% from last month
          </p>
        </div>
        <Package size={48} style={{ color: 'rgba(124,92,252,0.2)' }} />
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold" style={{ fontFamily: 'Syne' }}>Recent Orders</p>
          <button onClick={() => onNavigate('orders')}
            className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-violet)' }}>
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {recentOrders.map(order => (
            <div key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors"
              style={{ background: 'var(--bg-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--gradient-primary)', fontFamily: 'Syne' }}>
                  {order.customer.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{order.customer.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <p className="text-sm font-semibold hidden sm:block">₹{order.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
