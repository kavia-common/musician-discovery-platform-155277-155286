import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import ListingForm from '../components/ListingForm';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * AddListingPage provides a form for musicians to create new listings.
 */
export default function AddListingPage() {
  /** Creation form gated to musician role. */
  const { user } = useAuth();
  const { createListing } = useListings();
  const navigate = useNavigate();

  if (user?.role !== 'musician') {
    return (
      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 12' }}>
          <div className="title">Add Listing</div>
          <p className="muted">Only musicians can create listings. Login as a musician to continue.</p>
          <div className="row">
            <Link className="btn btn-primary" to="/login">Login</Link>
            <Link className="btn" to="/explore">Explore</Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (data) => {
    const created = createListing(data);
    navigate('/profile');
    return created;
  };

  return (
    <div className="grid">
      <div style={{ gridColumn: 'span 12' }}>
        <ListingForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
