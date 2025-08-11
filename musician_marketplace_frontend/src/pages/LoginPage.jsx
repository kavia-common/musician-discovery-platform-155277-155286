import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * LoginPage authenticates users by email and password.
 */
export default function LoginPage() {
  /** Simple login form with redirect back to the previous page. */
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('ava@music.io');
  const [password, setPassword] = useState('password');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e2) {
      setLocalError(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 520, margin: '0 auto' }}>
        <div className="title">Welcome back</div>
        <div className="subtitle">Sign in to continue</div>

        {(error || localError) && <div className="alert" role="alert">⚠️ {localError || error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="label" htmlFor="pass">Password</label>
            <input id="pass" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <Link className="btn" to="/register">Create account</Link>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
