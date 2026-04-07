# MONTAGE

> Review films with photos, tweets, drawings, and more. A cross between Letterboxd and Pinterest.

## Quick Start

1. Clone the repo
2. Open `index.html` in a browser — **no build step needed**
3. Deploy to GitHub Pages: Settings → Pages → Source: `main` / `root`

## Connect APIs

### TMDB (Movie Data + Posters)
1. Sign up at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to Settings → API → Request API Key (free)
3. Open `js/api.js` and replace `YOUR_TMDB_API_KEY_HERE`

### OMDB / IMDB (Ratings + Metadata)
1. Get a free key at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Open `js/api.js` and replace `YOUR_OMDB_API_KEY_HERE`

### Letterboxd
API is in **private beta**. Apply at [letterboxd.com/api-beta](https://letterboxd.com/api-beta/).

## Project Structure
```
montage/
├── index.html       ← Entry point
├── css/styles.css   ← All styles, CSS variables
├── js/
│   ├── app.js       ← Router, state, rendering
│   ├── api.js       ← TMDB + OMDB + Letterboxd stubs
│   ├── data.js      ← Mock data (mirrors API shape)
│   └── posters.js   ← SVG poster fallbacks
└── README.md
```
