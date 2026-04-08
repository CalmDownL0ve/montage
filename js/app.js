import { MOCK_FILMS, MOCK_REVIEWS } from './data.js';
import { api } from './api.js';
import { getPosterSvg } from './posters.js';

const TMDB_KEY = '6c2c758841a46971ae09531415f2f16c';
const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

const state = {
  view:'feed', data:null, tab:'feed', films:MOCK_FILMS, reviews:MOCK_REVIEWS,
  composerMedia:[], composerTweetUrl:'', composerRating:0, composerFilm:null,
  composerSearch:'', composerResults:[],
  discoverQuery:'', discoverResults:[],
  discoverGenreFilms:[], discoverSelectedGenre:null,
  profileUser: { username:'montage_user', displayName:'Seb', avatar:'S', joined:'April 2026' },
};
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
let searchTimer=null;

function stars(n,cls=''){return `<span class="stars ${cls}">${'★'.repeat(Math.floor(n))}${n%1>=0.5?'½':''}</span>`;}
function getFilm(id){return state.films.find(f=>f.id===id);}
function posterHTML(fid,size='sm'){
  const f=getFilm(fid), dims={sm:[40,60],md:[110,165],lg:[120,180]}, [w,h]=dims[size]||dims.sm;
  if(f?.poster) return `<div class="poster poster--${size}"><img src="${f.poster}" alt="${f.title}" onerror="this.style.display='none'"></div>`;
  return `<div class="poster poster--${size}">${getPosterSvg(fid,w,h)}</div>`;
}
function getTweetId(url){if(!url)return null;const m=url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);return m?m[1]:null;}
function loadTweetEmbeds(){if(window.twttr&&window.twttr.widgets)window.twttr.widgets.load();else setTimeout(loadTweetEmbeds,500);}
const MI={image:'◻︎',tweet:'𝕏',palette:'◉',sketch:'✎',quote:'❝',song:'♫'};
const SK=[
  `<svg viewBox="0 0 140 50" width="100%"><path d="M8 42Q22 6 45 25Q60 38 78 15Q92 2 130 28" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.5"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><rect x="8" y="4" width="35" height="42" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="52" y="8" width="30" height="34" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><ellipse cx="70" cy="25" rx="52" ry="20" fill="none" stroke="rgba(232,184,75,0.15)" stroke-width="0.7"/></svg>`
];
function cImg(c,v=0){const a=[
  `<div class="block-image" style="padding-bottom:60%;background:linear-gradient(180deg,${c[0]},${c[1]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:15%;left:20%;width:60%;height:65%;background:radial-gradient(ellipse,${c[3]}55,transparent 65%);filter:blur(8px)"></div></div></div>`,
  `<div class="block-image" style="padding-bottom:55%;background:linear-gradient(135deg,${c[1]}cc,${c[0]})"><div style="position:absolute;inset:0"></div></div>`,
  `<div class="block-image" style="padding-bottom:50%;background:linear-gradient(180deg,${c[2]}66,${c[0]})"><div style="position:absolute;inset:0"><div style="position:absolute;top:58%;left:0;right:0;bottom:0;background:${c[1]};opacity:0.4"></div></div></div>`
];return a[v%3];}
function styledTweet(b,compact){return `<div class="block-tweet ${compact?'':'block-tweet--expanded'}"><div class="block-tweet__header"><div class="block-tweet__icon">𝕏</div><span class="block-tweet__handle">${b.handle||''}</span></div><p class="block-tweet__content ${compact?'block-tweet__content--clamp':''}">${b.content||''}</p></div>`;}
function realTweetEmbed(b){const id=getTweetId(b.tweetUrl);if(!id)return styledTweet(b,false);return `<div class="tweet-embed-container"><blockquote class="twitter-tweet" data-theme="dark" data-dnt="true"><a href="${b.tweetUrl}">Loading…</a></blockquote></div>`;}
function rBlock(b,fid,compact=false){
  const f=getFilm(fid), c=f?.colors||['#333','#555','#777','#999'];
  switch(b.type){
    case 'image':return b.url?`<div class="block-image" style="padding-bottom:60%"><img src="${b.url}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`:cImg(c,b.filmColorVariant||0);
    case 'text':return `<p class="block-text ${compact?'block-text--clamp':'block-text--expanded'}">${b.content}</p>`;
    case 'tweet':if(compact)return styledTweet(b,true);if(b.tweetUrl)return realTweetEmbed(b);return styledTweet(b,false);
    case 'palette':return `<div><div class="block-palette">${(b.colors||[]).map(x=>`<div class="block-palette__swatch" style="background:${x}"></div>`).join('')}</div>${b.labels?`<div class="block-palette__labels">${b.labels.map(l=>`<span class="block-palette__label">${l}</span>`).join('')}</div>`:''}</div>`;
    case 'sketch':return `<div class="block-sketch">${SK[(b.variant||0)%3]}<div class="block-sketch__label">${b.label||''}</div></div>`;
    case 'quote':return `<div class="block-quote" style="border-left:2px solid ${c[1]}55;background:${c[1]}08"><p class="block-quote__text">"${b.content}"</p>${b.author?`<span class="block-quote__author">— ${b.author}</span>`:''}</div>`;
    default:return '';
  }
}
function rCard(r,i){
  const f=getFilm(r.filmId), ty=[...new Set(r.blocks.map(b=>b.type))].filter(t=>t!=='text');
  return `<div class="review-card" style="animation-delay:${i*0.045}s" data-action="review" data-id="${r.id}"><div class="review-card__header">${posterHTML(r.filmId,'sm')}<div class="review-card__meta"><div class="review-card__user"><div class="user-avatar" style="background:linear-gradient(135deg,${r.accent},${r.accent}88)">${r.user.username[0].toUpperCase()}</div><span class="user-name">${r.user.displayName}</span></div><div class="review-card__film-info"><span class="film-title-small">${f?.title||''}</span>${stars(r.rating,'stars--sm')}</div></div></div><div class="review-card__blocks">${r.blocks.map(b=>rBlock(b,r.filmId,true)).join('')}</div><div class="review-card__footer"><span class="like-count">${r.likes} ♡</span><div class="media-badges">${ty.map(t=>`<span class="media-badge">${MI[t]||'·'}</span>`).join('')}</div></div></div>`;
}
// ── VIEWS ──
function renderFeed(){
  const tr=state.films.map(f=>`<div class="poster poster--md poster--clickable" data-action="film" data-id="${f.id}">${f.poster?`<img src="${f.poster}" alt="${f.title}">`:getPosterSvg(f.id,110,165)}</div>`).join('');
  return `<div class="feed"><div class="trending"><h3 class="section-label">Trending</h3><div class="trending__scroll">${tr}</div></div><h3 class="section-label">Feed</h3><div class="masonry">${state.reviews.map((r,i)=>rCard(r,i)).join('')}</div></div>`;
}
function renderReview(rv){
  const f=getFilm(rv.filmId);
  return `<div class="view animate-fade"><div><button class="back-btn" data-action="back">← back</button></div><div class="detail-header">${posterHTML(rv.filmId,'md')}<div><h2 class="detail-title">${f?.title||''}</h2><p class="detail-subtitle">${f?.year||''} · ${f?.director||''}</p>${stars(rv.rating,'stars--lg')}<div class="detail-user"><div class="detail-user__avatar" style="background:linear-gradient(135deg,${rv.accent},${rv.accent}88)">${rv.user.username[0].toUpperCase()}</div><span class="detail-user__name">${rv.user.displayName}</span><span class="detail-user__likes">${rv.likes} ♡</span></div></div></div><div class="detail-blocks">${rv.blocks.map((b,i)=>`<div class="animate-slide delay-${i+1}">${rBlock(b,rv.filmId,false)}</div>`).join('')}</div><div class="detail-actions"><span>♡ Like</span><span>↗ Share</span><span>⊕ Save</span></div></div>`;
}
function renderFilm(fl){
  const rvs=state.reviews.filter(r=>r.filmId===fl.id);
  const list=(rvs.length?rvs:state.reviews.slice(0,4)).map((r,i)=>rCard(r,i)).join('');
  const bgColor=(fl.colors||['#1a1612'])[0];
  return `<div class="view animate-fade"><div><button class="back-btn" data-action="back">← back</button></div><div class="film-hero"><div class="film-hero__bg">${fl.backdrop?`<img src="${fl.backdrop}" alt="">`:``}<div class="film-hero__gradient" style="background:linear-gradient(180deg,transparent 30%,${bgColor}cc 70%,#1a1612)"></div></div><div class="film-hero__content">${posterHTML(fl.id,'lg')}<div class="film-hero__info"><h1 class="film-hero__title">${fl.title}</h1><p class="film-hero__meta">${fl.year||''} · ${fl.director||''}</p>${stars((fl.rating||0)/2,'stars--lg')}${fl.imdbId?`<a href="https://www.imdb.com/title/${fl.imdbId}" target="_blank" rel="noopener" style="font:400 11px var(--font-sans);color:var(--gold);margin-top:8px;display:inline-block;opacity:0.6">View on IMDb ↗</a>`:``}</div></div></div><div style="margin-top:24px"><h3 class="section-label" style="margin-bottom:16px">Montages</h3><div class="masonry">${list}</div></div></div>`;
}
// ── DISCOVER ──
const GENRES=[{id:28,name:'Action'},{id:12,name:'Adventure'},{id:16,name:'Animation'},{id:35,name:'Comedy'},{id:80,name:'Crime'},{id:99,name:'Documentary'},{id:18,name:'Drama'},{id:14,name:'Fantasy'},{id:27,name:'Horror'},{id:10402,name:'Music'},{id:9648,name:'Mystery'},{id:10749,name:'Romance'},{id:878,name:'Sci-Fi'},{id:53,name:'Thriller'}];

function filmGrid(movies, action){
  return movies.map(m=>`<div class="discover-film" data-action="${action}" data-tmdb="${m.id}"><div class="poster poster--md poster--clickable">${m.poster_path?`<img src="${IMG}/w342${m.poster_path}" alt="${m.title}">`:``}</div><p class="discover-film__title">${m.title}</p><p class="discover-film__year">${m.release_date?m.release_date.slice(0,4):''}</p></div>`).join('');
}

function renderDiscover(){
  const genreTags=GENRES.map(g=>`<button class="genre-tag ${state.discoverSelectedGenre===g.id?'genre-tag--active':''}" data-action="genre" data-genre="${g.id}">${g.name}</button>`).join('');
  let genreFilmsHTML='';
  if(state.discoverSelectedGenre&&state.discoverGenreFilms.length){
    const gn=GENRES.find(g=>g.id===state.discoverSelectedGenre)?.name||'';
    genreFilmsHTML=`<h3 class="section-label" style="margin:20px 0 16px">Popular ${gn} Films</h3><div class="discover-grid">${filmGrid(state.discoverGenreFilms,'discover-film')}</div>`;
  }
  return `<div class="view animate-fade" style="max-width:var(--content-width);margin:0 auto">
    <h2 style="font:400 28px var(--font-display);color:var(--text-primary);margin:0 0 24px">Discover</h2>
    <div style="margin-bottom:28px"><input type="search" id="discover-search" class="search-input" placeholder="Search any film…" value="" style="max-width:100%;margin:0" autocomplete="off"></div>
    <div id="discover-results-area"></div>
    <div id="discover-browse"><div style="margin-bottom:24px"><h3 class="section-label" style="margin-bottom:12px">Browse by Genre</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${genreTags}</div></div>${genreFilmsHTML}</div>
  </div>`;
}
// ── PROFILE ──
function renderProfile(){
  const u=state.profileUser, ur=state.reviews;
  const avg=ur.length?(ur.reduce((s,r)=>s+r.rating,0)/ur.length).toFixed(1):'—';
  const fc=[...new Set(ur.map(r=>r.filmId))].length;
  return `<div class="view animate-fade" style="max-width:var(--content-width);margin:0 auto">
    <div style="text-align:center;padding:20px 0 32px">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#c4963a);display:flex;align-items:center;justify-content:center;font:700 24px var(--font-sans);color:var(--bg);margin:0 auto 12px">${u.avatar}</div>
      <h2 style="font:500 22px var(--font-display);color:var(--text-primary);margin:0 0 4px">${u.displayName}</h2>
      <p style="font:400 12px var(--font-sans);color:var(--text-muted)">@${u.username} · Joined ${u.joined}</p>
      <div style="display:flex;justify-content:center;gap:32px;margin-top:20px">
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--text-primary)">${ur.length}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:2px">Reviews</div></div>
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--text-primary)">${fc}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:2px">Films</div></div>
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--gold)">${avg}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:2px">Avg ★</div></div>
      </div>
    </div>
    <h3 class="section-label" style="margin-bottom:16px">Your Montages</h3>
    <div class="masonry">${ur.map((r,i)=>rCard(r,i)).join('')}</div>
  </div>`;
}
// ── COMPOSE ──
function renderCompose(){
  const opts=[{k:'photo',i:'◻︎',l:'Photo'},{k:'tweet',i:'𝕏',l:'Post'},{k:'sketch',i:'✎',l:'Drawing'},{k:'quote',i:'❝',l:'Quote'},{k:'song',i:'♫',l:'Song'},{k:'palette',i:'◉',l:'Palette'}];
  let filmPicker;
  if(state.composerFilm){
    const cf=state.composerFilm;
    const yr=cf.release_date?cf.release_date.slice(0,4):'';
    const img=cf.poster_path?`<img src="${IMG}/w92${cf.poster_path}" alt="" style="width:40px;height:60px;object-fit:cover">`:'';
    filmPicker=`<div class="compose__field" style="cursor:pointer" data-action="clear-composer-film"><div class="poster poster--sm">${img}</div><div><span class="compose__field-label">Film</span><div style="font:400 15px var(--font-display);color:var(--text-primary);margin-top:2px">${cf.title} <span style="color:var(--text-muted);font-size:12px">(${yr})</span></div></div><span style="margin-left:auto;font:400 11px var(--font-sans);color:var(--text-muted)">✕ change</span></div>`;
  } else {
    filmPicker=`<div style="margin-bottom:20px"><div class="compose__field" style="padding:8px 16px"><div class="compose__field-poster" style="width:28px;height:42px;font-size:14px">🎬</div><div style="flex:1"><input type="search" id="composer-film-search" class="search-input" placeholder="Search for a film…" value="" style="max-width:100%;margin:0;padding:10px 0;border:none;background:transparent;font-size:14px" autocomplete="off"></div></div><div id="composer-results-drop" style="background:var(--bg-card);border:1px solid var(--border);border-radius:0 0 12px 12px;margin-top:-4px;max-height:240px;overflow-y:auto;display:none"></div></div>`;
  }
  const starPicker=`<div style="margin-bottom:24px"><span class="compose__field-label">Rating</span><div style="margin-top:8px;display:flex;gap:4px">${[1,2,3,4,5].map(n=>`<button class="star-btn" data-action="set-rating" data-rating="${n}" style="font-size:28px;background:none;border:none;cursor:pointer;color:${state.composerRating>=n?'var(--gold)':'var(--text-dim)'};padding:2px 4px">★</button>`).join('')}</div></div>`;
  const mediaGrid=opts.map(m=>`<div class="media-option ${state.composerMedia.includes(m.k)?'media-option--active':''}" data-action="toggle-media" data-key="${m.k}"><span class="media-option__icon">${m.i}</span><span class="media-option__label">${m.l}</span></div>`).join('');
  const showTweet=state.composerMedia.includes('tweet');
  const tweetInput=`<div id="tweet-section" style="margin-bottom:16px;display:${showTweet?'block':'none'}"><span class="compose__field-label" style="display:block;margin-bottom:8px">Embed a Tweet / X Post</span><input type="text" id="tweet-url-input" class="search-input" placeholder="Paste tweet URL…" value="${state.composerTweetUrl||''}" style="max-width:100%;margin:0;font-size:13px;padding:12px 14px"></div>`;
  return `<div class="compose animate-fade"><h2 class="compose__title">New Montage</h2>${filmPicker}${starPicker}<span class="compose__field-label" style="display:block;margin-bottom:12px">Add to your montage</span><div class="media-grid">${mediaGrid}</div>${tweetInput}<div class="compose__textarea"><span class="compose__field-label">Your thoughts</span><div class="compose__field-placeholder" style="margin-top:10px" contenteditable="true" id="compose-text"></div></div><button class="btn-publish" data-action="publish">Publish</button></div>`;
}
// ── RENDER ──
function render(){
  const c=$('#content'); c.classList.add('loaded');
  if(state.view==='feed')c.innerHTML=renderFeed();
  else if(state.view==='review')c.innerHTML=renderReview(state.data);
  else if(state.view==='film')c.innerHTML=renderFilm(state.data);
  else if(state.view==='compose')c.innerHTML=renderCompose();
  else if(state.view==='discover')c.innerHTML=renderDiscover();
  else if(state.view==='profile')c.innerHTML=renderProfile();
  $$('.nav-btn').forEach(b=>b.classList.toggle('nav-btn--active',b.dataset.tab===state.tab));
  if(state.view==='review')setTimeout(loadTweetEmbeds,100);
  bindInputs();
}
function nav(v,d=null){state.view=v;state.data=d;render();window.scrollTo(0,0);}
function setTab(t){state.tab=t;if(t==='feed')nav('feed');else if(t==='compose')nav('compose');else if(t==='search'){state.tab='search';nav('discover');}else if(t==='profile')nav('profile');}

// ── TMDB ──
async function tmdbSearch(q){
  if(!q||q.length<2)return [];
  try{const r=await fetch(`${TMDB}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);const d=await r.json();return d.results||[];}catch(e){return [];}
}
async function tmdbGenre(gid){
  try{const r=await fetch(`${TMDB}/discover/movie?api_key=${TMDB_KEY}&with_genres=${gid}&sort_by=popularity.desc&vote_count.gte=100`);const d=await r.json();return(d.results||[]).slice(0,18);}catch(e){return [];}
}
async function tmdbMovie(id){
  try{const r=await fetch(`${TMDB}/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits`);const m=await r.json();return{id:m.id,tmdbId:m.id,imdbId:m.imdb_id,title:m.title,year:m.release_date?new Date(m.release_date).getFullYear():null,director:m.credits?.crew?.find(c=>c.job==='Director')?.name||null,poster:`${IMG}/w342${m.poster_path}`,backdrop:m.backdrop_path?`${IMG}/w780${m.backdrop_path}`:null,rating:m.vote_average,genres:m.genres?.map(g=>g.name)||[],colors:['#1a1a1a','#2a2a2a','#4a4a4a','#6a6a6a','#8a8a8a']};}catch(e){return null;}
}
// ── INPUT BINDINGS (targeted patches — NO full re-render on keystroke) ──
function renderDropdownItems(results){
  return results.slice(0,8).map(m=>{
    const j=JSON.stringify(m).replace(/'/g,"&#39;");
    const img=m.poster_path?`<img src="${IMG}/w92${m.poster_path}" style="width:100%;height:100%;object-fit:cover">`:'';
    const yr=m.release_date?m.release_date.slice(0,4):'';
    return `<div class="composer-result" data-action="pick-film" data-film='${j}'><div style="width:32px;height:48px;border-radius:4px;overflow:hidden;flex-shrink:0;background:#222">${img}</div><div><div style="font:400 14px var(--font-display);color:var(--text-primary)">${m.title}</div><div style="font:400 11px var(--font-sans);color:var(--text-muted)">${yr}</div></div></div>`;
  }).join('');
}

function bindInputs(){
  // Discover search — patches #discover-results-area only
  const ds=$('#discover-search');
  if(ds) ds.addEventListener('input',e=>{
    const q=e.target.value; clearTimeout(searchTimer);
    const area=$('#discover-results-area'), browse=$('#discover-browse');
    if(q.length>=2){
      if(area)area.innerHTML='<p style="font:400 13px var(--font-sans);color:var(--text-muted);padding:20px 0;text-align:center">Searching…</p>';
      if(browse)browse.style.display='none';
      searchTimer=setTimeout(async()=>{
        const results=await tmdbSearch(q);
        if(area){
          if(results.length) area.innerHTML=`<h3 class="section-label" style="margin-bottom:16px">Results</h3><div class="discover-grid">${filmGrid(results,'discover-film')}</div>`;
          else area.innerHTML=`<p style="font:400 14px var(--font-sans);color:var(--text-muted);padding:20px 0;text-align:center">No films found</p>`;
        }
      },400);
    } else { if(area)area.innerHTML=''; if(browse)browse.style.display=''; }
  });
  // Composer film search — patches #composer-results-drop only
  const cs=$('#composer-film-search');
  if(cs) cs.addEventListener('input',e=>{
    const q=e.target.value; clearTimeout(searchTimer);
    const drop=$('#composer-results-drop');
    if(q.length>=2){
      if(drop){drop.innerHTML='<p style="font:400 11px var(--font-sans);color:var(--text-muted);padding:10px 16px">Searching…</p>';drop.style.display='block';}
      searchTimer=setTimeout(async()=>{
        const results=await tmdbSearch(q);
        if(drop){
          if(results.length){drop.innerHTML=renderDropdownItems(results);drop.style.display='block';}
          else{drop.innerHTML='';drop.style.display='none';}
        }
      },400);
    } else { if(drop){drop.innerHTML='';drop.style.display='none';} }
  });
  // Tweet URL — just store, no re-render
  const ti=$('#tweet-url-input');
  if(ti) ti.addEventListener('input',e=>{state.composerTweetUrl=e.target.value;});
}
// ── EVENTS ──
document.addEventListener('click',async e=>{
  const a=e.target.closest('[data-action]'); if(!a)return; const t=a.dataset.action;
  if(t==='back'){if(state.tab==='search')nav('discover');else if(state.tab==='compose')nav('compose');else nav('feed');}
  else if(t==='review'){const r=state.reviews.find(x=>x.id===a.dataset.id);if(r)nav('review',r);}
  else if(t==='film'){const f=state.films.find(x=>x.id===parseInt(a.dataset.id));if(f)nav('film',f);}
  else if(t==='nav')setTab(a.dataset.tab);
  // Media toggle — direct DOM, no re-render
  else if(t==='toggle-media'){
    const k=a.dataset.key;
    state.composerMedia=state.composerMedia.includes(k)?state.composerMedia.filter(x=>x!==k):[...state.composerMedia,k];
    const opt=a.closest('.media-option'); if(opt)opt.classList.toggle('media-option--active');
    if(k==='tweet'){const ts=$('#tweet-section');if(ts)ts.style.display=state.composerMedia.includes('tweet')?'block':'none';}
  }
  // Star rating — direct DOM, no re-render
  else if(t==='set-rating'){
    state.composerRating=parseInt(a.dataset.rating);
    $$('.star-btn').forEach(b=>{const r=parseInt(b.dataset.rating);b.style.color=state.composerRating>=r?'var(--gold)':'var(--text-dim)';});
  }
  else if(t==='pick-film'){try{state.composerFilm=JSON.parse(a.dataset.film);render();}catch(e){}}
  else if(t==='clear-composer-film'){state.composerFilm=null;render();}
  else if(t==='genre'){const gid=parseInt(a.dataset.genre);state.discoverSelectedGenre=state.discoverSelectedGenre===gid?null:gid;if(state.discoverSelectedGenre){state.discoverGenreFilms=await tmdbGenre(gid);}else{state.discoverGenreFilms=[];}render();}
  else if(t==='discover-film'){const id=a.dataset.tmdb;if(id){const film=await tmdbMovie(parseInt(id));if(film){film.id=1000+film.tmdbId;state.films.push(film);nav('film',film);}}}
  else if(t==='publish'){alert('🎬 Montage published! (Backend coming soon)');setTab('feed');}
});
// ── INIT ──
(async()=>{
  render();
  try{
    const fetches=MOCK_FILMS.map(async film=>{
      if(!film.tmdbId)return;
      try{
        const r=await fetch(`${TMDB}/movie/${film.tmdbId}?api_key=${TMDB_KEY}`);
        const m=await r.json();
        if(m.poster_path)film.poster=`${IMG}/w342${m.poster_path}`;
        if(m.backdrop_path)film.backdrop=`${IMG}/w780${m.backdrop_path}`;
        if(m.imdb_id)film.imdbId=m.imdb_id;
      }catch(e){}
    });
    await Promise.all(fetches);
    state.films=[...MOCK_FILMS];
    render();
  }catch(e){console.warn('TMDB fetch failed');}
})();
