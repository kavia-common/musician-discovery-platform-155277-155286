import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * HomePage shows a simple hero and quick entry points based on user role.
 */
export default function HomePage() {
  /** Landing page with shortcuts to explore, messages, and profile. */
  const { user } = useAuth();

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="title">Discover, book, and perform</div>
        <div className="subtitle">
          A marketplace connecting musicians with restaurants. Browse gigs, chat, and book with ease.
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <Link className="btn btn-primary" to="/explore">Explore Listings</Link>
          {user ? (
            <>
              <Link className="btn" to="/messages">Messages</Link>
              <Link className="btn" to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {user?.role === 'musician' ? (
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="title">Welcome back, {user.name}!</div>
          <div className="subtitle">Ready to share a new performance offering?</div>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" to="/add">➕ Create Listing</Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="title">Looking for live music?</div>
          <div className="subtitle">Filter by genre and location to find the perfect artist.</div>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" to="/explore">Start Exploring</Link>
          </div>
        </div>
      )}
    </div>
  );
}
