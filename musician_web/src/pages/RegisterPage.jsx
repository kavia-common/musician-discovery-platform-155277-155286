import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RegisterPage creates a new account with musician or restaurant role.
 */
export default function RegisterPage() {
  /** Registration form showing musician-specific fields. */
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('musician');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [genres, setGenres] = useState('');
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const payload = {
        role,
        name: name.trim(),
        location: location.trim(),
        email: email.trim(),
        password,
        bio: bio.trim(),
      };
      if (role === 'musician') {
        payload.genres = genres
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean);
        payload.rate = Number(rate) || 0;
      }
      await register(payload);
      navigate('/', { replace: true });
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 640, margin: '0 auto' }}>
        <div className="title">Create account</div>
        <div className="subtitle">Join as a musician or a restaurant</div>

        {error && <div className="alert" role="alert">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <div className="row">
            <button
              type="button"
              className={`btn ${role === 'musician' ? 'btn-primary' : ''}`}
              onClick={() => setRole('musician')}
              aria-pressed={role === 'musician'}
            >
              🎶 Musician
            </button>
            <button
              type="button"
              className={`btn ${role === 'restaurant' ? 'btn-primary' : ''}`}
              onClick={() => setRole('restaurant')}
              aria-pressed={role === 'restaurant'}
            >
              🍽️ Restaurant
            </button>
          </div>

          <div className="field" style={{ marginTop: 10 }}>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="row">
            <div className="field" style={{ flex: 1 }}>
              <label className="label" htmlFor="loc">Location</label>
              <input id="loc" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          {role === 'musician' && (
            <div className="row">
              <div className="field" style={{ flex: 1 }}>
                <label className="label" htmlFor="genres">Genres</label>
                <input id="genres" className="input" placeholder="e.g., Jazz, Soul" value={genres} onChange={(e) => setGenres(e.target.value)} />
              </div>
              <div className="field" style={{ maxWidth: 200 }}>
                <label className="label" htmlFor="rate">Rate (USD)</label>
                <input id="rate" className="input" type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
            </div>
          )}

          <div className="field">
            <label className="label" htmlFor="bio">Bio</label>
            <textarea id="bio" className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="field">
            <label className="label" htmlFor="pass">Password</label>
            <input id="pass" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <Link className="btn" to="/login">I already have an account</Link>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
