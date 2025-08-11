import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ListingForm creates or edits a listing. If 'initial' provided, it is edit mode.
 */
export default function ListingForm({ initial, onSubmit, onCancel }) {
  /** Controlled form for listing creation/updating. */
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [genre, setGenre] = useState(initial?.genre || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [rate, setRate] = useState(initial?.rate || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setGenre(initial?.genre || '');
    setLocation(initial?.location || '');
    setRate(initial?.rate || '');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('Title is required');
    if (!genre.trim()) return setError('Genre is required');
    if (!location.trim()) return setError('Location is required');
    if (!String(rate).trim()) return setError('Rate is required');
    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      genre: genre.trim(),
      location: location.trim(),
      rate: Number(rate),
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="title">{initial ? 'Edit Listing' : 'Create Listing'}</div>
      <div className="subtitle">Share your performance offering with restaurants.</div>

      {error && <div className="alert" role="alert">⚠️ {error}</div>}

      <div className="field">
        <label className="label" htmlFor="title">Title</label>
        <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label className="label" htmlFor="desc">Description</label>
        <textarea id="desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="row">
        <div className="field" style={{ flex: 1 }}>
          <label className="label" htmlFor="genre">Genre</label>
          <input id="genre" className="input" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="label" htmlFor="loc">Location</label>
          <input id="loc" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="field" style={{ maxWidth: 180 }}>
          <label className="label" htmlFor="rate">Rate (USD)</label>
          <input id="rate" className="input" type="number" min="0" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save Changes' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}
