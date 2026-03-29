import React, { useState } from 'react';
import { Bell, AlertTriangle, RefreshCw, CheckCheck, Circle } from 'lucide-react';
import { notifications as initialNotifs } from '../data/mockData';

const typeConfig = {
  status_change: { icon: RefreshCw, color: '#7c5cfc', bg: 'rgba(124,92,252,0.1)', label: 'Status Update' },
  alert: { icon: AlertTriangle, color: '#ff4f7b', bg: 'rgba(255,79,123,0.1)', label: 'Alert' },
  update: { icon: CheckCheck, color: '#00e5a0', bg: 'rgba(0,229,160,0.1)', label: 'Update' },
};

export default function Notifications({ onSelectOrder }) {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all'); 

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const todayNotifs = filtered.filter(n => ['2 min ago', '1 hr ago', '3 hrs ago', '5 hrs ago'].includes(n.time));
  const earlierNotifs = filtered.filter(n => n.time === 'Yesterday');

  return (
    <div className="p-4 md:p-6 page-enter max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Syne' }}>Notifications</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'all', label: `All (${notifs.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === tab.key ? 'var(--bg-card)' : 'transparent',
              color: filter === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              border: filter === tab.key ? '1px solid var(--border-active)' : '1px solid transparent'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.15)' }}>
            <Bell size={28} style={{ color: 'var(--accent-violet)' }} />
          </div>
          <p className="font-bold mb-1" style={{ fontFamily: 'Syne' }}>No notifications here</p>
        </div>
      )}

      {todayNotifs.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Today</p>
          <div className="space-y-2">
            {todayNotifs.map(n => <NotifCard key={n.id} n={n} onRead={markRead} onSelectOrder={onSelectOrder} />)}
          </div>
        </div>
      )}

      {earlierNotifs.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Earlier</p>
          <div className="space-y-2">
            {earlierNotifs.map(n => <NotifCard key={n.id} n={n} onRead={markRead} onSelectOrder={onSelectOrder} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifCard({ n, onRead, onSelectOrder }) {
  const { icon: Icon, color, bg, label } = typeConfig[n.type];
  return (
    <div
      onClick={() => { onRead(n.id); onSelectOrder(n.orderId); }}
      className={`p-4 rounded-2xl cursor-pointer transition-all notif-${n.type}`}
      style={{
        background: n.read ? 'var(--bg-card)' : 'var(--bg-hover)',
        border: `1px solid ${n.read ? 'var(--border)' : 'var(--border-active)'}`,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bg }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold" style={{ color }}>{label}</span>
            {!n.read && (
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            )}
          </div>
          <p className="text-sm leading-relaxed">{n.message}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
        </div>
        {!n.read && (
          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--accent-violet)' }} />
        )}
      </div>
    </div>
  );
}
