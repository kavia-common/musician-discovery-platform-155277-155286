import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SRI_LANKA_CITIES } from '../constants/cities';
import { MUSIC_GENRES, ARTIST_TYPES } from '../constants/genres';

/**
 * PUBLIC_INTERFACE
 * RegisterPage creates a new musician account with extended details.
 */
export default function RegisterPage() {
  /** Musician registration form with validation and preloaded metadata. */
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [artistType, setArtistType] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

  const cities = useMemo(() => SRI_LANKA_CITIES, []);
  const genres = useMemo(() => MUSIC_GENRES, []);
  const artistTypes = useMemo(() => ARTIST_TYPES, []);

  const emailRegex = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    []
  );
  // Accepts 0XXXXXXXXX (10 digits) or +94XXXXXXXXX (country format)
  const slPhoneRegex = useMemo(
    () => /^(\+94|0)\d{9}$/,
    []
  );

  const toggleGenre = (g) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const validate = () => {
    const next = {};
    if (!username.trim()) next.username = 'Username is required';
    else if (username.trim().length < 2) next.username = 'Username should be at least 2 characters';

    if (!email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(email)) next.email = 'Please enter a valid email address';

    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Use at least 6 characters';

    if (!contactNumber.trim()) next.contactNumber = 'Contact number is required';
    else if (!slPhoneRegex.test(contactNumber.trim()))
      next.contactNumber = 'Use 0XXXXXXXXX or +94XXXXXXXXX format';

    if (!location) next.location = 'Location is required';
    if (!artistType) next.artistType = 'Artist type is required';
    if (selectedGenres.length === 0) next.genres = 'Select at least one genre';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const payload = {
        role: 'musician',
        name: username.trim(),
        email: email.trim(),
        password,
        contactNumber: contactNumber.trim(),
        location,
        artistType,
        genres: selectedGenres,
      };
      await register(payload);
      // Redirect to profile for onboarding continuation
      navigate('/profile', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Failed to create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 720, margin: '0 auto' }}>
        <div className="title">Musician Registration</div>
        <div className="subtitle">Create your artist profile and get discovered by restaurants</div>

        {submitError && (
          <div className="alert" role="alert" style={{ marginTop: 10 }}>
            ⚠️ {submitError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <div className="field">
            <label className="label" htmlFor="username">Stage name / username</label>
            <input
              id="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., Ava Keys"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-err' : undefined}
            />
            {errors.username && (
              <span id="username-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.username}</span>
            )}
          </div>

          <div className="row">
            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-err' : undefined}
              />
              {errors.email && (
                <span id="email-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.email}</span>
              )}
            </div>

            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="label" htmlFor="contact">Contact number</label>
              <input
                id="contact"
                className="input"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+9471XXXXXXX or 071XXXXXXX"
                aria-invalid={!!errors.contactNumber}
                aria-describedby={errors.contactNumber ? 'contact-err' : undefined}
              />
              {errors.contactNumber && (
                <span id="contact-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.contactNumber}</span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="label" htmlFor="location">Location (City)</label>
              <select
                id="location"
                className="select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? 'location-err' : undefined}
              >
                <option value="">Select a city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.location && (
                <span id="location-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.location}</span>
              )}
            </div>

            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label className="label" htmlFor="artistType">Artist type</label>
              <select
                id="artistType"
                className="select"
                value={artistType}
                onChange={(e) => setArtistType(e.target.value)}
                aria-invalid={!!errors.artistType}
                aria-describedby={errors.artistType ? 'artistType-err' : undefined}
              >
                <option value="">Select type</option>
                {artistTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.artistType && (
                <span id="artistType-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.artistType}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label className="label">Genres</label>
            <div className="row" role="group" aria-label="Select genres" style={{ gap: 8 }}>
              {genres.map((g) => {
                const checked = selectedGenres.includes(g);
                return (
                  <label key={g} className="badge" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGenre(g)}
                      style={{ marginRight: 6 }}
                    />
                    {g}
                  </label>
                );
              })}
            </div>
            {errors.genres && (
              <span style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.genres}</span>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-err' : undefined}
            />
            {errors.password && (
              <span id="password-err" style={{ color: '#ff6b6b', fontSize: 12 }}>{errors.password}</span>
            )}
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
