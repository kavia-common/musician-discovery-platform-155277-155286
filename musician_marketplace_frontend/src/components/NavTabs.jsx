import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Tab-based navigation for primary app sections.
 */
export default function NavTabs() {
  /** Bottom navigation tabs with role-aware "Add" visibility. */
  const { user } = useAuth();
  const isMusician = user?.role === 'musician';

  const tabs = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/explore', label: 'Explore', icon: '🔎' },
    { to: '/messages', label: 'Messages', icon: '💬' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (isMusician) {
    tabs.splice(2, 0, { to: '/add', label: 'Add', icon: '➕' });
  } else {
    tabs.splice(2, 0, { to: '/add', label: 'Add', icon: '➕', disabled: true });
  }

  return (
    <nav className="nav-tabs">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.disabled ? '/login' : t.to}
          className={({ isActive }) =>
            `nav-tab ${isActive ? 'active' : ''} ${t.disabled ? 'disabled' : ''}`
          }
          title={t.disabled ? 'Login as musician to add listings' : t.label}
        >
          <span className="icon" aria-hidden="true">{t.icon}</span>
          <span className="label" aria-label={t.label}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
