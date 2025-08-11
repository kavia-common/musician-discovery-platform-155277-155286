import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAllListings,
  createListing as createListingApi,
  updateListing as updateListingApi,
  getListingsByUser,
  searchListings,
} from '../services/api';
import { useAuth } from './AuthContext';

const ListingsContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * Hook to access listing state and methods.
 */
export function useListings() {
  /** Access listings data and operations: list, create, update, search. */
  return useContext(ListingsContext);
}

/**
 * PUBLIC_INTERFACE
 * Provider for listings.
 */
export function ListingsProvider({ children }) {
  /** Provider wrapping the app with listings state and functions. */
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings(getAllListings());
  }, []);

  // PUBLIC_INTERFACE
  const refresh = () => {
    /** Reload listings from storage. */
    setListings(getAllListings());
  };

  // PUBLIC_INTERFACE
  const createListing = (data) => {
    /** Create a new listing for the authenticated user. */
    const created = createListingApi({
      ...data,
      createdByUserId: user?.id,
    });
    refresh();
    return created;
  };

  // PUBLIC_INTERFACE
  const updateListing = (id, updates) => {
    /** Update an existing listing. */
    const l = updateListingApi(id, updates);
    refresh();
    return l;
  };

  // PUBLIC_INTERFACE
  const myListings = () => {
    /** Get listings created by the current authenticated user. */
    return user ? getListingsByUser(user.id) : [];
  };

  // PUBLIC_INTERFACE
  const query = ({ query = '', genre = '', location = '' }) => {
    /** Search listings by query, genre, and location filters. */
    return searchListings({ query, genre, location });
  };

  const value = useMemo(
    () => ({ listings, refresh, createListing, updateListing, myListings, query }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(listings), user?.id]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}
