// ─────────────────────────────────────────────────────────────
// MONTAGE — Mock Data
// ─────────────────────────────────────────────────────────────
// This data powers the app before APIs are connected.
// Every object matches the shape returned by api.js
// so swapping to real data is a drop-in replacement.
// ─────────────────────────────────────────────────────────────

export const MOCK_FILMS = [
  {
    id: 1, tmdbId: 1018, imdbId: 'tt0166924',
    title: 'Mulholland Drive', year: 2001, director: 'David Lynch',
    rating: 8.0, genres: ['Thriller', 'Drama', 'Mystery'],
    poster: null,  // Will use SVG fallback until TMDB key is set
    backdrop: null,
    colors: ['#1a0a2e', '#3b1a5e', '#8b2252', '#d4a574', '#0d0d1a'],
    tagline: 'A love story in the city of dreams.',
  },
  {
    id: 2, tmdbId: 843, imdbId: 'tt0118694',
    title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai',
    rating: 8.1, genres: ['Drama', 'Romance'],
    poster: null, backdrop: null,
    colors: ['#8b1a1a', '#c4483f', '#d4a070', '#2a1a0a', '#1a3a2a'],
    tagline: 'Feel the heat, keep the feeling burning.',
  },
  {
    id: 3, tmdbId: 38, imdbId: 'tt0338013',
    title: 'Eternal Sunshine of the Spotless Mind', year: 2004, director: 'Michel Gondry',
    rating: 8.1, genres: ['Science Fiction', 'Drama', 'Romance'],
    poster: null, backdrop: null,
    colors: ['#1a3a5e', '#4a8ab0', '#d4d4e0', '#f0a050', '#2a1a3e'],
    tagline: 'You can erase someone from your mind. Getting them out of your heart is another story.',
  },
  {
    id: 4, tmdbId: 194, imdbId: 'tt0211915',
    title: 'Amélie', year: 2001, director: 'Jean-Pierre Jeunet',
    rating: 7.9, genres: ['Comedy', 'Romance'],
    poster: null, backdrop: null,
    colors: ['#4a6a2a', '#8ab040', '#d4a030', '#c45030', '#1a2a1a'],
    tagline: 'She\'ll change your life.',
  },
  {
    id: 5, tmdbId: 376867, imdbId: 'tt4975722',
    title: 'Moonlight', year: 2016, director: 'Barry Jenkins',
    rating: 7.4, genres: ['Drama'],
    poster: null, backdrop: null,
    colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'],
    tagline: 'Every moment, every moment.',
  },
  {
    id: 6, tmdbId: 496243, imdbId: 'tt6751668',
    title: 'Parasite', year: 2019, director: 'Bong Joon-ho',
    rating: 8.5, genres: ['Comedy', 'Thriller', 'Drama'],
    poster: null, backdrop: null,
    colors: ['#3a5a3a', '#8aaa6a', '#d4c490', '#5a4a3a', '#1a1a1a'],
    tagline: 'Act like you own the place.',
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'r1', user: { username: 'maya', displayName: 'maya hirano', avatar: null },
    filmId: 2, rating: 5, likes: 342, createdAt: '2026-03-28T14:30:00Z',
    accent: '#c4483f',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 0 },
      { type: 'text', content: 'Every frame is a painting. Wong Kar-wai didn\'t direct a film — he bottled longing.' },
      { type: 'image', url: null, filmColorVariant: 1 },
    ],
  },
  {
    id: 'r2', user: { username: 'framebyframe', displayName: 'alex ko', avatar: null },
    filmId: 1, rating: 4.5, likes: 218, createdAt: '2026-03-27T09:15:00Z',
    accent: '#6b3fa0',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 2 },
      { type: 'quote', content: 'Now I\'m in this dream place', author: 'Betty Elms' },
    ],
  },
  {
    id: 'r3', user: { username: 'reeltalks', displayName: 'reeltalks', avatar: null },
    filmId: 6, rating: 5, likes: 891, createdAt: '2026-03-26T18:00:00Z',
    accent: '#3f8a50',
    blocks: [
      { type: 'text', content: 'The architecture IS the movie. Every staircase, every window, every flood drain — class warfare built into the set design.' },
      { type: 'tweet', handle: '@bongjoonho_fan', content: 'just realized the Parks never once look UP in the entire film. the Kims never stop looking up. cinema.' },
      { type: 'image', url: null, filmColorVariant: 0 },
    ],
  },
  {
    id: 'r4', user: { username: 'lightandcolor', displayName: 'noor al-farsi', avatar: null },
    filmId: 5, rating: 4.5, likes: 567, createdAt: '2026-03-25T21:45:00Z',
    accent: '#2a6a9f',
    blocks: [
      { type: 'palette', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'], labels: ['i', 'ii', 'iii', 'iv', 'v'] },
      { type: 'image', url: null, filmColorVariant: 1 },
      { type: 'text', content: 'Three chapters. Three palettes. Three lives.' },
    ],
  },
  {
    id: 'r5', user: { username: 'noire.dreams', displayName: 'dani voss', avatar: null },
    filmId: 3, rating: 4, likes: 445, createdAt: '2026-03-24T12:00:00Z',
    accent: '#9f6a2a',
    blocks: [
      { type: 'sketch', label: 'memory map', variant: 0 },
      { type: 'text', content: 'Gondry built a machine to erase memories and accidentally made the most memorable film about love.' },
    ],
  },
  {
    id: 'r6', user: { username: 'the.cut', displayName: 'jules marin', avatar: null },
    filmId: 4, rating: 4.5, likes: 623, createdAt: '2026-03-23T16:30:00Z',
    accent: '#6a9f2a',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 1 },
      { type: 'image', url: null, filmColorVariant: 2 },
      { type: 'text', content: 'Amélie sees magic in the mundane. Jeunet\'s Paris doesn\'t exist, but I want to live there.' },
    ],
  },
  {
    id: 'r7', user: { username: 'deep.focus', displayName: 'sam osei', avatar: null },
    filmId: 1, rating: 5, likes: 1204, createdAt: '2026-03-22T08:00:00Z',
    accent: '#9f2a6a',
    blocks: [
      { type: 'text', content: 'The diner scene. That\'s it. That\'s the review.' },
      { type: 'sketch', label: 'narrative loop', variant: 2 },
      { type: 'tweet', handle: '@lynchposting', content: 'mulholland drive is not a puzzle to solve. it\'s a feeling to surrender to.' },
    ],
  },
  {
    id: 'r8', user: { username: 'softglow', displayName: 'lena park', avatar: null },
    filmId: 2, rating: 5, likes: 789, createdAt: '2026-03-21T20:15:00Z',
    accent: '#c47a3f',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 2 },
      { type: 'text', content: 'Red dress. Green curtain. Smoke between two people who will never touch.' },
      { type: 'sketch', label: 'hallway study', variant: 1 },
    ],
  },
];
