import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import NavTabs from './components/NavTabs';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import AddListingPage from './pages/AddListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * Root application component setting theme, routes, and tab navigation.
 * Applies a dark theme by default with toggle support.
 */
function AppShell() {
  const [theme, setTheme] = useState('dark');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between 'light' and 'dark' theme. */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Hide NavTabs on auth pages
  const hideTabs = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <span className="brand-logo">🎵</span>
          <span className="brand-text">Musician App</span>
        </div>
        <div className="topbar-actions">
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {user ? (
            <span className="user-chip" title={`Logged in as ${user.name}`}>
              <span className="avatar">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              <span>{user.name}</span>
            </span>
          ) : null}
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:partnerId"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideTabs && <NavTabs />}
    </div>
  );
}

export default AppShell;
