import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Tab-based navigation for primary app sections.
 */
export default function NavTabs() {
  /** Bottom navigation tabs with role-aware visibility for Add and Calendar. */
  const { user } = useAuth();
  const isMusician = user?.role === 'musician';

  const tabs = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/explore', label: 'Explore', icon: '🔍' },
    // Calendar tab (musicians active, others disabled)
    isMusician
      ? { to: '/calendar', label: 'Calendar', icon: '🗓️' }
      : { to: '/calendar', label: 'Calendar', icon: '🗓️', disabled: true },
    { to: '/messages', label: 'Messages', icon: '💬' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Add tab (musicians active, others disabled) placed after Calendar (index 3)
  if (isMusician) {
    tabs.splice(3, 0, { to: '/add', label: 'Add', icon: '➕' });
  } else {
    tabs.splice(3, 0, { to: '/add', label: 'Add', icon: '➕', disabled: true });
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
          title={t.disabled ? 'Login as musician to access' : t.label}
        >
          <span className="icon" aria-hidden="true">{t.icon}</span>
          <span className="label" aria-label={t.label}>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
