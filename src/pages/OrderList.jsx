import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, Eye, Edit2, Trash2, ChevronDown, SlidersHorizontal, Grid3X3, List } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const labels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };
  return <span className={`badge badge-${status}`}>{labels[status]}</span>;
};

const PriorityDot = ({ priority }) => {
  const colors = { high: '#ff4f7b', medium: '#ffb300', low: '#00e5a0' };
  return (
    <span className="flex items-center gap-1.5 text-xs capitalize" style={{ color: colors[priority] }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: colors[priority] }} />
      {priority}
    </span>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.15)' }}>
      <Search size={32} style={{ color: 'var(--accent-violet)' }} />
    </div>
    <p className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne' }}>No orders found</p>
    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filter criteria</p>
  </div>
);

export default function OrderList({ orders, onSelectOrder, onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || o.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-4 md:p-6 page-enter space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }} />
          <input className="input-field pl-10" placeholder="Search by order ID, customer, product..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-ghost text-sm gap-2 ${showFilters ? 'border-violet-500/40' : ''}`}
            style={showFilters ? { color: 'var(--accent-violet)', borderColor: 'rgba(124,92,252,0.4)' } : {}}>
            <SlidersHorizontal size={15} /> Filters
          </button>

          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <button
              onClick={() => setViewMode('table')}
              className="p-2.5 transition-colors"
              style={{
                background: viewMode === 'table' ? 'rgba(124,92,252,0.15)' : 'transparent',
                color: viewMode === 'table' ? 'var(--accent-violet)' : 'var(--text-muted)'
              }}>
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2.5 transition-colors"
              style={{
                background: viewMode === 'grid' ? 'rgba(124,92,252,0.15)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent-violet)' : 'var(--text-muted)'
              }}>
              <Grid3X3 size={16} />
            </button>
          </div>

          <button onClick={() => onNavigate('create')} className="btn-primary text-sm">
            + New Order
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="glass-card p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-36">
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Status</label>
            <select className="input-field text-sm py-2"
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-36">
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Priority</label>
            <select className="input-field text-sm py-2"
              value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-ghost text-sm"
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearch(''); }}>
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Showing <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{filtered.length}</span> orders
        </p>
      </div>

      {filtered.length === 0 && <EmptyState />}

      {filtered.length > 0 && viewMode === 'table' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Priority', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}
                    className="transition-colors cursor-pointer"
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: hoveredRow === order.id ? 'var(--bg-hover)' : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredRow(order.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onSelectOrder(order.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono" style={{ color: 'var(--accent-violet)' }}>{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: 'var(--gradient-primary)', fontFamily: 'Syne' }}>
                          {order.customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium whitespace-nowrap">{order.customer.name}</p>
                          <p className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm whitespace-nowrap">{order.product}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold">₹{order.amount.toLocaleString('en-IN')}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3"><PriorityDot priority={order.priority} /></td>
                    <td className="px-4 py-3">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.date}</p>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ opacity: hoveredRow === order.id ? 1 : 0 }}>
                        <button onClick={() => onSelectOrder(order.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}>
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}>
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(order => (
            <div key={order.id}
              className="glass-card p-4 cursor-pointer"
              onClick={() => onSelectOrder(order.id)}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono" style={{ color: 'var(--accent-violet)' }}>{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--gradient-primary)', fontFamily: 'Syne' }}>
                  {order.customer.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.customer.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.product}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="font-bold text-sm">₹{order.amount.toLocaleString('en-IN')}</p>
                <PriorityDot priority={order.priority} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
