// MONTAGE — Main Application
import { MOCK_FILMS, MOCK_REVIEWS } from './data.js';
import { api, tmdb } from './api.js';
import { getPosterSvg } from './posters.js';

const state = { view: 'feed', data: null, tab: 'feed', films: MOCK_FILMS, reviews: MOCK_REVIEWS, searchOpen: false, composerMedia: [] };
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function stars(n, cls = '') {
  const full = Math.floor(n); const half = n % 1 >= 0.5;
  return `<span class="stars ${cls}">${'★'.repeat(full)}${half ? '½' : ''}</span>`;
}
function getFilm(id) { return state.films.find(f => f.id === id); }

function posterHTML(filmId, size = 'sm') {
  const film = getFilm(filmId);
  const dims = { sm: [34, 50], md: [72, 108], lg: [80, 120] };
  const [w, h] = dims[size] || dims.sm;
  if (film?.poster) {
    return `<div class="poster poster--${size}"><img src="${film.poster}" alt="${film.title}" onerror="this.style.display='none'"></div>`;
  }
  return `<div class="poster poster--${size}">${getPosterSvg(filmId, w, h)}</div>`;
}

const MEDIA_ICONS = { image: '◻︎', tweet: '𝕏', palette: '◉', sketch: '✎', quote: '❝', song: '♫' };

const SKETCH_SVGS = [
  `<svg viewBox="0 0 140 50" width="100%"><path d="M8 42 Q22 6 45 25 Q60 38 78 15 Q92 2 130 28" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.5" stroke-linecap="round"/><circle cx="45" cy="25" r="3.5" fill="none" stroke="rgba(232,184,75,0.3)" stroke-width="0.7"/><circle cx="78" cy="15" r="2.5" fill="rgba(232,184,75,0.15)"/></svg>`,

function renderCard(r, i) {
  const film = getFilm(r.filmId); const types = [...new Set(r.blocks.map(b => b.type))].filter(t => t !== 'text');
  return `<div class="review-card" style="animation-delay:${i*0.045}s" data-action="review" data-id="${r.id}">
    <div class="review-card__header">${posterHTML(r.filmId,'sm')}<div class="review-card__meta"><div class="review-card__user"><div class="user-avatar" style="background:linear-gradient(135deg,${r.accent},${r.accent}88)">${r.user.username[0].toUpperCase()}</div><span class="user-name">${r.user.displayName}</span></div><div class="review-card__film-info"><span class="film-title-small">${film?.title||''}</span>${stars(r.rating,'stars--sm')}</div></div></div>
    <div class="review-card__blocks">${r.blocks.map(b=>renderBlock(b,r.filmId,true)).join('')}</div>
    <div class="review-card__footer"><span class="like-count">${r.likes} ♡</span><div class="media-badges">${types.map(t=>`<span class="media-badge">${MEDIA_ICONS[t]||'·'}</span>`).join('')}</div></div>
  </div>`;
}

function renderFeed() {
  const trending = state.films.map(f => `<div class="poster poster--md poster--clickable" data-action="film" data-id="${f.id}">${f.poster ? `<img src="${f.poster}" alt="${f.title}">` : getPosterSvg(f.id, 72, 108)}</div>`).join('');
  const cards = state.reviews.map((r, i) => renderCard(r, i)).join('');
  return `<div class="feed"><div class="trending"><h3 class="section-label">Trending</h3><div class="trending__scroll">${trending}</div></div><h3 class="section-label">Feed</h3><div class="masonry">${cards}</div></div>`;
}

function renderReviewDetail(review) {
  const film = getFilm(review.filmId);
  return `<div class="view animate-fade"><div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div>
    <div class="detail-header">${posterHTML(review.filmId,'md')}<div><h2 class="detail-title">${film?.title||''}</h2><p class="detail-subtitle">${film?.year||''} · ${film?.director||''}</p>${stars(review.rating,'stars--lg')}<div class="detail-user"><div class="detail-user__avatar" style="background:linear-gradient(135deg,${review.accent},${review.accent}88)">${review.user.username[0].toUpperCase()}</div><span class="detail-user__name">${review.user.displayName}</span><span class="detail-user__likes">${review.likes} ♡</span></div></div></div>
    <div class="detail-blocks">${review.blocks.map((b,i)=>`<div class="animate-slide delay-${i+1}">${renderBlock(b,review.filmId,false)}</div>`).join('')}</div>
    <div class="detail-actions"><span>♡ Like</span><span>↗ Share</span><span>⊕ Save</span></div></div>`;
}

function renderFilmDetail(film) {
  const reviews = state.reviews.filter(r => r.filmId === film.id);
  const cards = (reviews.length ? reviews : state.reviews.slice(0,4)).map((r,i) => renderCard(r,i)).join('');
  return `<div class="view animate-fade"><div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div>
    <div class="film-hero"><div class="film-hero__bg">${film.backdrop?`<img src="${film.backdrop}" alt="">`:''}<div class="film-hero__gradient" style="background:linear-gradient(180deg,transparent 30%,${film.colors[0]}cc 70%,#1a1612)"></div></div>
    <div class="film-hero__content">${posterHTML(film.id,'lg')}<div class="film-hero__info"><h1 class="film-hero__title">${film.title}</h1><p class="film-hero__meta">${film.year} · ${film.director}</p>${stars(film.rating/2,'stars--lg')}${film.imdbId?`<a href="https://www.imdb.com/title/${film.imdbId}" target="_blank" style="font:400 10px var(--font-sans);color:var(--gold);margin-top:8px;display:inline-block;opacity:0.6">View on IMDb ↗</a>`:''}</div></div></div>
    <div style="padding:24px 20px 0"><h3 class="section-label" style="margin-bottom:16px">Montages</h3><div class="masonry">${cards}</div></div></div>`;
}
  `<svg viewBox="0 0 140 50" width="100%"><rect x="8" y="4" width="35" height="42" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="52" y="8" width="30" height="34" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="92" y="2" width="38" height="46" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><path d="M43 25 L52 25" stroke="rgba(232,184,75,0.3)" stroke-width="0.7" stroke-dasharray="2 1"/><path d="M82 25 L92 25" stroke="rgba(232,184,75,0.3)" stroke-width="0.7" stroke-dasharray="2 1"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><ellipse cx="70" cy="25" rx="52" ry="20" fill="none" stroke="rgba(232,184,75,0.15)" stroke-width="0.7"/><path d="M25 25 Q45 6 70 25 Q95 44 115 25" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.2" stroke-linecap="round"/><circle cx="38" cy="20" r="2.5" fill="rgba(232,184,75,0.2)"/><circle cx="70" cy="25" r="3" fill="rgba(232,184,75,0.3)"/><circle cx="102" cy="20" r="2.5" fill="rgba(232,184,75,0.2)"/></svg>`,
];

function cinematicImgHTML(c, variant = 0) {
  const v = [
    `<div class="block-image" style="padding-bottom:60%;background:linear-gradient(180deg,${c[0]},${c[1]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:15%;left:20%;width:60%;height:65%;background:radial-gradient(ellipse,${c[3]}55,transparent 65%);filter:blur(8px)"></div><div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(transparent,${c[0]}cc)"></div><div style="position:absolute;bottom:12%;left:33%;width:14%;height:50%;background:${c[0]};border-radius:40% 40% 0 0;opacity:0.65"></div></div></div>`,
    `<div class="block-image" style="padding-bottom:55%;background:linear-gradient(135deg,${c[1]}cc,${c[0]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:15%;left:10%;width:80%;height:75%;background:radial-gradient(circle at 30% 45%,${c[2]}55,transparent 50%)"></div></div></div>`,
    `<div class="block-image" style="padding-bottom:50%;background:linear-gradient(180deg,${c[2]}66,${c[0]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:58%;left:0;right:0;bottom:0;background:${c[1]};opacity:0.4"></div><div style="position:absolute;top:10%;right:20%;width:24px;height:24px;border-radius:50%;background:${c[3]};opacity:0.2;filter:blur(4px)"></div></div></div>`,
  ];
  return v[variant % 3];
}

function renderBlock(block, filmId, compact = false) {
  const film = getFilm(filmId); const c = film?.colors || ['#333','#555','#777','#999'];
  switch (block.type) {
    case 'image':
      if (block.url) return `<div class="block-image" style="padding-bottom:60%"><img src="${block.url}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`;
      return cinematicImgHTML(c, block.filmColorVariant || 0);
    case 'text':
      return `<p class="block-text ${compact ? 'block-text--clamp' : 'block-text--expanded'}">${block.content}</p>`;
    case 'tweet':
      return `<div class="block-tweet ${compact ? '' : 'block-tweet--expanded'}"><div class="block-tweet__header"><div class="block-tweet__icon">𝕏</div><span class="block-tweet__handle">${block.handle}</span><span class="block-tweet__time">2h</span></div><p class="block-tweet__content ${compact ? 'block-tweet__content--clamp' : ''}">${block.content}</p>${compact ? '' : '<div class="block-tweet__actions"><span>♡ 2.4k</span><span>↻ 891</span></div>'}</div>`;
    case 'palette':
      return `<div><div class="block-palette">${(block.colors||[]).map(c=>`<div class="block-palette__swatch" style="background:${c}"></div>`).join('')}</div>${block.labels?`<div class="block-palette__labels">${block.labels.map(l=>`<span class="block-palette__label">${l}</span>`).join('')}</div>`:''}</div>`;
    case 'sketch':
      return `<div class="block-sketch">${SKETCH_SVGS[(block.variant||0)%3]}<div class="block-sketch__label">${block.label||''}</div></div>`;
    case 'quote':
      return `<div class="block-quote" style="border-left:2px solid ${c[1]}55;background:${c[1]}08"><p class="block-quote__text">"${block.content}"</p>${block.author?`<span class="block-quote__author">— ${block.author}</span>`:''}</div>`;
    default: return '';
  }
}

function renderCompose() {
  const opts = [{key:'photo',icon:'◻︎',label:'Photo'},{key:'tweet',icon:'𝕏',label:'Post'},{key:'sketch',icon:'✎',label:'Drawing'},{key:'quote',icon:'❝',label:'Quote'},{key:'song',icon:'♫',label:'Song'},{key:'palette',icon:'◉',label:'Palette'}];
  return `<div class="compose animate-fade"><button class="back-btn" data-action="back">← back</button><h2 class="compose__title">New Montage</h2>
    <div class="compose__field"><div class="compose__field-poster">+</div><div><span class="compose__field-label">Film</span><div class="compose__field-placeholder">Search…</div></div></div>
    <div style="margin-bottom:24px"><span class="compose__field-label">Rating</span><div class="compose__rating-stars">★★★★★</div></div>
    <span class="compose__field-label" style="display:block;margin-bottom:12px">Add to your montage</span>
    <div class="media-grid">${opts.map(m=>`<div class="media-option ${state.composerMedia.includes(m.key)?'media-option--active':''}" data-action="toggle-media" data-key="${m.key}"><span class="media-option__icon">${m.icon}</span><span class="media-option__label">${m.label}</span></div>`).join('')}</div>
    ${state.composerMedia.length>0?`<span class="compose__field-label" style="display:block;margin-bottom:12px">Your blocks</span>${state.composerMedia.map(k=>{const m=opts.find(o=>o.key===k);return`<div class="compose__block-slot"><span class="compose__block-slot__icon">${m.icon}</span><span class="compose__block-slot__label">Tap to add ${m.label.toLowerCase()}</span></div>`;}).join('')}<div style="height:16px"></div>`:''}
    <div class="compose__textarea"><span class="compose__field-label">Your thoughts</span><div class="compose__field-placeholder" style="margin-top:10px">Write…</div></div>
    <button class="btn-publish">Publish</button></div>`;
}

function render() {
  const content = $('#content');
  switch (state.view) {
    case 'feed': content.innerHTML = renderFeed(); break;
    case 'review': content.innerHTML = renderReviewDetail(state.data); break;
    case 'film': content.innerHTML = renderFilmDetail(state.data); break;
    case 'compose': content.innerHTML = renderCompose(); break;
  }
  $$('.nav-btn').forEach(btn => btn.classList.toggle('nav-btn--active', btn.dataset.tab === state.tab));
  window.scrollTo(0, 0);
}

function navigate(view, data = null) { state.view = view; state.data = data; if (view==='feed') state.tab='feed'; if (view==='compose') state.tab='compose'; render(); }

function handleClick(e) {
  const a = e.target.closest('[data-action]'); if (!a) return;
  const t = a.dataset.action;
  if (t==='back') navigate('feed');
  else if (t==='review') { const r = state.reviews.find(x => x.id === a.dataset.id); if (r) navigate('review', r); }
  else if (t==='film') { const f = state.films.find(x => x.id === parseInt(a.dataset.id)); if (f) navigate('film', f); }
  else if (t==='nav') { state.tab = a.dataset.tab; if (a.dataset.tab==='feed') navigate('feed'); else if (a.dataset.tab==='compose') navigate('compose'); }
  else if (t==='toggle-media') { const k = a.dataset.key; state.composerMedia = state.composerMedia.includes(k) ? state.composerMedia.filter(x=>x!==k) : [...state.composerMedia, k]; render(); }
}

async function init() {
  const trending = await api.getTrending();
  if (trending && trending.length) { state.films = trending.map((t, i) => ({ ...t, id: i + 1, colors: MOCK_FILMS[i % MOCK_FILMS.length].colors })); }
  render();
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const o = $('.search-overlay'); if (o) o.classList.remove('search-overlay--open'); } });
}
document.addEventListener('DOMContentLoaded', init);

function renderCard(r, i) {
  const film = getFilm(r.filmId);
  const types = [...new Set(r.blocks.map(b => b.type))].filter(t => t !== 'text');
  return `<div class="review-card" style="animation-delay:${i*0.045}s" data-action="review" data-id="${r.id}">
    <div class="review-card__header">${posterHTML(r.filmId,'sm')}<div class="review-card__meta">
      <div class="review-card__user"><div class="user-avatar" style="background:linear-gradient(135deg,${r.accent},${r.accent}88)">${r.user.username[0].toUpperCase()}</div><span class="user-name">${r.user.displayName}</span></div>
      <div class="review-card__film-info"><span class="film-title-small">${film?.title||''}</span>${stars(r.rating,'stars--sm')}</div>
    </div></div>
    <div class="review-card__blocks">${r.blocks.map(b=>renderBlock(b,r.filmId,true)).join('')}</div>
    <div class="review-card__footer"><span class="like-count">${r.likes} ♡</span><div class="media-badges">${types.map(t=>`<span class="media-badge">${MEDIA_ICONS[t]||'·'}</span>`).join('')}</div></div>
  </div>`;
}

function renderFeed() {
  const trending = state.films.map(f => `<div class="poster poster--md poster--clickable" data-action="film" data-id="${f.id}">${f.poster ? `<img src="${f.poster}" alt="${f.title}">` : getPosterSvg(f.id,72,108)}</div>`).join('');
  const cards = state.reviews.map((r,i) => renderCard(r,i)).join('');
  return `<div class="feed"><div class="trending"><h3 class="section-label">Trending</h3><div class="trending__scroll">${trending}</div></div><h3 class="section-label">Feed</h3><div class="masonry">${cards}</div></div>`;
}

function renderReviewDetail(review) {
  const film = getFilm(review.filmId);
  return `<div class="view animate-fade">
    <div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div>
    <div class="detail-header">${posterHTML(review.filmId,'md')}<div>
      <h2 class="detail-title">${film?.title||''}</h2>
      <p class="detail-subtitle">${film?.year||''} · ${film?.director||''}</p>${stars(review.rating,'stars--lg')}
      <div class="detail-user"><div class="detail-user__avatar" style="background:linear-gradient(135deg,${review.accent},${review.accent}88)">${review.user.username[0].toUpperCase()}</div>
      <span class="detail-user__name">${review.user.displayName}</span><span class="detail-user__likes">${review.likes} ♡</span></div>
    </div></div>
    <div class="detail-blocks">${review.blocks.map((b,i)=>`<div class="animate-slide delay-${i+1}">${renderBlock(b,review.filmId,false)}</div>`).join('')}</div>
    <div class="detail-actions"><span>♡ Like</span><span>↗ Share</span><span>⊕ Save</span></div>
  </div>`;
}

function renderFilmDetail(film) {
  const filmReviews = state.reviews.filter(r => r.filmId === film.id);
  const reviews = filmReviews.length ? filmReviews : state.reviews.slice(0, 4);
  return `<div class="view animate-fade">
    <div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div>
    <div class="film-hero"><div class="film-hero__bg">${film.backdrop?`<img src="${film.backdrop}" alt="">`:''}<div class="film-hero__gradient" style="background:linear-gradient(180deg,transparent 30%,${film.colors[0]}cc 70%,#1a1612)"></div></div>
    <div class="film-hero__content">${posterHTML(film.id,'lg')}<div class="film-hero__info">
      <h1 class="film-hero__title">${film.title}</h1><p class="film-hero__meta">${film.year} · ${film.director}</p>${stars(film.rating/2,'stars--lg')}
      ${film.imdbId?`<a href="https://www.imdb.com/title/${film.imdbId}" target="_blank" style="font:400 10px var(--font-sans);color:var(--gold);margin-top:8px;display:inline-block;opacity:0.6">View on IMDb ↗</a>`:''}</div></div></div>
    <div style="padding:24px 20px 0"><h3 class="section-label" style="margin-bottom:16px">Montages</h3><div class="masonry">${reviews.map((r,i)=>renderCard(r,i)).join('')}</div></div></div>`;
}

function renderCompose() {
  const opts = [{key:'photo',icon:'◻︎',label:'Photo'},{key:'tweet',icon:'𝕏',label:'Post'},{key:'sketch',icon:'✎',label:'Drawing'},{key:'quote',icon:'❝',label:'Quote'},{key:'song',icon:'♫',label:'Song'},{key:'palette',icon:'◉',label:'Palette'}];
  return `<div class="compose animate-fade">
    <button class="back-btn" data-action="back">← back</button>
    <h2 class="compose__title">New Montage</h2>
    <div class="compose__field"><div class="compose__field-poster">+</div><div><span class="compose__field-label">Film</span><div class="compose__field-placeholder">Search…</div></div></div>
    <div style="margin-bottom:24px"><span class="compose__field-label">Rating</span><div class="compose__rating-stars">★★★★★</div></div>
    <span class="compose__field-label" style="display:block;margin-bottom:12px">Add to your montage</span>
    <div class="media-grid">${opts.map(m=>`<div class="media-option ${state.composerMedia.includes(m.key)?'media-option--active':''}" data-action="toggle-media" data-key="${m.key}"><span class="media-option__icon">${m.icon}</span><span class="media-option__label">${m.label}</span></div>`).join('')}</div>
    ${state.composerMedia.length?`<span class="compose__field-label" style="display:block;margin-bottom:12px">Your blocks</span>${state.composerMedia.map(k=>{const m=opts.find(o=>o.key===k);return`<div class="compose__block-slot"><span class="compose__block-slot__icon">${m.icon}</span><span class="compose__block-slot__label">Tap to add ${m.label.toLowerCase()}</span></div>`;}).join('')}<div style="height:16px"></div>`:''}
    <div class="compose__textarea"><span class="compose__field-label">Your thoughts</span><div class="compose__field-placeholder" style="margin-top:10px">Write…</div></div>
    <button class="btn-publish">Publish</button></div>`;
}

function render() {
  const content = $('#content');
  switch (state.view) {
    case 'feed': content.innerHTML = renderFeed(); break;
    case 'review': content.innerHTML = renderReviewDetail(state.data); break;
    case 'film': content.innerHTML = renderFilmDetail(state.data); break;
    case 'compose': content.innerHTML = renderCompose(); break;
  }
  updateNav(); window.scrollTo(0, 0);
}

function navigate(view, data = null) {
  state.view = view; state.data = data;
  if (view === 'feed') state.tab = 'feed';
  if (view === 'compose') state.tab = 'compose';
  render();
}

function updateNav() {
  $$('.nav-btn').forEach(btn => btn.classList.toggle('nav-btn--active', btn.dataset.tab === state.tab));
}

function toggleSearch(open) {
  const overlay = $('.search-overlay');
  if (overlay) { overlay.classList.toggle('search-overlay--open', open);
    if (open) { const input = $('.search-input'); if (input) setTimeout(() => input.focus(), 100); }
  }
}

function handleClick(e) {
  const action = e.target.closest('[data-action]'); if (!action) return;
  const type = action.dataset.action;
  if (type === 'back') navigate('feed');
  else if (type === 'review') { const r = state.reviews.find(r => r.id === action.dataset.id); if (r) navigate('review', r); }
  else if (type === 'film') { const f = state.films.find(f => f.id === parseInt(action.dataset.id)); if (f) navigate('film', f); }
  else if (type === 'nav') {
    const tab = action.dataset.tab; state.tab = tab;
    if (tab === 'feed') navigate('feed');
    else if (tab === 'compose') navigate('compose');
    else if (tab === 'search') toggleSearch(true);
    updateNav();
  } else if (type === 'toggle-media') {
    const key = action.dataset.key;
    state.composerMedia = state.composerMedia.includes(key) ? state.composerMedia.filter(k => k !== key) : [...state.composerMedia, key];
    render();
  }
}

async function init() {
  const trending = await api.getTrending();
  if (trending && trending.length) {
    state.films = trending.map((t, i) => ({ ...t, id: i + 1, colors: MOCK_FILMS[i % MOCK_FILMS.length].colors }));
  }
  render();
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleSearch(false); });
}

document.addEventListener('DOMContentLoaded', init);
