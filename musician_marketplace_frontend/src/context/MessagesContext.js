import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  sendMessage as sendMessageApi,
  getMessagesBetween,
  getThreadsForUser,
} from '../services/api';
import { useAuth } from './AuthContext';

const MessagesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Hook to access messages API.
 */
export function useMessages() {
  /** Access messaging operations: send, thread listing, and read. */
  return useContext(MessagesContext);
}

/**
 * PUBLIC_INTERFACE
 * Provider for messaging context.
 */
export function MessagesProvider({ children }) {
  /** Provider exposing send and thread lookup for the active user. */
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  // PUBLIC_INTERFACE
  const send = ({ toUserId, text }) => {
    /** Send message from current user to specified partner. */
    if (!user) throw new Error('Not authenticated');
    const msg = sendMessageApi({ fromUserId: user.id, toUserId, text });
    setVersion((v) => v + 1);
    return msg;
  };

  // PUBLIC_INTERFACE
  const threads = () => {
    /** Get message threads for the current user. */
    if (!user) return [];
    return getThreadsForUser(user.id);
  };

  // PUBLIC_INTERFACE
  const between = (partnerId) => {
    /** Get messages between current user and the specified partner. */
    if (!user || !partnerId) return [];
    return getMessagesBetween(user.id, partnerId);
  };

  const value = useMemo(
    () => ({ send, threads, between, version }),
    [version, user?.id]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
