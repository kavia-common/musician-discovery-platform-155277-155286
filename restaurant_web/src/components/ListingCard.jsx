import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * ListingCard shows compact listing details with context-aware actions.
 */
export default function ListingCard({ listing, onEdit }) {
  /** Display a listing and offer message/edit actions based on the viewer's role. */
  const { user } = useAuth();
  const navigate = useNavigate();

  const owner = getUserById(listing.createdByUserId);
  const canEdit = user?.id === owner?.id;

  const handleMessage = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const partnerId = owner?.id;
    navigate(`/messages/${partnerId}`);
  };

  return (
    <div className="card listing-card">
      <div className="spread">
        <div className="title">{listing.title}</div>
        <span className="badge">💵 ${listing.rate}</span>
      </div>
      <div className="subtitle">{listing.genre} • {listing.location}</div>
      <p className="muted">{listing.description}</p>
      <div className="row spread">
        <div className="muted">by {owner?.name || 'Unknown'}</div>
        <div className="row">
          {!canEdit && (
            <button className="btn btn-primary" onClick={handleMessage}>
              💬 Message
            </button>
          )}
          {canEdit && (
            <button className="btn" onClick={() => onEdit?.(listing)}>
              ✏️ Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
