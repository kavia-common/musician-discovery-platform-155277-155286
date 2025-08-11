import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProfilePhotoStep allows a musician to upload a profile picture during onboarding.
 */
export default function ProfilePhotoStep() {
  /** Upload and preview a single profile image; persists to user and advances onboarding. */
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(user?.profileImage || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;
  if (user.role !== 'musician') {
    navigate('/profile', { replace: true });
    return null;
  }

  const onFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result || ''));
    reader.onerror = () => setError('Failed to read image');
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    setError(null);
    setBusy(true);
    try {
      await updateMe({ profileImage: preview });
      navigate('/onboarding/demo-images', { replace: true });
    } catch (e) {
      setError(e.message || 'Failed to save image');
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    navigate('/onboarding/demo-images');
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 720, margin: '0 auto' }}>
        <div className="title">Set your profile picture</div>
        <div className="subtitle">Upload a clear photo to help restaurants recognize you.</div>

        {error && <div className="alert" style={{ marginTop: 12 }}>⚠️ {error}</div>}

        <div className="row" style={{ marginTop: 12, alignItems: 'flex-start' }}>
          <div
            className="avatar"
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              overflow: 'hidden',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 24,
            }}
            aria-label="Profile image preview"
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{user.name?.[0]?.toUpperCase()}</span>
            )}
          </div>

          <div className="field" style={{ flex: 1, minWidth: 260 }}>
            <label className="label">Upload image</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <span className="muted" style={{ fontSize: 12 }}>
              Recommended: square image, at least 400x400px
            </span>
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 14 }}>
          <button className="btn" onClick={onSkip} disabled={busy}>Skip for now</button>
          <button className="btn btn-primary" onClick={onSave} disabled={busy}>
            {busy ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
