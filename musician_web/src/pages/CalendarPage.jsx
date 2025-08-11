import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * CalendarPage renders a month-view calendar for musicians to manage availability.
 * - Default view is the current month.
 * - Click a day to toggle availability: none -> available -> unavailable -> none.
 * - Booked dates (placeholder for future integrations) are visually distinct and locked.
 * - Shows past vs. upcoming days with subtle styling differences.
 * - Prepared for future booking data flow (can accept an injected bookings list).
 */
export default function CalendarPage({ bookings: injectedBookings }) {
  /**
   * Month-view calendar with local state for availability.
   * For now, uses placeholder bookings until backend integration arrives.
   */
  const { user } = useAuth();

  // Role gating: Only musicians should manage a calendar.
  const isMusician = user?.role === 'musician';

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11

  // Availability map: { 'YYYY-MM-DD': 'available' | 'unavailable' }
  const [availability, setAvailability] = useState({});

  // Placeholder bookings (simulate future data flow)
  const defaultBookings = useMemo(() => {
    // Two upcoming bookings and one in the past to visualize various states
    const fmt = (d) => dateKey(d);
    const upcoming1 = new Date();
    upcoming1.setDate(today.getDate() + 3);
    const upcoming2 = new Date();
    upcoming2.setDate(today.getDate() + 10);
    const past1 = new Date();
    past1.setDate(today.getDate() - 5);
    return [
      { date: fmt(upcoming1), title: 'Booked: Wine Bar', color: '#E87A41' },
      { date: fmt(upcoming2), title: 'Booked: Rooftop Lounge', color: '#E87A41' },
      { date: fmt(past1), title: 'Booked: Cafe Night', color: '#B3622F' },
    ];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bookings = injectedBookings || defaultBookings;

  const bookedSet = useMemo(() => {
    const m = new Map();
    for (const b of bookings) m.set(b.date, b);
    return m;
  }, [bookings]);

  const monthMatrix = useMemo(
    () => buildMonthMatrix(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  // PUBLIC_INTERFACE
  const goPrevMonth = () => {
    /** Navigate to the previous calendar month. */
    const d = new Date(viewYear, viewMonth, 1);
    d.setMonth(d.getMonth() - 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  // PUBLIC_INTERFACE
  const goNextMonth = () => {
    /** Navigate to the next calendar month. */
    const d = new Date(viewYear, viewMonth, 1);
    d.setMonth(d.getMonth() + 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  // PUBLIC_INTERFACE
  const goToday = () => {
    /** Reset view to the current month. */
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const onDayClick = (d) => {
    if (!d) return;
    const key = dateKey(d);
    if (bookedSet.has(key)) return; // booked days are locked
    setAvailability((prev) => {
      const current = prev[key];
      let next = undefined;
      if (!current) next = 'available';
      else if (current === 'available') next = 'unavailable';
      else next = undefined;
      const cloned = { ...prev };
      if (next) cloned[key] = next;
      else delete cloned[key];
      return cloned;
    });
  };

  const monthName = monthNames[viewMonth];
  const legend = [
    { label: 'Booked', className: 'booked' },
    { label: 'Available', className: 'available' },
    { label: 'Unavailable', className: 'unavailable' },
    { label: 'Past', className: 'past' },
    { label: 'Today', className: 'today' },
  ];

  if (!isMusician) {
    return (
      <div className="card">
        <div className="title">Calendar</div>
        <p className="subtitle">Only musicians can manage a performance calendar.</p>
        <p className="muted">Log in as a musician to set availability and view bookings.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="section-title" style={{ gridColumn: 'span 12' }}>Calendar</div>

      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="calendar-toolbar">
          <div className="row">
            <button className="btn" onClick={goPrevMonth} aria-label="Previous month">◀</button>
            <button className="btn" onClick={goToday} aria-label="Go to current month">Today</button>
            <button className="btn" onClick={goNextMonth} aria-label="Next month">▶</button>
          </div>
          <div className="title" aria-live="polite" aria-atomic="true">
            {monthName} {viewYear}
          </div>
          <div className="row legend">
            {legend.map((l) => (
              <span key={l.label} className={`legend-item ${l.className}`}>
                <span className="dot" aria-hidden="true" /> {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={`hdr-${d}`} className="calendar-col-header" aria-hidden="true">{d}</div>
          ))}

          {monthMatrix.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="day empty" />;
            }
            const key = dateKey(cell);
            const isToday = isSameDate(cell, today);
            const isOutside = cell.getMonth() !== viewMonth;
            const isPastDay = isPast(cell, today);
            const booked = bookedSet.get(key);
            const avail = availability[key]; // 'available'|'unavailable'|undefined

            const classes = ['day'];
            if (isOutside) classes.push('outside');
            if (isToday) classes.push('today');
            if (isPastDay) classes.push('past');
            if (booked) classes.push('booked');
            if (avail === 'available') classes.push('available');
            if (avail === 'unavailable') classes.push('unavailable');

            const clickHandler = booked ? undefined : () => onDayClick(cell);
            const ariaLabelParts = [
              `Day ${cell.getDate()}`,
              booked ? 'Booked' : (avail ? `Marked ${avail}` : 'No status'),
              isOutside ? 'Outside current month' : '',
              isPastDay ? 'Past day' : '',
              isToday ? 'Today' : ''
            ].filter(Boolean);
            const ariaLabel = ariaLabelParts.join(', ');

            return (
              <button
                key={key}
                className={classes.join(' ')}
                onClick={clickHandler}
                disabled={Boolean(booked)}
                aria-label={ariaLabel}
                title={
                  booked
                    ? `${formatHuman(cell)} • ${booked.title}`
                    : `${formatHuman(cell)} • Click to toggle availability`
                }
              >
                <span className="date-num">{cell.getDate()}</span>
                {booked ? (
                  <span className="chip booked-chip">📌 {booked.title}</span>
                ) : avail === 'available' ? (
                  <span className="chip available-chip">Available</span>
                ) : avail === 'unavailable' ? (
                  <span className="chip unavailable-chip">Unavailable</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="calendar-help muted">
          Tip: Click a day to cycle between Available, Unavailable, and None. Booked days are locked.
        </div>
      </div>

      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="title">Upcoming</div>
        <div className="subtitle">Auto-populated by bookings (placeholder data for now)</div>
        <ul style={{ marginTop: 10, paddingLeft: 18 }}>
          {bookings
            .filter((b) => !isPast(parseYmd(b.date), today))
            .sort((a, b) => parseYmd(a.date) - parseYmd(b.date))
            .map((b) => (
              <li key={b.date}>
                <span className="badge" style={{ borderColor: 'var(--border)' }}>
                  📅 {formatHuman(parseYmd(b.date))} — {b.title}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

/** Utilities */

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// PUBLIC_INTERFACE
export function dateKey(d) {
  /** Return a 'YYYY-MM-DD' string for the provided Date (local time). */
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseYmd(key) {
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isPast(a, today) {
  // Compare by YYYY-MM-DD (ignore time)
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return da < dt;
}

function formatHuman(d) {
  const w = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  return `${w}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// PUBLIC_INTERFACE
export function buildMonthMatrix(year, month) {
  /**
   * Build a 6x7=42-cell matrix for a calendar month view. Includes leading and
   * trailing days from adjacent months to fill the grid.
   * Returns a flat array of 42 items with Date or null for empty slots.
   */
  const firstOfMonth = new Date(year, month, 1);
  const firstDay = firstOfMonth.getDay(); // 0=Sun .. 6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];

  // Leading days (previous month)
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    cells.push(d);
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  // Trailing days (next month)
  while (cells.length < 42) {
    const nextIndex = cells.length - (firstDay + daysInMonth);
    const d = new Date(year, month + 1, nextIndex + 1);
    cells.push(d);
  }

  // Ensure always 42 cells
  return cells.slice(0, 42);
}
