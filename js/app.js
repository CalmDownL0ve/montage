import { MOCK_FILMS, MOCK_REVIEWS } from './data.js';
import { api } from './api.js';
import { getPosterSvg } from './posters.js';

const TMDB_KEY='6c2c758841a46971ae09531415f2f16c', TMDB='https://api.themoviedb.org/3', IMG='https://image.tmdb.org/t/p';
const state={view:'feed',data:null,tab:'feed',films:MOCK_FILMS,reviews:MOCK_REVIEWS,
  cMedia:[],cTweet:'',cRating:0,cFilm:null,cSearch:'',cResults:[],
  dQuery:'',dResults:[],dGenre:null,dGenreFilms:[],
  user:{username:'montage_user',displayName:'Seb',avatar:'S',joined:'April 2026'}};
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
let searchTimer=null;

function stars(n,cls=''){return `<span class="stars ${cls}">${'★'.repeat(Math.floor(n))}${n%1>=0.5?'½':''}</span>`;}
function getFilm(id){return state.films.find(f=>f.id===id);}
function posterHTML(fid,size='sm'){
  const f=getFilm(fid),dims={sm:[40,60],md:[110,165],lg:[120,180]},[w,h]=dims[size]||dims.sm;
  if(f?.poster)return `<div class="poster poster--${size}"><img src="${f.poster}" alt="${f.title}" onerror="this.style.display='none'"></div>`;
  return `<div class="poster poster--${size}">${getPosterSvg(fid,w,h)}</div>`;
}
function getTweetId(u){if(!u)return null;const m=u.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);return m?m[1]:null;}
function loadEmbeds(){if(window.twttr?.widgets)window.twttr.widgets.load();else setTimeout(loadEmbeds,500);}
const MI={image:'◻︎',tweet:'𝕏',palette:'◉',sketch:'✎',quote:'❝',song:'♫'};
const SK=[`<svg viewBox="0 0 140 50" width="100%"><path d="M8 42Q22 6 45 25Q60 38 78 15Q92 2 130 28" fill="none" stroke="rgba(232,184,75,0.4)" stroke-width="1.5"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><rect x="8" y="4" width="35" height="42" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/><rect x="52" y="8" width="30" height="34" rx="2" fill="none" stroke="rgba(232,184,75,0.2)" stroke-width="0.7"/></svg>`,
  `<svg viewBox="0 0 140 50" width="100%"><ellipse cx="70" cy="25" rx="52" ry="20" fill="none" stroke="rgba(232,184,75,0.15)" stroke-width="0.7"/></svg>`];
function cImg(c,v=0){const a=[
  `<div class="block-image" style="padding-bottom:60%;background:linear-gradient(180deg,${c[0]},${c[1]})"></div>`,
  `<div class="block-image" style="padding-bottom:55%;background:linear-gradient(135deg,${c[1]}cc,${c[0]})"></div>`,
  `<div class="block-image" style="padding-bottom:50%;background:linear-gradient(180deg,${c[2]}66,${c[0]})"></div>`
];return a[v%3];}
function tweet(b,compact){return `<div class="block-tweet"><div class="block-tweet__header"><div class="block-tweet__icon">𝕏</div><span class="block-tweet__handle">${b.handle||''}</span></div><p class="block-tweet__content${compact?' block-tweet__content--clamp':''}">${b.content||''}</p></div>`;}
function rBlock(b,fid,compact){
  const f=getFilm(fid),c=f?.colors||['#333','#555','#777','#999'];
  if(b.type==='image')return cImg(c,b.filmColorVariant||0);
  if(b.type==='text')return `<p class="block-text${compact?' block-text--clamp':''}">${b.content}</p>`;
  if(b.type==='tweet'){if(compact)return tweet(b,true);if(b.tweetUrl)return `<div class="tweet-embed-container"><blockquote class="twitter-tweet" data-theme="dark"><a href="${b.tweetUrl}">Loading…</a></blockquote></div>`;return tweet(b,false);}
  if(b.type==='palette')return `<div><div class="block-palette">${(b.colors||[]).map(x=>`<div class="block-palette__swatch" style="background:${x}"></div>`).join('')}</div>${b.labels?`<div class="block-palette__labels">${b.labels.map(l=>`<span class="block-palette__label">${l}</span>`).join('')}</div>`:''}</div>`;
  if(b.type==='sketch')return `<div class="block-sketch">${SK[(b.variant||0)%3]}<div class="block-sketch__label">${b.label||''}</div></div>`;
  if(b.type==='quote')return `<div class="block-quote" style="border-left:2px solid ${c[1]}55"><p class="block-quote__text">"${b.content}"</p>${b.author?`<span class="block-quote__author">— ${b.author}</span>`:''}</div>`;
  return '';
}
function rCard(r,i){
  const f=getFilm(r.filmId),ty=[...new Set(r.blocks.map(b=>b.type))].filter(t=>t!=='text');
  return `<div class="review-card" style="animation-delay:${i*0.045}s" data-action="review" data-id="${r.id}"><div class="review-card__header">${posterHTML(r.filmId,'sm')}<div class="review-card__meta"><div class="review-card__user"><div class="user-avatar" style="background:linear-gradient(135deg,${r.accent},${r.accent}88)">${r.user.username[0].toUpperCase()}</div><span class="user-name">${r.user.displayName}</span></div><div class="review-card__film-info"><span class="film-title-small">${f?.title||''}</span>${stars(r.rating,'stars--sm')}</div></div></div><div class="review-card__blocks">${r.blocks.map(b=>rBlock(b,r.filmId,true)).join('')}</div><div class="review-card__footer"><span class="like-count">${r.likes} ♡</span><div class="media-badges">${ty.map(t=>`<span class="media-badge">${MI[t]||'·'}</span>`).join('')}</div></div></div>`;
}
function filmGrid(movies){
  return movies.map(m=>`<div class="discover-film" data-action="tmdb-film" data-tmdb="${m.id}"><div class="poster poster--md poster--clickable">${m.poster_path?`<img src="${IMG}/w342${m.poster_path}" alt="${m.title}">`:''}</div><p class="discover-film__title">${m.title}</p><p class="discover-film__year">${m.release_date?m.release_date.slice(0,4):''}</p></div>`).join('');
}
function renderFeed(){
  const tr=state.films.map(f=>`<div class="poster poster--md poster--clickable" data-action="film" data-id="${f.id}">${f.poster?`<img src="${f.poster}" alt="${f.title}">`:getPosterSvg(f.id,110,165)}</div>`).join('');
  return `<div class="feed"><div class="trending"><h3 class="section-label">Trending</h3><div class="trending__scroll">${tr}</div></div><h3 class="section-label">Feed</h3><div class="masonry">${state.reviews.map((r,i)=>rCard(r,i)).join('')}</div></div>`;
}
function renderReview(rv){
  const f=getFilm(rv.filmId);
  return `<div class="view animate-fade"><button class="back-btn" data-action="back">← back</button><div class="detail-header">${posterHTML(rv.filmId,'md')}<div><h2 class="detail-title">${f?.title||''}</h2><p class="detail-subtitle">${f?.year||''} · ${f?.director||''}</p>${stars(rv.rating,'stars--lg')}<div class="detail-user"><div class="detail-user__avatar" style="background:linear-gradient(135deg,${rv.accent},${rv.accent}88)">${rv.user.username[0].toUpperCase()}</div><span class="detail-user__name">${rv.user.displayName}</span><span class="detail-user__likes">${rv.likes} ♡</span></div></div></div><div class="detail-blocks">${rv.blocks.map((b,i)=>`<div class="animate-slide delay-${i+1}">${rBlock(b,rv.filmId,false)}</div>`).join('')}</div></div>`;
}
function renderFilm(fl){
  const c0=(fl.colors||['#1a1612'])[0];
  const rvs=state.reviews.filter(r=>r.filmId===fl.id);
  const list=rvs.length?rvs.map((r,i)=>rCard(r,i)).join(''):`<p style="font:400 14px var(--font-sans);color:var(--text-muted);text-align:center;padding:40px 0">No montages yet — be the first.</p>`;
  return `<div class="view animate-fade"><button class="back-btn" data-action="back">← back</button><div class="film-hero"><div class="film-hero__bg">${fl.backdrop?`<img src="${fl.backdrop}" alt="">`:''}<div class="film-hero__gradient" style="background:linear-gradient(180deg,transparent 30%,${c0}cc 70%,#1a1612)"></div></div><div class="film-hero__content">${posterHTML(fl.id,'lg')}<div class="film-hero__info"><h1 class="film-hero__title">${fl.title}</h1><p class="film-hero__meta">${fl.year||''} · ${fl.director||''}</p>${stars((fl.rating||0)/2,'stars--lg')}${fl.imdbId?`<a href="https://www.imdb.com/title/${fl.imdbId}" target="_blank" rel="noopener" style="font:400 11px var(--font-sans);color:var(--gold);margin-top:8px;display:inline-block;opacity:0.6">IMDb ↗</a>`:''}</div></div></div><div style="margin-top:24px"><h3 class="section-label">Montages</h3><div class="masonry">${list}</div></div></div>`;
}
const GENRES=[{id:28,n:'Action'},{id:35,n:'Comedy'},{id:80,n:'Crime'},{id:99,n:'Documentary'},{id:18,n:'Drama'},{id:14,n:'Fantasy'},{id:27,n:'Horror'},{id:10402,n:'Music'},{id:9648,n:'Mystery'},{id:10749,n:'Romance'},{id:878,n:'Sci-Fi'},{id:53,n:'Thriller'}];
function renderDiscover(){
  const tags=GENRES.map(g=>`<button class="genre-tag${state.dGenre===g.id?' genre-tag--active':''}" data-action="genre" data-gid="${g.id}">${g.n}</button>`).join('');
  let gFilms='';
  if(state.dGenre&&state.dGenreFilms.length){
    const gn=GENRES.find(g=>g.id===state.dGenre)?.n||'';
    gFilms=`<h3 class="section-label" style="margin:20px 0 16px">Popular ${gn} Films</h3><div class="discover-grid">${filmGrid(state.dGenreFilms)}</div>`;
  }
  return `<div class="view animate-fade" style="max-width:var(--content-width);margin:0 auto">
    <h2 style="font:400 28px var(--font-display);color:var(--text-primary);margin:0 0 24px">Discover</h2>
    <div style="margin-bottom:28px"><input type="search" id="d-search" class="search-input" placeholder="Search any film…" style="max-width:100%;margin:0" autocomplete="off"></div>
    <div id="d-results"></div>
    <div id="d-browse"><div style="margin-bottom:24px"><h3 class="section-label" style="margin-bottom:12px">Browse by Genre</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${tags}</div></div>${gFilms}</div>
  </div>`;
}
function renderProfile(){
  const u=state.user,ur=state.reviews,avg=ur.length?(ur.reduce((s,r)=>s+r.rating,0)/ur.length).toFixed(1):'—',fc=[...new Set(ur.map(r=>r.filmId))].length;
  return `<div class="view animate-fade" style="max-width:var(--content-width);margin:0 auto">
    <div style="text-align:center;padding:20px 0 32px">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#c4963a);display:flex;align-items:center;justify-content:center;font:700 24px var(--font-sans);color:var(--bg);margin:0 auto 12px">${u.avatar}</div>
      <h2 style="font:500 22px var(--font-display);color:var(--text-primary);margin:0 0 4px">${u.displayName}</h2>
      <p style="font:400 12px var(--font-sans);color:var(--text-muted)">@${u.username} · Joined ${u.joined}</p>
      <div style="display:flex;justify-content:center;gap:32px;margin-top:20px">
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--text-primary)">${ur.length}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px">Reviews</div></div>
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--text-primary)">${fc}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px">Films</div></div>
        <div style="text-align:center"><div style="font:400 24px var(--font-display);color:var(--gold)">${avg}</div><div style="font:400 10px var(--font-sans);color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px">Avg ★</div></div>
      </div>
    </div>
    <h3 class="section-label" style="margin-bottom:16px">Your Montages</h3>
    <div class="masonry">${ur.map((r,i)=>rCard(r,i)).join('')}</div></div>`;
}
function renderCompose(){
  const opts=[{k:'photo',i:'◻︎',l:'Photo'},{k:'tweet',i:'𝕏',l:'Post'},{k:'sketch',i:'✎',l:'Drawing'},{k:'quote',i:'❝',l:'Quote'},{k:'song',i:'♫',l:'Song'},{k:'palette',i:'◉',l:'Palette'}];
  let filmPick='';
  if(state.cFilm){
    const yr=state.cFilm.release_date?state.cFilm.release_date.slice(0,4):'';
    const img=state.cFilm.poster_path?`<img src="${IMG}/w92${state.cFilm.poster_path}" style="width:40px;height:60px;object-fit:cover">`:'';
    filmPick=`<div class="compose__field" style="cursor:pointer" data-action="clear-film"><div class="poster poster--sm">${img}</div><div><span class="compose__field-label">Film</span><div style="font:400 15px var(--font-display);color:var(--text-primary);margin-top:2px">${state.cFilm.title} <span style="color:var(--text-muted);font-size:12px">(${yr})</span></div></div><span style="margin-left:auto;font:400 11px var(--font-sans);color:var(--text-muted)">✕</span></div>`;
  } else {
    filmPick=`<div style="margin-bottom:20px"><div class="compose__field" style="padding:8px 16px"><div style="font-size:14px;flex-shrink:0">🎬</div><div style="flex:1"><input type="search" id="c-search" class="search-input" placeholder="Search for a film…" style="max-width:100%;margin:0;padding:10px 0;border:none;background:transparent;font-size:14px" autocomplete="off"></div></div><div id="c-results" style="background:var(--bg-card);border:1px solid var(--border);border-radius:0 0 12px 12px;margin-top:-4px;max-height:240px;overflow-y:auto;display:none"></div></div>`;
  }
  const starPick=[1,2,3,4,5].map(n=>`<button class="star-btn" data-action="rate" data-n="${n}" style="font-size:28px;background:none;border:none;cursor:pointer;color:${state.cRating>=n?'var(--gold)':'var(--text-dim)'};padding:2px 4px">★</button>`).join('');
  const media=opts.map(m=>`<div class="media-option${state.cMedia.includes(m.k)?' media-option--active':''}" data-action="media" data-k="${m.k}"><span class="media-option__icon">${m.i}</span><span class="media-option__label">${m.l}</span></div>`).join('');
  function mBox(id,show,icon,label,ph,extra=''){return `<div id="box-${id}" class="compose__block-slot" style="display:${show?'flex':'none'};flex-direction:column;align-items:stretch;gap:10px"><div style="display:flex;align-items:center;gap:10px"><span class="compose__block-slot__icon">${icon}</span><span class="compose__block-slot__label">${label}</span></div><input type="text" id="c-${id}" placeholder="${ph}" style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.06);font:300 14px var(--font-display);color:var(--text-primary);outline:none">${extra}</div>`;}
  const mediaInputs=`<div id="media-inputs" style="margin-bottom:20px">`
    +mBox('photo',state.cMedia.includes('photo'),'◻︎','Photo','Paste image URL…')
    +mBox('tweet',state.cMedia.includes('tweet'),'𝕏','Post','Paste tweet / X post URL…')
    +mBox('sketch',state.cMedia.includes('sketch'),'✎','Drawing','Label for your sketch…')
    +mBox('quote',state.cMedia.includes('quote'),'❝','Quote','Enter quote text…',`<input type="text" id="c-quote-author" placeholder="Author / source" style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.06);font:300 14px var(--font-display);color:var(--text-primary);outline:none">`)
    +mBox('song',state.cMedia.includes('song'),'♫','Song','Paste Spotify or Apple Music URL…')
    +mBox('palette',state.cMedia.includes('palette'),'◉','Palette','Hex colors, comma separated (e.g. #1a0808, #8b1a1a)')
    +`</div>`;
  return `<div class="compose animate-fade"><h2 class="compose__title">New Montage</h2>${filmPick}<div style="margin-bottom:24px"><span class="compose__field-label">Rating</span><div style="margin-top:8px;display:flex;gap:4px">${starPick}</div></div><span class="compose__field-label" style="display:block;margin-bottom:12px">Add to your montage</span><div class="media-grid">${media}</div>${mediaInputs}<div class="compose__textarea"><span class="compose__field-label">Your thoughts</span><textarea id="c-thoughts" placeholder="What did you think of the film?" style="width:100%;margin-top:10px;min-height:100px;padding:14px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.06);font:300 15px/1.6 var(--font-display);color:var(--text-primary);outline:none;resize:vertical"></textarea></div><button class="btn-publish" data-action="publish">Publish</button></div>`;
}
// ── RENDER ──
function render(){
  const c=$('#content');c.classList.add('loaded');
  const views={feed:renderFeed,review:()=>renderReview(state.data),film:()=>renderFilm(state.data),compose:renderCompose,discover:renderDiscover,profile:renderProfile};
  c.innerHTML=(views[state.view]||renderFeed)();
  $$('.nav-btn').forEach(b=>b.classList.toggle('nav-btn--active',b.dataset.tab===state.tab));
  if(state.view==='review')setTimeout(loadEmbeds,100);
  bindInputs();
}
function nav(v,d=null){state.view=v;state.data=d;render();window.scrollTo(0,0);}
function setTab(t){state.tab=t;
  if(t==='feed')nav('feed');else if(t==='compose')nav('compose');
  else if(t==='search'){state.tab='search';nav('discover');}
  else if(t==='profile')nav('profile');
}
// ── TMDB ──
async function tmdbSearch(q){
  if(!q||q.length<2)return[];
  try{const r=await fetch(`${TMDB}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);return(await r.json()).results||[];}catch(e){return[];}
}
async function tmdbGenre(gid){
  try{const r=await fetch(`${TMDB}/discover/movie?api_key=${TMDB_KEY}&with_genres=${gid}&sort_by=popularity.desc&vote_count.gte=100`);return((await r.json()).results||[]).slice(0,18);}catch(e){return[];}
}
async function tmdbMovie(id){
  try{const r=await fetch(`${TMDB}/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits`);const m=await r.json();
  return{id:m.id,tmdbId:m.id,imdbId:m.imdb_id,title:m.title,year:m.release_date?new Date(m.release_date).getFullYear():null,director:m.credits?.crew?.find(c=>c.job==='Director')?.name||null,poster:`${IMG}/w342${m.poster_path}`,backdrop:m.backdrop_path?`${IMG}/w780${m.backdrop_path}`:null,rating:m.vote_average,genres:m.genres?.map(g=>g.name)||[],colors:['#1a1a1a','#2a2a2a','#4a4a4a','#6a6a6a','#8a8a8a']};}catch(e){return null;}
}
// ── TARGETED DOM PATCHES (no full re-render = no blink) ──
function patchDropdown(id,results){
  const el=$(id);if(!el)return;
  if(!results.length){el.style.display='none';el.innerHTML='';return;}
  el.style.display='block';
  el.innerHTML=results.slice(0,8).map(m=>{
    const j=JSON.stringify({id:m.id,title:m.title,release_date:m.release_date||'',poster_path:m.poster_path||''}).replace(/"/g,'&quot;');
    return `<div class="composer-result" data-action="pick" data-film="${j}"><div style="width:32px;height:48px;border-radius:4px;overflow:hidden;flex-shrink:0;background:#222">${m.poster_path?`<img src="${IMG}/w92${m.poster_path}" style="width:100%;height:100%;object-fit:cover">`:''}</div><div><div style="font:400 14px var(--font-display);color:var(--text-primary)">${m.title}</div><div style="font:400 11px var(--font-sans);color:var(--text-muted)">${m.release_date?m.release_date.slice(0,4):''}</div></div></div>`;
  }).join('');
}
function patchDiscover(results){
  const el=$('#d-results'),br=$('#d-browse');if(!el)return;
  if(!results.length&&!state.dQuery){el.innerHTML='';if(br)br.style.display='';return;}
  if(br)br.style.display=state.dQuery?'none':'';
  if(results.length){el.innerHTML=`<h3 class="section-label" style="margin-bottom:16px">Results</h3><div class="discover-grid">${filmGrid(results)}</div>`;}
  else if(state.dQuery){el.innerHTML=`<p style="font:400 14px var(--font-sans);color:var(--text-muted);text-align:center;padding:40px 0">No films found</p>`;}
  else{el.innerHTML='';}
}
// ── INPUT BINDINGS (patched, not re-rendered) ──
function bindInputs(){
  const ds=$('#d-search');
  if(ds)ds.addEventListener('input',e=>{
    state.dQuery=e.target.value;clearTimeout(searchTimer);
    if(e.target.value.length>=2){searchTimer=setTimeout(async()=>{state.dResults=await tmdbSearch(e.target.value);patchDiscover(state.dResults);},400);}
    else{state.dResults=[];patchDiscover([]);}
  });
  const cs=$('#c-search');
  if(cs)cs.addEventListener('input',e=>{
    state.cSearch=e.target.value;clearTimeout(searchTimer);
    if(e.target.value.length>=2){searchTimer=setTimeout(async()=>{state.cResults=await tmdbSearch(e.target.value);patchDropdown('#c-results',state.cResults);},400);}
    else{state.cResults=[];patchDropdown('#c-results',[]);}
  });
  const tw=$('#c-tweet');
  if(tw)tw.addEventListener('input',e=>{state.cTweet=e.target.value;});
}
// ── EVENTS ──
document.addEventListener('click',async e=>{
  const a=e.target.closest('[data-action]');if(!a)return;const t=a.dataset.action;
  if(t==='back')setTab(state.tab==='search'?'search':'feed');
  else if(t==='review'){const r=state.reviews.find(x=>x.id===a.dataset.id);if(r)nav('review',r);}
  else if(t==='film'){const f=state.films.find(x=>x.id===parseInt(a.dataset.id));if(f)nav('film',f);}
  else if(t==='nav')setTab(a.dataset.tab);
  // Media toggle — NO re-render, just toggle class + show/hide tweet
  else if(t==='media'){
    const k=a.dataset.k,el=a.closest('.media-option');
    state.cMedia=state.cMedia.includes(k)?state.cMedia.filter(x=>x!==k):[...state.cMedia,k];
    if(el)el.classList.toggle('media-option--active');
    ['photo','tweet','sketch','quote','song','palette'].forEach(m=>{const b=$('#box-'+m);if(b)b.style.display=state.cMedia.includes(m)?'block':'none';});
  }
  // Star rating — NO re-render, just update colors
  else if(t==='rate'){
    state.cRating=parseInt(a.dataset.n);
    $$('.star-btn').forEach(b=>{b.style.color=state.cRating>=parseInt(b.dataset.n)?'var(--gold)':'var(--text-dim)';});
  }
  // Pick film from search results
  else if(t==='pick'){try{state.cFilm=JSON.parse(a.dataset.film.replace(/&quot;/g,'"'));state.cSearch='';state.cResults=[];render();}catch(ex){}}
  else if(t==='clear-film'){state.cFilm=null;render();}
  // Genre browse
  else if(t==='genre'){const gid=parseInt(a.dataset.gid);state.dGenre=state.dGenre===gid?null:gid;if(state.dGenre){state.dGenreFilms=await tmdbGenre(gid);}else{state.dGenreFilms=[];}render();}
  // Discover film detail
  else if(t==='tmdb-film'){const id=parseInt(a.dataset.tmdb);if(id){const film=await tmdbMovie(id);if(film){film.id=1000+film.tmdbId;state.films.push(film);nav('film',film);}}}
  else if(t==='publish'){alert('🎬 Montage published!');setTab('feed');}
});
// ── INIT ──
(async()=>{
  render();
  try{
    await Promise.all(MOCK_FILMS.map(async film=>{
      if(!film.tmdbId)return;
      try{const r=await fetch(`${TMDB}/movie/${film.tmdbId}?api_key=${TMDB_KEY}`);const m=await r.json();
        if(m.poster_path)film.poster=`${IMG}/w342${m.poster_path}`;
        if(m.backdrop_path)film.backdrop=`${IMG}/w780${m.backdrop_path}`;
        if(m.imdb_id)film.imdbId=m.imdb_id;
      }catch(e){}
    }));
    state.films=[...MOCK_FILMS];render();
  }catch(e){console.warn('TMDB fetch failed');}
})();
