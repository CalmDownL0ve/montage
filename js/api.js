// MONTAGE — API Integration Layer
// Replace placeholder keys as needed.

const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // <-- Replace with your key
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

export const tmdb = {
  posterUrl(path, size = 'w342') { if (!path) return null; return `${TMDB_IMG}/${size}${path}`; },
  backdropUrl(path, size = 'w780') { if (!path) return null; return `${TMDB_IMG}/${size}${path}`; },

  async searchMovies(query, page = 1) {
    try {
      const res = await fetch(`${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
      const data = await res.json();
      return data.results.map(m => ({
        id: m.id, tmdbId: m.id, title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        poster: this.posterUrl(m.poster_path), backdrop: this.backdropUrl(m.backdrop_path),
        overview: m.overview, rating: m.vote_average, voteCount: m.vote_count,
      }));
    } catch (err) { console.error('[TMDB] Search failed:', err); return []; }
  },

  async getMovie(tmdbId) {
    try {
      const res = await fetch(`${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`);
      const m = await res.json();
      return {
        id: m.id, tmdbId: m.id, imdbId: m.imdb_id, title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        director: m.credits?.crew?.find(c => c.job === 'Director')?.name || null,
        poster: this.posterUrl(m.poster_path), posterLg: this.posterUrl(m.poster_path, 'w500'),
        backdrop: this.backdropUrl(m.backdrop_path), backdropLg: this.backdropUrl(m.backdrop_path, 'w1280'),
        overview: m.overview, runtime: m.runtime,
        genres: m.genres?.map(g => g.name) || [], rating: m.vote_average, tagline: m.tagline,
      };
    } catch (err) { console.error('[TMDB] Get movie failed:', err); return null; }
  },

  async getTrending(timeWindow = 'week') {
    try {
      const res = await fetch(`${TMDB_BASE}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      return data.results.slice(0, 12).map(m => ({
        id: m.id, tmdbId: m.id, title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        poster: this.posterUrl(m.poster_path), backdrop: this.backdropUrl(m.backdrop_path),
        rating: m.vote_average,
      }));
    } catch (err) { console.error('[TMDB] Trending failed:', err); return []; }
  },

  async discover({ genre, year, sortBy = 'popularity.desc', page = 1 } = {}) {
    try {
      let url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&page=${page}`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&primary_release_year=${year}`;
      const res = await fetch(url); const data = await res.json();
      return data.results.map(m => ({ id: m.id, tmdbId: m.id, title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        poster: this.posterUrl(m.poster_path), rating: m.vote_average,
      }));
    } catch (err) { console.error('[TMDB] Discover failed:', err); return []; }
  },
};

// OMDB / IMDB — Get key at https://www.omdbapi.com/apikey.aspx (free, 1000 req/day)
const OMDB_API_KEY = 'YOUR_OMDB_API_KEY_HERE';
export const imdb = {
  async getByImdbId(imdbId) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`);
      const m = await res.json(); if (m.Response === 'False') return null;
      return { imdbId: m.imdbID, title: m.Title, year: parseInt(m.Year), rated: m.Rated,
        runtime: m.Runtime, director: m.Director, actors: m.Actors, plot: m.Plot,
        imdbRating: parseFloat(m.imdbRating), imdbVotes: m.imdbVotes,
        metascore: m.Metascore !== 'N/A' ? parseInt(m.Metascore) : null,
        rottenTomatoes: m.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || null,
        awards: m.Awards, boxOffice: m.BoxOffice,
        poster: m.Poster !== 'N/A' ? m.Poster : null,
      };
    } catch (err) { console.error('[OMDB] Fetch failed:', err); return null; }
  },
  async search(title, year = null) {
    try {
      let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(title)}&type=movie`;
      if (year) url += `&y=${year}`;
      const res = await fetch(url); const data = await res.json();
      if (data.Response === 'False') return [];
      return data.Search.map(m => ({ imdbId: m.imdbID, title: m.Title, year: parseInt(m.Year),
        poster: m.Poster !== 'N/A' ? m.Poster : null }));
    } catch (err) { console.error('[OMDB] Search failed:', err); return []; }
  },
  link(imdbId) { return `https://www.imdb.com/title/${imdbId}`; },
};

// Letterboxd — API is in PRIVATE BETA. Apply: https://letterboxd.com/api-beta/
// Requires HMAC-SHA256 signed requests — use a serverless proxy (Cloudflare Worker, Vercel fn)
// Base URL: https://api.letterboxd.com/api/v0 | Docs: https://api-docs.letterboxd.com/
const LB_API_KEY = 'YOUR_LETTERBOXD_API_KEY_HERE';
const LB_BASE = 'https://api.letterboxd.com/api/v0';
export const letterboxd = {
  async searchFilms(query) { console.warn('[Letterboxd] API not connected'); return []; },
  async getFilm(filmId) { console.warn('[Letterboxd] API not connected'); return null; },
  async getFilmStatistics(filmId) { console.warn('[Letterboxd] API not connected'); return null; },
  async getFilmReviews(filmId, opts = {}) { console.warn('[Letterboxd] API not connected'); return { items: [], next: null }; },
  filmLink(slug) { return `https://letterboxd.com/film/${slug}/`; },
  userLink(username) { return `https://letterboxd.com/${username}/`; },
};

// Your own backend stubs — Suggested: Supabase, Firebase, or PlanetScale
const MONTAGE_API_BASE = '/api';
export const montageApi = {
  async getFeed({ page = 1, perPage = 20 } = {}) { return { reviews: [], nextPage: null }; },
  async getReview(reviewId) { return null; },
  async getReviewsForFilm(tmdbId, { page = 1 } = {}) { return { reviews: [], nextPage: null }; },
  async createReview({ filmTmdbId, rating, blocks }) { return null; },
  async deleteReview(reviewId) { return false; },
  async getUser(username) { return null; },
  async getUserReviews(username, { page = 1 } = {}) { return { reviews: [], nextPage: null }; },
  async uploadImage(file) { return null; },
  async likeReview(reviewId) { return false; },
  async saveReview(reviewId) { return false; },
};

// Unified data fetcher — combines TMDB + your backend
export const api = {
  async getTrending() {
    if (TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE') return tmdb.getTrending();
    return null;
  },
  async searchMovies(query) {
    if (TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE') return tmdb.searchMovies(query);
    return [];
  },
  async getMovieDetails(tmdbId) {
    const movie = await tmdb.getMovie(tmdbId);
    if (movie?.imdbId && OMDB_API_KEY !== 'YOUR_OMDB_API_KEY_HERE') {
      const omdbData = await imdb.getByImdbId(movie.imdbId);
      if (omdbData) {
        movie.imdbRating = omdbData.imdbRating;
        movie.metascore = omdbData.metascore;
        movie.rottenTomatoes = omdbData.rottenTomatoes;
        movie.imdbLink = imdb.link(movie.imdbId);
      }
    }
    return movie;
  },
  async getFeed(page) { return montageApi.getFeed({ page }); },
  async getReview(id) { return montageApi.getReview(id); },
};
