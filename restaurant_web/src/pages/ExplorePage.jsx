import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import { useListings } from '../context/ListingsContext';

/**
 * PUBLIC_INTERFACE
 * ExplorePage displays a searchable grid of musician listings.
 */
export default function ExplorePage() {
  /** Explore listings with live search by text, genre, and location. */
  const { listings, query } = useListings();
  const [filters, setFilters] = useState({ query: '', genre: '', location: '' });
  const [results, setResults] = useState(listings);

  useEffect(() => {
    setResults(query(filters));
  }, [filters, listings]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid">
      <div className="section-title" style={{ gridColumn: 'span 12' }}>Explore</div>
      <div style={{ gridColumn: 'span 12' }}>
        <SearchBar initial={filters} onChange={setFilters} onSearch={setFilters} />
      </div>

      <div className="listings" style={{ gridColumn: 'span 12' }}>
        {results.length === 0 ? (
          <div className="muted">No listings match your filters.</div>
        ) : (
          results.map((l) => <ListingCard key={l.id} listing={l} />)
        )}
      </div>
    </div>
  );
}
