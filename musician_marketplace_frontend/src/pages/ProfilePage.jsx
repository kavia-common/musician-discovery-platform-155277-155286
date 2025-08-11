import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import ListingCard from '../components/ListingCard';
import ListingForm from '../components/ListingForm';

/**
 * PUBLIC_INTERFACE
 * ProfilePage displays the user's profile data and musician's listings.
 */
export default function ProfilePage() {
  /** Profile dashboard with musician listings and quick edit. */
  const { user, logout } = useAuth();
  const { myListings, updateListing } = useListings();
  const [editing, setEditing] = useState(null);

  if (!user) return null;

  const onSave = (data) => {
    updateListing(editing.id, data);
    setEditing(null);
  };

  return (
    <div className="grid">
      <div className="section-title" style={{ gridColumn: 'span 12' }}>Profile</div>

      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="spread">
          <div className="row" style={{ gap: 12 }}>
            <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="title">{user.name} {user.role === 'musician' ? '• Musician' : '• Restaurant'}</div>
              <div className="subtitle">{user.location}</div>
            </div>
          </div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
        {user.bio && <p style={{ marginTop: 10 }} className="muted">{user.bio}</p>}
        {user.role === 'musician' && user.genres?.length > 0 && (
          <div className="row" style={{ marginTop: 10, gap: 8 }}>
            {user.genres.map((g) => <span key={g} className="badge">🎶 {g}</span>)}
            {user.rate ? <span className="badge">💵 ${user.rate}</span> : null}
          </div>
        )}
      </div>

      {user.role === 'musician' && (
        <>
          <div className="section-title" style={{ gridColumn: 'span 12' }}>Your Listings</div>
          <div className="listings" style={{ gridColumn: 'span 12' }}>
            {myListings().length === 0 ? (
              <div className="muted">No listings yet. Create one from the Add tab.</div>
            ) : (
              myListings().map((l) => (
                <ListingCard key={l.id} listing={l} onEdit={setEditing} />
              ))
            )}
          </div>

          {editing && (
            <div style={{ gridColumn: 'span 12' }}>
              <ListingForm initial={editing} onSubmit={onSave} onCancel={() => setEditing(null)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
