import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * DemoVideosStep allows musicians to add multiple demo videos via links or file uploads.
 */
export default function DemoVideosStep() {
  /** Persist video links or uploaded clips as data URLs; navigate to profile after save. */
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState(Array.isArray(user?.demoVideos) ? user.demoVideos : []);
  const [linkInput, setLinkInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;
  if (user.role !== 'musician') {
    navigate('/profile', { replace: true });
    return null;
  }

  const addLinks = () => {
    const normalized = linkInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (normalized.length === 0) return;
    setVideos((prev) => [...prev, ...normalized]);
    setLinkInput('');
  };

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
      .then((dataUrls) => setVideos((prev) => [...prev, ...dataUrls]))
      .catch(() => setError('One or more videos could not be read.'));
  };

  const removeAt = (idx) => {
    setVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    setError(null);
    setBusy(true);
    try {
      await updateMe({ demoVideos: videos });
      navigate('/profile', { replace: true });
    } catch (e) {
      setError(e.message || 'Failed to save videos');
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    navigate('/profile');
  };

  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: 'span 12', maxWidth: 900, margin: '0 auto' }}>
        <div className="title">Add demo videos</div>
        <div className="subtitle">Paste YouTube links or upload short clips to help restaurants hear you.</div>

        {error && <div className="alert" style={{ marginTop: 12 }}>⚠️ {error}</div>}

        <div className="field" style={{ marginTop: 10 }}>
          <label className="label">Paste video links (one per line)</label>
          <textarea
            className="textarea"
            placeholder="https://www.youtube.com/watch?v=...\nhttps://vimeo.com/...\nhttps://example.com/demo.mp4"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn" onClick={addLinks}>Add Links</button>
          </div>
        </div>

        <div className="field">
          <label className="label">Or upload video files</label>
          <input
            type="file"
            accept="video/*"
            multiple
            className="input"
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="muted" style={{ fontSize: 12 }}>
            For best performance, consider linking to hosted videos (YouTube, Vimeo).
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}
        >
          {videos.map((src, idx) => (
            <div key={idx} className="card" style={{ padding: 8 }}>
              {src.startsWith('data:video') ? (
                <video src={src} controls style={{ width: '100%', height: 160, borderRadius: 8 }} />
              ) : (
                <a href={src} target="_blank" rel="noreferrer" className="badge" style={{ display: 'block' }}>
                  ▶️ {src}
                </a>
              )}
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
                <button className="btn" onClick={() => removeAt(idx)}>Remove</button>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div className="muted">No videos yet. Add links or upload files above.</div>
          )}
        </div>

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 14 }}>
          <button className="btn" onClick={onSkip} disabled={busy}>Skip for now</button>
          <button className="btn btn-primary" onClick={onSave} disabled={busy}>
            {busy ? 'Saving...' : 'Save & Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}
