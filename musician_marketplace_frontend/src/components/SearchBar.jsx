import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar component emits search filter changes to parent via onChange or onSearch.
 */
export default function SearchBar({ initial = {}, onChange, onSearch }) {
  /** Inputs for text query, genre, and location with change and submit callbacks. */
  const [query, setQuery] = useState(initial.query || '');
  const [genre, setGenre] = useState(initial.genre || '');
  const [location, setLocation] = useState(initial.location || '');

  useEffect(() => {
    if (onChange) onChange({ query, genre, location });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ query, genre, location });
  };

  return (
    <form className="card" onSubmit={handleSubmit} role="search" aria-label="Search listings">
      <div className="row">
        <div className="field" style={{ flex: 2, minWidth: 180 }}>
          <label className="label" htmlFor="q">Search</label>
          <input
            id="q"
            className="input"
            placeholder="Try 'jazz', 'acoustic', 'NYC'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="field" style={{ flex: 1, minWidth: 120 }}>
          <label className="label" htmlFor="genre">Genre</label>
          <input
            id="genre"
            className="input"
            placeholder="e.g., Jazz"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        <div className="field" style={{ flex: 1, minWidth: 120 }}>
          <label className="label" htmlFor="loc">Location</label>
          <input
            id="loc"
            className="input"
            placeholder="e.g., New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
  );
}
