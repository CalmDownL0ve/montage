// ─────────────────────────────────────────────────────────────
// MONTAGE — SVG Poster Art (fallback when no TMDB images)
// ─────────────────────────────────────────────────────────────
// These are displayed when film.poster is null.
// Once TMDB is connected, real poster images replace these.
// ─────────────────────────────────────────────────────────────

const POSTER_SVG = {
  1: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="md-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0520"/><stop offset="60%" stop-color="#1a0a3e"/><stop offset="100%" stop-color="#0d0818"/></linearGradient><radialGradient id="md-glow" cx="0.5" cy="0.35"><stop offset="0%" stop-color="#6b3fa0" stop-opacity="0.5"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <rect width="200" height="300" fill="url(#md-bg)"/><rect width="200" height="300" fill="url(#md-glow)"/>
    <path d="M0 160 Q30 130 60 145 Q90 155 120 138 Q150 125 175 140 Q190 148 200 142 V300 H0Z" fill="#0d0818" opacity="0.6"/>
    <path d="M70 300 L90 160 L110 160 L130 300Z" fill="#1a0a2e" opacity="0.4"/>
    <line x1="99" y1="170" x2="99" y2="300" stroke="#d4a574" stroke-width="0.5" opacity="0.3" stroke-dasharray="6 8"/>
    <ellipse cx="100" cy="200" rx="14" ry="16" fill="#1a0a2e"/><rect x="88" y="215" width="24" height="50" rx="6" fill="#1a0a2e"/>
    <path d="M110 188 Q116 200 112 220" fill="none" stroke="#6b8fd4" stroke-width="1.5" opacity="0.5"/>
    <text x="100" y="275" text-anchor="middle" fill="#d4a574" font-size="13" font-family="Georgia,serif" letter-spacing="3" opacity="0.85">MULHOLLAND</text>
    <text x="100" y="293" text-anchor="middle" fill="#d4a574" font-size="13" font-family="Georgia,serif" letter-spacing="3" opacity="0.85">DRIVE</text>
  </svg>`,

  2: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="ml-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0808"/><stop offset="100%" stop-color="#2a1008"/></linearGradient></defs>
    <rect width="200" height="300" fill="url(#ml-bg)"/>
    <rect x="0" y="0" width="45" height="300" fill="#1a3a2a" opacity="0.35"/>
    <rect x="55" y="0" width="90" height="300" fill="#d4a070" opacity="0.04"/>
    <ellipse cx="100" cy="125" rx="11" ry="13" fill="#2a1008"/>
    <path d="M88 138 Q85 160 87 200 Q89 230 92 260" fill="none" stroke="#c4483f" stroke-width="14" stroke-linecap="round" opacity="0.7"/>
    <path d="M92 115 Q100 108 108 118" fill="none" stroke="#2a1008" stroke-width="5"/>
    <path d="M115 180 Q125 160 120 140 Q118 120 125 100" fill="none" stroke="#d4a070" stroke-width="0.6" opacity="0.2"/>
    <circle cx="155" cy="80" r="6" fill="#d4a070" opacity="0.15"/>
    <text x="100" y="285" text-anchor="middle" fill="#d4a070" font-size="8" font-family="Georgia,serif" letter-spacing="2" opacity="0.6">花 樣 年 華</text>
    <text x="100" y="297" text-anchor="middle" fill="#d4a070" font-size="6" font-family="sans-serif" letter-spacing="1.5" opacity="0.4">IN THE MOOD FOR LOVE</text>
  </svg>`,

  3: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="es-bg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#0a1a2e"/><stop offset="100%" stop-color="#1a2a3e"/></linearGradient><radialGradient id="es-sun" cx="0.7" cy="0.25"><stop offset="0%" stop-color="#f0a050" stop-opacity="0.4"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <rect width="200" height="300" fill="url(#es-bg)"/><rect width="200" height="300" fill="url(#es-sun)"/>
    <path d="M0 195 Q50 185 100 192 Q150 198 200 188 V300 H0Z" fill="#1a3a5e" opacity="0.3"/>
    <ellipse cx="75" cy="178" rx="5" ry="6" fill="#1a2a3e" opacity="0.6"/><rect x="71" y="183" width="8" height="18" rx="3" fill="#4a8ab0" opacity="0.4"/>
    <ellipse cx="95" cy="176" rx="5" ry="6" fill="#1a2a3e" opacity="0.6"/><rect x="91" y="181" width="8" height="18" rx="3" fill="#f0a050" opacity="0.3"/>
    <path d="M70 80 Q80 50 100 55 Q120 50 130 80 Q135 100 125 115 Q115 125 100 120 Q85 125 75 115 Q65 100 70 80Z" fill="none" stroke="#4a8ab0" stroke-width="1" opacity="0.2" stroke-dasharray="3 4"/>
    <text x="100" y="250" text-anchor="middle" fill="#4a8ab0" font-size="9" font-family="sans-serif" letter-spacing="2" opacity="0.7">ETERNAL SUNSHINE</text>
    <text x="100" y="264" text-anchor="middle" fill="#f0a050" font-size="7" font-family="sans-serif" letter-spacing="1" opacity="0.5">of the spotless mind</text>
  </svg>`,

  4: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="am-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2a1a"/><stop offset="100%" stop-color="#2a3a1a"/></linearGradient><radialGradient id="am-glow" cx="0.5" cy="0.4"><stop offset="0%" stop-color="#d4a030" stop-opacity="0.2"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <rect width="200" height="300" fill="url(#am-bg)"/><rect width="200" height="300" fill="url(#am-glow)"/>
    <path d="M80 100 Q90 60 100 55 Q110 60 120 100" fill="#d4c490" opacity="0.12"/>
    <path d="M90 100 Q95 75 100 70 Q105 75 110 100" fill="#d4c490" opacity="0.15"/>
    <rect x="30" y="105" width="25" height="80" fill="#2a3a1a" opacity="0.5"/>
    <rect x="120" y="100" width="22" height="85" fill="#2a3a1a" opacity="0.5"/>
    <ellipse cx="100" cy="195" rx="10" ry="12" fill="#2a1a0a"/><rect x="92" y="207" width="16" height="30" rx="4" fill="#c45030" opacity="0.6"/>
    <text x="100" y="292" text-anchor="middle" fill="#d4a030" font-size="12" font-family="Georgia,serif" letter-spacing="2" opacity="0.7">AMÉLIE</text>
  </svg>`,

  5: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <rect width="66" height="300" fill="#0d1b2a"/><rect x="67" width="66" height="300" fill="#1b263b"/><rect x="134" width="66" height="300" fill="#415a77"/>
    <circle cx="100" cy="40" r="18" fill="#778da9" opacity="0.15"/><circle cx="100" cy="40" r="12" fill="#e0e1dd" opacity="0.1"/>
    <circle cx="33" cy="140" r="7" fill="#0a1020"/><rect x="28" y="147" width="10" height="20" rx="3" fill="#0a1020"/>
    <circle cx="100" cy="135" r="8" fill="#111d30"/><rect x="94" y="143" width="12" height="25" rx="3" fill="#111d30"/>
    <circle cx="167" cy="130" r="9" fill="#2a3a50"/><rect x="160" y="139" width="14" height="30" rx="4" fill="#2a3a50"/>
    <path d="M0 260 Q50 255 100 260 Q150 265 200 258" fill="none" stroke="#778da9" stroke-width="0.5" opacity="0.25"/>
    <line x1="66" y1="0" x2="66" y2="300" stroke="#778da9" stroke-width="0.3" opacity="0.1"/>
    <line x1="134" y1="0" x2="134" y2="300" stroke="#778da9" stroke-width="0.3" opacity="0.1"/>
    <text x="100" y="290" text-anchor="middle" fill="#e0e1dd" font-size="10" font-family="sans-serif" letter-spacing="4" opacity="0.5">MOONLIGHT</text>
  </svg>`,

  6: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="pa-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2a1a"/><stop offset="50%" stop-color="#1a1a0a"/><stop offset="100%" stop-color="#0a0a08"/></linearGradient></defs>
    <rect width="200" height="300" fill="url(#pa-bg)"/>
    <line x1="0" y1="150" x2="200" y2="150" stroke="#8aaa6a" stroke-width="0.8" opacity="0.35"/>
    <rect x="25" y="50" width="150" height="95" rx="2" fill="none" stroke="#d4c490" stroke-width="0.8" opacity="0.25"/>
    <rect x="35" y="60" width="40" height="30" rx="1" fill="#d4c490" opacity="0.06"/>
    <rect x="85" y="60" width="40" height="30" rx="1" fill="#d4c490" opacity="0.06"/>
    <rect x="40" y="155" width="120" height="70" rx="1" fill="none" stroke="#5a4a3a" stroke-width="0.6" opacity="0.25"/>
    <rect x="50" y="155" width="20" height="8" rx="0.5" fill="#d4c490" opacity="0.06"/>
    <ellipse cx="100" cy="258" rx="12" ry="8" fill="none" stroke="#8aaa6a" stroke-width="0.8" opacity="0.2"/>
    <text x="100" y="288" text-anchor="middle" fill="#8aaa6a" font-size="8" font-family="sans-serif" letter-spacing="3" opacity="0.5">기생충</text>
    <text x="100" y="298" text-anchor="middle" fill="#d4c490" font-size="7" font-family="sans-serif" letter-spacing="2" opacity="0.35">PARASITE</text>
  </svg>`,
};

export function getPosterSvg(filmId, w, h) {
  const fn = POSTER_SVG[filmId];
  return fn ? fn(w, h) : POSTER_SVG[1](w, h);
}
