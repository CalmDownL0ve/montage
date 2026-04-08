import { MOCK_FILMS, MOCK_REVIEWS } from './data.js?v=4';
import { api } from './api.js?v=4';
import { getPosterSvg } from './posters.js?v=4';

const state = { view:'feed', data:null, tab:'feed', films:MOCK_FILMS, reviews:MOCK_REVIEWS, composerMedia:[], composerTweetUrl:'' };
const $ = (s,c=document) => c.querySelector(s);
const $$ = (s,c=document) => [...c.querySelectorAll(s)];
function stars(n,cls=''){return `<span class="stars ${cls}">${'★'.repeat(Math.floor(n))}${n%1>=0.5?'½':''}</span>`;}
function getFilm(id){return state.films.find(f=>f.id===id);}
function posterHTML(fid,size='sm'){
  const f=getFilm(fid),dims={sm:[40,60],md:[110,165],lg:[120,180]},[w,h]=dims[size]||dims.sm;
  if(f?.poster) return `<div class="poster poster--${size}"><img src="${f.poster}" alt="${f.title}" onerror="this.style.display='none'"></div>`;
  return `<div class="poster poster--${size}">${getPosterSvg(fid,w,h)}</div>`;
}
// Extract tweet ID from various URL formats
function getTweetId(url){
  if(!url) return null;
  const m = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return m ? m[1] : null;
}
// Load Twitter embeds after DOM update
function loadTweetEmbeds(){
  if(window.twttr && window.twttr.widgets){ window.twttr.widgets.load(); }
  else { setTimeout(loadTweetEmbeds, 500); }
}
const MI={image:'◻︎',tweet:'𝕏',palette:'◉',sketch:'✎',quote:'❝',song:'♫'};
const SK=[
  `<svg viewBox="0 0 140 50" width="100%"><path d="M8 42Q22 6 45 25Q60 38 78 15Q92 2 130 28" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.5" stroke-linecap="round"/><circle cx="45" cy="25" r="3.5" fill="none" stroke="rgba(232,184,75,0.3)" stroke-width="0.7"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><rect x="8" y="4" width="35" height="42" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="52" y="8" width="30" height="34" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="92" y="2" width="38" height="46" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><ellipse cx="70" cy="25" rx="52" ry="20" fill="none" stroke="rgba(232,184,75,0.15)" stroke-width="0.7"/><path d="M25 25Q45 6 70 25Q95 44 115 25" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.2" stroke-linecap="round"/></svg>`
];
function cImg(c,v=0){const a=[
  `<div class="block-image" style="padding-bottom:60%;background:linear-gradient(180deg,${c[0]},${c[1]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:15%;left:20%;width:60%;height:65%;background:radial-gradient(ellipse,${c[3]}55,transparent 65%);filter:blur(8px)"></div><div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(transparent,${c[0]}cc)"></div></div></div>`,
  `<div class="block-image" style="padding-bottom:55%;background:linear-gradient(135deg,${c[1]}cc,${c[0]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:15%;left:10%;width:80%;height:75%;background:radial-gradient(circle at 30% 45%,${c[2]}55,transparent 50%)"></div></div></div>`,
  `<div class="block-image" style="padding-bottom:50%;background:linear-gradient(180deg,${c[2]}66,${c[0]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:58%;left:0;right:0;bottom:0;background:${c[1]};opacity:0.4"></div></div></div>`
];return a[v%3];}
// Styled tweet fallback (for cards or when no URL)
function styledTweet(b,compact){
  return `<div class="block-tweet ${compact?'':'block-tweet--expanded'}"><div class="block-tweet__header"><div class="block-tweet__icon">𝕏</div><span class="block-tweet__handle">${b.handle||''}</span><span class="block-tweet__time">2h</span></div><p class="block-tweet__content ${compact?'block-tweet__content--clamp':''}">${b.content||''}</p>${compact?'':'<div class="block-tweet__actions"><span>♡ 2.4k</span><span>↻ 891</span></div>'}</div>`;
}
// Real Twitter embed blockquote (rendered by widgets.js)
function realTweetEmbed(b){
  const id = getTweetId(b.tweetUrl);
  if(!id) return styledTweet(b,false);
  return `<div class="tweet-embed-container"><blockquote class="twitter-tweet" data-theme="dark" data-dnt="true"><a href="${b.tweetUrl}">Loading tweet…</a></blockquote></div>`;
}
function rBlock(b,fid,compact=false){
  const f=getFilm(fid),c=f?.colors||['#333','#555','#777','#999'];
  switch(b.type){
    case 'image':return b.url?`<div class="block-image" style="padding-bottom:60%"><img src="${b.url}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`:cImg(c,b.filmColorVariant||0);
    case 'text':return `<p class="block-text ${compact?'block-text--clamp':'block-text--expanded'}">${b.content}</p>`;
    case 'tweet':
      // Compact card view: always use styled fallback (real embeds too tall)
      if(compact) return styledTweet(b,true);
      // Expanded detail view: use real embed if tweetUrl exists
      if(b.tweetUrl) return realTweetEmbed(b);
      return styledTweet(b,false);
    case 'palette':return `<div><div class="block-palette">${(b.colors||[]).map(x=>`<div class="block-palette__swatch" style="background:${x}"></div>`).join('')}</div>${b.labels?`<div class="block-palette__labels">${b.labels.map(l=>`<span class="block-palette__label">${l}</span>`).join('')}</div>`:''}</div>`;
    case 'sketch':return `<div class="block-sketch">${SK[(b.variant||0)%3]}<div class="block-sketch__label">${b.label||''}</div></div>`;
    case 'quote':return `<div class="block-quote" style="border-left:2px solid ${c[1]}55;background:${c[1]}08"><p class="block-quote__text">"${b.content}"</p>${b.author?`<span class="block-quote__author">— ${b.author}</span>`:''}</div>`;
    default:return '';
  }
}
function rCard(r,i){
  const f=getFilm(r.filmId),ty=[...new Set(r.blocks.map(b=>b.type))].filter(t=>t!=='text');
  return `<div class="review-card" style="animation-delay:${i*0.045}s" data-action="review" data-id="${r.id}"><div class="review-card__header">${posterHTML(r.filmId,'sm')}<div class="review-card__meta"><div class="review-card__user"><div class="user-avatar" style="background:linear-gradient(135deg,${r.accent},${r.accent}88)">${r.user.username[0].toUpperCase()}</div><span class="user-name">${r.user.displayName}</span></div><div class="review-card__film-info"><span class="film-title-small">${f?.title||''}</span>${stars(r.rating,'stars--sm')}</div></div></div><div class="review-card__blocks">${r.blocks.map(b=>rBlock(b,r.filmId,true)).join('')}</div><div class="review-card__footer"><span class="like-count">${r.likes} ♡</span><div class="media-badges">${ty.map(t=>`<span class="media-badge">${MI[t]||'·'}</span>`).join('')}</div></div></div>`;
}
function renderFeed(){
  const tr=state.films.map(f=>`<div class="poster poster--md poster--clickable" data-action="film" data-id="${f.id}">${f.poster?`<img src="${f.poster}" alt="${f.title}">`:getPosterSvg(f.id,110,165)}</div>`).join('');
  return `<div class="feed"><div class="trending"><h3 class="section-label">Trending</h3><div class="trending__scroll">${tr}</div></div><h3 class="section-label">Feed</h3><div class="masonry">${state.reviews.map((r,i)=>rCard(r,i)).join('')}</div></div>`;
}
function renderReview(rv){
  const f=getFilm(rv.filmId);
  return `<div class="view animate-fade"><div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div><div class="detail-header">${posterHTML(rv.filmId,'md')}<div><h2 class="detail-title">${f?.title||''}</h2><p class="detail-subtitle">${f?.year||''} · ${f?.director||''}</p>${stars(rv.rating,'stars--lg')}<div class="detail-user"><div class="detail-user__avatar" style="background:linear-gradient(135deg,${rv.accent},${rv.accent}88)">${rv.user.username[0].toUpperCase()}</div><span class="detail-user__name">${rv.user.displayName}</span><span class="detail-user__likes">${rv.likes} ♡</span></div></div></div><div class="detail-blocks">${rv.blocks.map((b,i)=>`<div class="animate-slide delay-${i+1}">${rBlock(b,rv.filmId,false)}</div>`).join('')}</div><div class="detail-actions"><span>♡ Like</span><span>↗ Share</span><span>⊕ Save</span></div></div>`;
}
function renderFilm(fl){
  const rvs=state.reviews.filter(r=>r.filmId===fl.id);const list=(rvs.length?rvs:state.reviews.slice(0,4)).map((r,i)=>rCard(r,i)).join('');
  return `<div class="view animate-fade"><div style="padding:0 20px"><button class="back-btn" data-action="back">← back</button></div><div class="film-hero"><div class="film-hero__bg"><div class="film-hero__gradient" style="background:linear-gradient(180deg,transparent 30%,${fl.colors[0]}cc 70%,#1a1612)"></div></div><div class="film-hero__content">${posterHTML(fl.id,'lg')}<div class="film-hero__info"><h1 class="film-hero__title">${fl.title}</h1><p class="film-hero__meta">${fl.year} · ${fl.director}</p>${stars(fl.rating/2,'stars--lg')}${fl.imdbId?`<a href="https://www.imdb.com/title/${fl.imdbId}" target="_blank" style="font:400 10px var(--font-sans);color:var(--gold);margin-top:8px;display:inline-block;opacity:0.6">IMDb ↗</a>`:''}</div></div></div><div style="padding:24px 20px 0"><h3 class="section-label" style="margin-bottom:16px">Montages</h3><div class="masonry">${list}</div></div></div>`;
}
function renderCompose(){
  const o=[{k:'photo',i:'◻︎',l:'Photo'},{k:'tweet',i:'𝕏',l:'Post'},{k:'sketch',i:'✎',l:'Drawing'},{k:'quote',i:'❝',l:'Quote'},{k:'song',i:'♫',l:'Song'},{k:'palette',i:'◉',l:'Palette'}];
  const tweetInput = state.composerMedia.includes('tweet') ? `
    <div style="margin-bottom:16px">
      <span class="compose__field-label" style="display:block;margin-bottom:8px">Embed a Tweet / X Post</span>
      <input type="text" id="tweet-url-input" class="search-input" placeholder="Paste tweet URL (twitter.com/… or x.com/…)" value="${state.composerTweetUrl||''}" style="max-width:100%;margin:0;font-size:13px;padding:12px 14px;">
      ${state.composerTweetUrl && getTweetId(state.composerTweetUrl) ? `<div style="margin-top:10px;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(232,184,75,0.2);display:flex;align-items:center;gap:8px"><span style="color:var(--gold);font-size:14px">✓</span><span style="font:400 11px var(--font-sans);color:var(--text-secondary)">Tweet detected — will embed in your montage</span></div>` : ''}
      ${state.composerTweetUrl && !getTweetId(state.composerTweetUrl) && state.composerTweetUrl.length > 5 ? `<div style="margin-top:10px;padding:10px 12px;border-radius:8px;background:rgba(255,50,50,0.05);border:1px solid rgba(255,50,50,0.15);display:flex;align-items:center;gap:8px"><span style="color:#ff6b6b;font-size:11px">⚠</span><span style="font:400 11px var(--font-sans);color:#ff6b6b">Invalid URL — use format: twitter.com/user/status/123 or x.com/user/status/123</span></div>` : ''}
    </div>` : '';
  return `<div class="compose animate-fade"><button class="back-btn" data-action="back">← back</button><h2 class="compose__title">New Montage</h2>
    <div class="compose__field"><div class="compose__field-poster">+</div><div><span class="compose__field-label">Film</span><div class="compose__field-placeholder">Search…</div></div></div>
    <div style="margin-bottom:24px"><span class="compose__field-label">Rating</span><div class="compose__rating-stars">★★★★★</div></div>
    <span class="compose__field-label" style="display:block;margin-bottom:12px">Add to your montage</span>
    <div class="media-grid">${o.map(m=>`<div class="media-option ${state.composerMedia.includes(m.k)?'media-option--active':''}" data-action="toggle-media" data-key="${m.k}"><span class="media-option__icon">${m.i}</span><span class="media-option__label">${m.l}</span></div>`).join('')}</div>
    ${tweetInput}
    ${state.composerMedia.filter(k=>k!=='tweet').length?`<span class="compose__field-label" style="display:block;margin-bottom:12px">Your blocks</span>${state.composerMedia.filter(k=>k!=='tweet').map(k=>{const m=o.find(x=>x.k===k);return `<div class="compose__block-slot"><span class="compose__block-slot__icon">${m.i}</span><span class="compose__block-slot__label">Tap to add ${m.l.toLowerCase()}</span></div>`;}).join('')}`:''}<div class="compose__textarea"><span class="compose__field-label">Your thoughts</span><div class="compose__field-placeholder" style="margin-top:10px">Write…</div></div>
    <button class="btn-publish">Publish</button></div>`;
}
function render(){
  const c=$('#content');
  if(state.view==='feed')c.innerHTML=renderFeed();
  else if(state.view==='review')c.innerHTML=renderReview(state.data);
  else if(state.view==='film')c.innerHTML=renderFilm(state.data);
  else if(state.view==='compose')c.innerHTML=renderCompose();
  $$('.nav-btn').forEach(b=>b.classList.toggle('nav-btn--active',b.dataset.tab===state.tab));
  window.scrollTo(0,0);
  // Load any Twitter embeds in the view
  if(state.view==='review') setTimeout(loadTweetEmbeds, 100);
  // Bind tweet URL input if visible
  const ti = $('#tweet-url-input');
  if(ti){ ti.addEventListener('input', e=>{ state.composerTweetUrl = e.target.value; }); ti.addEventListener('change', e=>{ state.composerTweetUrl = e.target.value; render(); const inp=$('#tweet-url-input'); if(inp){inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);} }); }
}
function nav(v,d=null){state.view=v;state.data=d;if(v==='feed')state.tab='feed';if(v==='compose')state.tab='compose';render();}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-action]');if(!a)return;const t=a.dataset.action;
  if(t==='back')nav('feed');
  else if(t==='review'){const r=state.reviews.find(x=>x.id===a.dataset.id);if(r)nav('review',r);}
  else if(t==='film'){const f=state.films.find(x=>x.id===parseInt(a.dataset.id));if(f)nav('film',f);}
  else if(t==='nav'){state.tab=a.dataset.tab;if(a.dataset.tab==='feed')nav('feed');else if(a.dataset.tab==='compose')nav('compose');}
  else if(t==='toggle-media'){const k=a.dataset.key;state.composerMedia=state.composerMedia.includes(k)?state.composerMedia.filter(x=>x!==k):[...state.composerMedia,k];if(k==='tweet'&&!state.composerMedia.includes('tweet'))state.composerTweetUrl='';render();}
});
// Fetch real posters for our specific films from TMDB
(async()=>{
  render(); // render immediately with SVG fallbacks
  try {
    const fetches = MOCK_FILMS.map(async (film) => {
      if (!film.tmdbId) return film;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film.tmdbId}?api_key=6c2c758841a46971ae09531415f2f16c`);
        const m = await res.json();
        if (m.poster_path) film.poster = `https://image.tmdb.org/t/p/w342${m.poster_path}`;
        if (m.backdrop_path) film.backdrop = `https://image.tmdb.org/t/p/w780${m.backdrop_path}`;
        if (m.imdb_id) film.imdbId = m.imdb_id;
        if (m.tagline) film.tagline = m.tagline;
      } catch(e) { /* keep SVG fallback */ }
      return film;
    });
    await Promise.all(fetches);
    state.films = [...MOCK_FILMS]; // trigger re-render with poster URLs
    render();
  } catch(e) { console.warn('TMDB fetch failed, using SVG posters'); }
})();
