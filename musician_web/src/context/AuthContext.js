import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ensureSeedData,
  getCurrentUserId,
  setCurrentUserId,
  findUserByEmail,
  createUser as createUserApi,
  getUserById,
  updateUser as updateUserApi,
} from '../services/api';

const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useAuth hook provides access to the authentication state and methods.
 */
export function useAuth() {
  /** Access the auth context containing user, login, logout, and register methods. */
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and stores the current authenticated user in state.
 */
export function AuthProvider({ children }) {
  /** Provider for auth state and actions: login, register, logout. */
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize seed data and current user
  useEffect(() => {
    ensureSeedData();
    const uid = getCurrentUserId();
    setUser(uid ? getUserById(uid) : null);
    setReady(true);
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Authenticate user with email and password, persist session, and set state. */
    setError(null);
    const u = findUserByEmail(email);
    if (!u || u.password !== password) {
      setError('Invalid email or password');
      throw new Error('Invalid email or password');
    }
    setCurrentUserId(u.id);
    setUser(u);
    return u;
  };

  // PUBLIC_INTERFACE
  const register = async (data) => {
    /**
     * Register a new user and set as current user.
     * Required: role, name, email, password
     */
    setError(null);
    const u = createUserApi(data);
    setCurrentUserId(u.id);
    setUser(u);
    return u;
  };

  // PUBLIC_INTERFACE
  const updateMe = async (updates) => {
    /**
     * Update the currently authenticated user's profile and refresh local state.
     * Returns the updated user.
     */
    if (!user?.id) throw new Error('No authenticated user');
    const next = updateUserApi(user.id, updates);
    setUser(next);
    return next;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clear current session and user state. */
    setCurrentUserId(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, ready, error, login, logout, register, updateMe }),
    [user, ready, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
