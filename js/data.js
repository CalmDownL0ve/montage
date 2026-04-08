export const MOCK_FILMS = [
  {
    id: 1, tmdbId: 1233069, imdbId: 'tt21064584',
    title: 'Sinners', year: 2025, director: 'Ryan Coogler',
    rating: 9.8, genres: ['Horror', 'Drama', 'Music'],
    poster: null, backdrop: null,
    colors: ['#1a0808', '#8b1a1a', '#d4a070', '#c4483f', '#2a1008'],
    tagline: 'Come and get some.',
  },
  {
    id: 2, tmdbId: 1064213, imdbId: 'tt23561236',
    title: 'One Battle After Another', year: 2025, director: 'Paul Thomas Anderson',
    rating: 9.6, genres: ['Drama', 'Comedy', 'Action'],
    poster: null, backdrop: null,
    colors: ['#0d1b2a', '#1b4332', '#d4a574', '#c45030', '#0a1a0a'],
    tagline: 'How do you fight back when all seems lost?',
  },
  {
    id: 3, tmdbId: 1064028, imdbId: 'tt28015403',
    title: 'Marty Supreme', year: 2025, director: 'Josh Safdie',
    rating: 8.8, genres: ['Drama', 'Comedy'],
    poster: null, backdrop: null,
    colors: ['#2a1a0a', '#8b6914', '#e8d4a0', '#c4963a', '#1a1a0a'],
    tagline: 'Every table has a hustle.',
  },
  {
    id: 4, tmdbId: 1197306, imdbId: 'tt14999086',
    title: 'The Secret Agent', year: 2025, director: 'Kleber Mendonça Filho',
    rating: 8.4, genres: ['Thriller', 'Drama'],
    poster: null, backdrop: null,
    colors: ['#1a2a1a', '#3a5a3a', '#8aaa6a', '#d4c490', '#0a1a0a'],
    tagline: 'Every system has a crack.',
  },
  {
    id: 5, tmdbId: 1186947, imdbId: 'tt31576498',
    title: 'Frankenstein', year: 2025, director: 'Guillermo del Toro',
    rating: 8.6, genres: ['Horror', 'Drama', 'Gothic'],
    poster: null, backdrop: null,
    colors: ['#0a0a1a', '#1a2a3e', '#4a6a8a', '#8ab0c4', '#d4e0e8'],
    tagline: 'What is it to be alive?',
  },
  {
    id: 6, tmdbId: 1335510, imdbId: 'tt32880780',
    title: '28 Years Later: The Bone Temple', year: 2026, director: 'Nia DaCosta',
    rating: 8.2, genres: ['Horror', 'Action', 'Thriller'],
    poster: null, backdrop: null,
    colors: ['#1a0a0a', '#3a1a1a', '#6a3a2a', '#a05a3a', '#d48a5a'],
    tagline: 'The rage never dies.',
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'r1', user: { username: 'bloodmoon.cinema', displayName: 'Dara Okafor', avatar: null },
    filmId: 1, rating: 5, likes: 2847, createdAt: '2026-04-01T10:00:00Z',
    accent: '#c4483f',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 0 },
      { type: 'text', content: 'Coogler dropped vampires into the 1930s Mississippi Delta and somehow made the most important American film about cultural inheritance in years. The blues isn\'t just the soundtrack — it\'s the weapon. When that juke joint scene hits, you feel the bass in your chest before the horror even starts.' },
      { type: 'tweet', handle: '@davidehrlich', content: 'Sinners absolutely rips — my favorite Ryan Coogler movie so far, by far. see it BIG with a crowd.', tweetUrl: 'https://x.com/davidehrlich/status/1910363140425949288' },
      { type: 'palette', colors: ['#1a0808', '#8b1a1a', '#d4a070', '#c4483f', '#f0d4a0'], labels: ['night', 'blood', 'delta', 'fire', 'dawn'] },
    ],
  },
  {
    id: 'r2', user: { username: 'the.last.frame', displayName: 'Ellis Park', avatar: null },
    filmId: 1, rating: 5, likes: 1203, createdAt: '2026-03-28T14:30:00Z',
    accent: '#8b1a1a',
    blocks: [
      { type: 'text', content: 'Michael B. Jordan playing twins who are both running from something and toward something. Stack wants redemption. Smoke wants to forget. The South won\'t let either of them do either.' },
      { type: 'image', url: null, filmColorVariant: 1 },
      { type: 'quote', content: 'A rollicking crowd-pleaser packing a nasty bite, a horrific folktale with a genuine soul', author: '/Film' },
    ],
  },
  {
    id: 'r3', user: { username: 'reeltalks', displayName: 'reeltalks', avatar: null },
    filmId: 2, rating: 5, likes: 3412, createdAt: '2026-03-15T18:00:00Z',
    accent: '#1b4332',
    blocks: [
      { type: 'text', content: 'PTA made an IMAX action epic about a washed-up revolutionary trying to save his daughter from an unhinged colonel — and it\'s somehow the funniest movie of the year. Spielberg called it a relative of Dr. Strangelove. He\'s right. You laugh because if you don\'t, you scream.' },
      { type: 'tweet', handle: '@davidehrlich', content: 'One Battle After Another: Paul Thomas Anderson hadn\'t set a movie in the present since Punch-Drunk Love, but he makes up for lost time by delivering one of the defining blockbusters of the 21st century.', tweetUrl: 'https://x.com/davidehrlich/status/1968345421182595137' },
      { type: 'image', url: null, filmColorVariant: 2 },
    ],
  },
  {
    id: 'r4', user: { username: 'lightandcolor', displayName: 'noor al-farsi', avatar: null },
    filmId: 2, rating: 5, likes: 1891, createdAt: '2026-03-20T21:45:00Z',
    accent: '#c45030',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 0 },
      { type: 'text', content: 'DiCaprio hasn\'t been this unhinged since Wolf of Wall Street. But here the mania has weight — it\'s the desperation of a father, an activist, a country losing its grip. The Christmas Adventurers Club scene might be the best single sequence PTA has ever shot.' },
      { type: 'palette', colors: ['#0d1b2a', '#1b4332', '#d4a574', '#c45030', '#e8d4a0'], labels: ['shadow', 'rebel', 'dust', 'rage', 'hope'] },
    ],
  },
  {
    id: 'r5', user: { username: 'deep.focus', displayName: 'sam osei', avatar: null },
    filmId: 3, rating: 4.5, likes: 1567, createdAt: '2026-02-14T08:00:00Z',
    accent: '#c4963a',
    blocks: [
      { type: 'text', content: 'Josh Safdie made a movie about table tennis that\'s actually about obsession, class, and the performance of masculinity. Chalamet doesn\'t just play Marty — he becomes this twitchy, calculating hustler who sees every room as a game to win.' },
      { type: 'sketch', label: 'the serve', variant: 0 },
      { type: 'quote', content: 'An intense Timothée Chalamet, never better', author: 'Metacritic' },
    ],
  },
  {
    id: 'r6', user: { username: 'framebyframe', displayName: 'alex ko', avatar: null },
    filmId: 4, rating: 4.5, likes: 892, createdAt: '2026-02-10T09:15:00Z',
    accent: '#3a5a3a',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 1 },
      { type: 'text', content: 'Mendonça Filho shot this like a documentary that accidentally captured a thriller. Wagner Moura gives a performance so naturalistic you forget you\'re watching an actor. The grime, the paranoia, the sweat — Brazil\'s authoritarian past feels like everyone\'s present.' },
      { type: 'sketch', label: 'escape route', variant: 1 },
    ],
  },
  {
    id: 'r7', user: { username: 'noire.dreams', displayName: 'dani voss', avatar: null },
    filmId: 5, rating: 5, likes: 2104, createdAt: '2026-01-20T12:00:00Z',
    accent: '#4a6a8a',
    blocks: [
      { type: 'text', content: 'Del Toro\'s entire career was a prelude to this. He didn\'t just adapt Frankenstein — he resurrected it. The creature isn\'t a monster here. He\'s the most human character on screen. Every frame drips with Gothic beauty and genuine heartbreak.' },
      { type: 'image', url: null, filmColorVariant: 2 },
      { type: 'palette', colors: ['#0a0a1a', '#1a2a3e', '#4a6a8a', '#8ab0c4', '#d4e0e8'], labels: ['void', 'lab', 'storm', 'life', 'snow'] },
      { type: 'quote', content: 'The maestro\'s intoxicating encounter with Mary Shelley\'s 1818 classic comes roaring back to life in a lightning-charged act of Gothic grandeur', author: 'THR' },
    ],
  },
  {
    id: 'r8', user: { username: 'softglow', displayName: 'lena park', avatar: null },
    filmId: 6, rating: 4, likes: 1456, createdAt: '2026-04-05T20:15:00Z',
    accent: '#a05a3a',
    blocks: [
      { type: 'image', url: null, filmColorVariant: 0 },
      { type: 'text', content: 'DaCosta cranks the Iron Maiden, amps up the gore, and delivers the most brutally entertaining sequel in the franchise. Ralph Fiennes is spectacular — as physical as he is soulful. The Bone Temple earns its name in the final act.' },
      { type: 'tweet', handle: '@DiscussingFilm', content: 'Nia DaCosta turns down the ruminations on grief, amps up the gore and cranks the Iron Maiden, delivering a brutally entertaining sequel.', tweetUrl: 'https://x.com/DiscussingFilm/status/1912561811649425768' },
    ],
  },
];
