const USERS_KEY = 'mm_users';
const LISTINGS_KEY = 'mm_listings';
const MESSAGES_KEY = 'mm_messages';
const CURRENT_USER_KEY = 'mm_current_user_id';

/**
 * Simple unique ID generator for mock data.
 * Avoids external dependencies to keep the template lightweight.
 */
// PUBLIC_INTERFACE
export function generateId(prefix = 'id') {
  /** Generate a pseudo-unique string ID with an optional prefix. */
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Internal helpers for localStorage JSON handling.
 */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Seed some initial demo data on first run.
 */
// PUBLIC_INTERFACE
export function ensureSeedData() {
  /** Initialize localStorage with demo users and listings if empty. */
  const users = read(USERS_KEY, []);
  if (users.length === 0) {
    const musician = {
      id: generateId('usr'),
      role: 'musician',
      name: 'Ava Keys',
      email: 'ava@music.io',
      password: 'password',
      location: 'Colombo',
      contactNumber: '0712345678',
      artistType: 'Solo',
      genres: ['Jazz', 'Soul'],
      rate: 200,
      bio: 'Pianist and vocalist specializing in jazz standards and soulful nights.',
    };
    const restaurant = {
      id: generateId('usr'),
      role: 'restaurant',
      name: 'Green Fork',
      email: 'bookings@greenfork.com',
      password: 'password',
      location: 'New York',
      genres: [],
      rate: null,
      bio: 'Farm-to-table bistro seeking live performers for weekend dinners.',
    };
    write(USERS_KEY, [musician, restaurant]);

    const listings = [
      {
        id: generateId('lst'),
        title: 'Live Jazz Evenings',
        description:
          'Available for cozy jazz sets. Standards, improvisation, and soulful ballads.',
        genre: 'Jazz',
        location: 'New York',
        rate: 200,
        createdByUserId: musician.id,
        createdAt: Date.now(),
      },
      {
        id: generateId('lst'),
        title: 'Acoustic Soul Nights',
        description:
          'Warm acoustic set perfect for brunch or intimate dinners.',
        genre: 'Soul',
        location: 'New York',
        rate: 180,
        createdByUserId: musician.id,
        createdAt: Date.now() - 86400000,
      },
    ];
    write(LISTINGS_KEY, listings);
    write(MESSAGES_KEY, []);
  }
}

/**
 * Authentication and users
 */
// PUBLIC_INTERFACE
export function getCurrentUserId() {
  /** Get the currently logged in user ID from storage. */
  return localStorage.getItem(CURRENT_USER_KEY);
}
// PUBLIC_INTERFACE
export function setCurrentUserId(userId) {
  /** Set the current user ID in storage (null to clear). */
  if (!userId) localStorage.removeItem(CURRENT_USER_KEY);
  else localStorage.setItem(CURRENT_USER_KEY, userId);
}
// PUBLIC_INTERFACE
export function getAllUsers() {
  /** Return all users stored in local storage. */
  return read(USERS_KEY, []);
}
// PUBLIC_INTERFACE
export function getUserById(id) {
  /** Get a user by their ID. */
  return getAllUsers().find((u) => u.id === id) || null;
}
// PUBLIC_INTERFACE
export function findUserByEmail(email) {
  /** Find a user by email address. */
  return getAllUsers().find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}
// PUBLIC_INTERFACE
export function createUser(data) {
  /**
   * Create a new user with the provided fields.
   * Expected fields: role, name, email, password, location, genres?, rate?, bio?
   */
  const users = getAllUsers();
  if (findUserByEmail(data.email)) {
    throw new Error('Email already registered');
  }
  const user = {
    id: generateId('usr'),
    role: data.role,
    name: data.name,
    email: data.email,
    password: data.password,
    location: data.location || '',
    contactNumber: data.contactNumber || '',
    artistType: data.artistType || '',
    genres: Array.isArray(data.genres) ? data.genres : [],
    rate: data.rate ?? null,
    bio: data.bio || '',
  };
  users.push(user);
  write(USERS_KEY, users);
  return user;
}

/**
 * Listings
 */
// PUBLIC_INTERFACE
export function getAllListings() {
  /** Return all listings. */
  return read(LISTINGS_KEY, []);
}
// PUBLIC_INTERFACE
export function createListing(data) {
  /**
   * Create a new listing document.
   * Fields: title, description, genre, location, rate, createdByUserId
   */
  const listings = getAllListings();
  const listing = {
    id: generateId('lst'),
    title: data.title,
    description: data.description || '',
    genre: data.genre || '',
    location: data.location || '',
    rate: Number(data.rate) || 0,
    createdByUserId: data.createdByUserId,
    createdAt: Date.now(),
  };
  listings.unshift(listing);
  write(LISTINGS_KEY, listings);
  return listing;
}
// PUBLIC_INTERFACE
export function updateListing(id, updates) {
  /** Update an existing listing by ID with provided updates. */
  const listings = getAllListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error('Listing not found');
  listings[idx] = { ...listings[idx], ...updates };
  write(LISTINGS_KEY, listings);
  return listings[idx];
}
// PUBLIC_INTERFACE
export function getListingsByUser(userId) {
  /** Get all listings created by the specified user ID. */
  return getAllListings().filter((l) => l.createdByUserId === userId);
}
// PUBLIC_INTERFACE
export function searchListings({ query = '', genre = '', location = '' }) {
  /**
   * Basic search through listings across title, description, genre, and location.
   */
  const q = String(query).toLowerCase().trim();
  const g = String(genre).toLowerCase().trim();
  const loc = String(location).toLowerCase().trim();
  return getAllListings().filter((l) => {
    const matchesQ =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q);
    const matchesG = !g || l.genre.toLowerCase().includes(g);
    const matchesLoc = !loc || l.location.toLowerCase().includes(loc);
    return matchesQ && matchesG && matchesLoc;
  });
}

/**
 * Messaging
 */
// PUBLIC_INTERFACE
export function getAllMessages() {
  /** Return all messages. */
  return read(MESSAGES_KEY, []);
}
// PUBLIC_INTERFACE
export function sendMessage({ fromUserId, toUserId, text }) {
  /**
   * Send a message from one user to another.
   * Returns the saved message with ID.
   */
  if (!fromUserId || !toUserId) throw new Error('Invalid message participants');
  const messages = getAllMessages();
  const msg = {
    id: generateId('msg'),
    fromUserId,
    toUserId,
    text: String(text || '').slice(0, 2000),
    timestamp: Date.now(),
  };
  messages.push(msg);
  write(MESSAGES_KEY, messages);
  return msg;
}
// PUBLIC_INTERFACE
export function getMessagesBetween(userA, userB) {
  /** Get all messages between two users sorted by timestamp. */
  return getAllMessages()
    .filter(
      (m) =>
        (m.fromUserId === userA && m.toUserId === userB) ||
        (m.fromUserId === userB && m.toUserId === userA)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}
// PUBLIC_INTERFACE
export function getThreadsForUser(userId) {
  /**
   * Return an array of unique conversation partner IDs
   * along with the last message for preview.
   */
  const msgs = getAllMessages().filter(
    (m) => m.fromUserId === userId || m.toUserId === userId
  );
  const threadsMap = new Map();
  msgs.forEach((m) => {
    const partnerId = m.fromUserId === userId ? m.toUserId : m.fromUserId;
    const exists = threadsMap.get(partnerId);
    if (!exists || exists.timestamp < m.timestamp) {
      threadsMap.set(partnerId, m);
    }
  });
  return Array.from(threadsMap.entries()).map(([partnerId, lastMessage]) => ({
    partnerId,
    lastMessage,
  }));
}
