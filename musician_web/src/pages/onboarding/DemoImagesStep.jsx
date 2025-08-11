import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * DemoImagesStep lets musicians upload multiple demo images for their profile slider.
 */
export default function DemoImagesStep() {
  /** Upload multiple image files, preview, remove, and persist to current user. */
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();

  const [images, setImages] = useState(Array.isArray(user?.demoImages) ? user.demoImages : []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;
  if (user.role !== 'musician') {
    navigate('/profile', { replace: true });
    return null;
  }

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(String(e.target?.result || ''));
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers)
      .then((dataUrls) => setImages((prev) => [...prev, ...dataUrls]))
      .catch(() => setError('One or more files could not be read.'));
  };

  const removeAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    setError(null);
    setBusy(true);
    try {
      await updateMe({ demoImages: images });
      navigate('/onboarding/demo-videos', { replace: true });
    } catch (e) {
      setError(e.message || 'Failed to save images');
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    navigate('/onboarding/demo-videos');
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 900, margin: '0 auto' }}>
        <div className="title">Add demo images</div>
        <div className="subtitle">Upload stage photos or posters to showcase your vibe.</div>

        {error && <div className="alert" style={{ marginTop: 12 }}>⚠️ {error}</div>}

        <div className="field" style={{ marginTop: 10 }}>
          <label className="label">Upload images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input"
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="muted" style={{ fontSize: 12 }}>
            You can add more later from your profile.
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 10,
          }}
        >
          {images.map((src, idx) => (
            <div key={idx} className="card" style={{ padding: 8 }}>
              <img
                src={src}
                alt={`Demo ${idx + 1}`}
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
              />
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="btn" onClick={() => removeAt(idx)}>Remove</button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="muted">No images yet. Use the file picker above to add some.</div>
          )}
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
