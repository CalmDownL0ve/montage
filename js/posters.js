const POSTER_SVG = {
  1: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0808"/><stop offset="100%" stop-color="#2a0a0a"/></linearGradient><radialGradient id="s2" cx="0.5" cy="0.6"><stop offset="0%" stop-color="#c4483f" stop-opacity="0.4"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <rect width="200" height="300" fill="url(#s1)"/><rect width="200" height="300" fill="url(#s2)"/>
    <path d="M60 180 Q70 150 80 160 Q90 170 100 145 Q110 120 120 150 Q130 180 140 165" fill="none" stroke="#d4a070" stroke-width="2" opacity="0.5"/>
    <circle cx="100" cy="120" r="25" fill="none" stroke="#8b1a1a" stroke-width="1" opacity="0.3"/>
    <line x1="75" y1="120" x2="125" y2="120" stroke="#c4483f" stroke-width="0.5" opacity="0.3"/>
    <rect x="85" y="200" width="30" height="50" rx="3" fill="#1a0808" opacity="0.6"/>
    <rect x="90" y="205" width="20" height="15" rx="1" fill="#d4a070" opacity="0.08"/>
    <text x="100" y="280" text-anchor="middle" fill="#c4483f" font-size="14" font-family="Georgia,serif" letter-spacing="4" opacity="0.85">SINNERS</text>
  </svg>`,
  2: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="ob1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0d1b2a"/><stop offset="100%" stop-color="#1b4332"/></linearGradient></defs>
    <rect width="200" height="300" fill="url(#ob1)"/>
    <circle cx="100" cy="100" r="40" fill="none" stroke="#d4a574" stroke-width="0.8" opacity="0.2" stroke-dasharray="4 3"/>
    <path d="M60 150 L80 130 L100 155 L120 125 L140 150" fill="none" stroke="#c45030" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
    <rect x="30" y="170" width="140" height="60" fill="none" stroke="#d4a574" stroke-width="0.5" opacity="0.15"/>
    <text x="100" y="200" text-anchor="middle" fill="#d4a574" font-size="6" font-family="sans-serif" letter-spacing="2" opacity="0.3">CHRISTMAS ADVENTURERS CLUB</text>
    <path d="M50 250 L100 240 L150 250" fill="none" stroke="#1b4332" stroke-width="1" opacity="0.3"/>
    <text x="100" y="275" text-anchor="middle" fill="#d4a574" font-size="8" font-family="Georgia,serif" letter-spacing="1.5" opacity="0.7">ONE BATTLE</text>
    <text x="100" y="290" text-anchor="middle" fill="#d4a574" font-size="8" font-family="Georgia,serif" letter-spacing="1.5" opacity="0.7">AFTER ANOTHER</text>
  </svg>`,
  3: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <rect width="200" height="300" fill="#2a1a0a"/>
    <rect x="60" y="80" width="80" height="50" rx="2" fill="none" stroke="#c4963a" stroke-width="0.8" opacity="0.25"/>
    <line x1="60" y1="105" x2="140" y2="105" stroke="#c4963a" stroke-width="0.3" opacity="0.2"/>
    <ellipse cx="100" cy="170" rx="8" ry="8" fill="#e8d4a0" opacity="0.1"/>
    <path d="M92 170 L80 185" stroke="#c4963a" stroke-width="1" opacity="0.3"/>
    <path d="M108 170 L120 185" stroke="#c4963a" stroke-width="1" opacity="0.3"/>
    <circle cx="75" cy="140" r="3" fill="#8b6914" opacity="0.3"/><circle cx="125" cy="140" r="3" fill="#8b6914" opacity="0.3"/>
    <text x="100" y="250" text-anchor="middle" fill="#c4963a" font-size="10" font-family="Georgia,serif" letter-spacing="3" opacity="0.8">MARTY</text>
    <text x="100" y="268" text-anchor="middle" fill="#c4963a" font-size="10" font-family="Georgia,serif" letter-spacing="3" opacity="0.8">SUPREME</text>
  </svg>`,
  4: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="sa1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2a1a"/><stop offset="100%" stop-color="#0a1a0a"/></linearGradient></defs>
    <rect width="200" height="300" fill="url(#sa1)"/>
    <rect x="40" y="60" width="120" height="80" rx="2" fill="none" stroke="#8aaa6a" stroke-width="0.6" opacity="0.2"/>
    <rect x="50" y="70" width="40" height="25" rx="1" fill="#3a5a3a" opacity="0.15"/>
    <rect x="95" y="70" width="55" height="25" rx="1" fill="#3a5a3a" opacity="0.1"/>
    <circle cx="100" cy="180" r="12" fill="none" stroke="#d4c490" stroke-width="0.8" opacity="0.2"/>
    <path d="M88 180 L75 200 M112 180 L125 200" stroke="#8aaa6a" stroke-width="0.5" opacity="0.2"/>
    <text x="100" y="260" text-anchor="middle" fill="#8aaa6a" font-size="8" font-family="sans-serif" letter-spacing="2" opacity="0.6">THE SECRET</text>
    <text x="100" y="276" text-anchor="middle" fill="#d4c490" font-size="8" font-family="sans-serif" letter-spacing="2" opacity="0.5">AGENT</text>
  </svg>`,
  5: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <defs><linearGradient id="f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0a1a"/><stop offset="50%" stop-color="#1a2a3e"/><stop offset="100%" stop-color="#0a0a1a"/></linearGradient></defs>
    <rect width="200" height="300" fill="url(#f1)"/>
    <path d="M80 100 Q90 60 100 55 Q110 60 120 100" fill="none" stroke="#4a6a8a" stroke-width="1" opacity="0.3"/>
    <line x1="100" y1="55" x2="100" y2="35" stroke="#8ab0c4" stroke-width="0.5" opacity="0.4"/>
    <path d="M85 120 Q92 90 100 95 Q108 90 115 120 Q110 145 100 140 Q90 145 85 120Z" fill="none" stroke="#4a6a8a" stroke-width="0.8" opacity="0.2"/>
    <circle cx="95" cy="110" r="2" fill="#8ab0c4" opacity="0.2"/><circle cx="105" cy="110" r="2" fill="#8ab0c4" opacity="0.2"/>
    <path d="M60 200 Q80 180 100 190 Q120 180 140 200" fill="none" stroke="#d4e0e8" stroke-width="0.5" opacity="0.15"/>
    <line x1="80" y1="160" x2="80" y2="250" stroke="#4a6a8a" stroke-width="0.3" opacity="0.1"/><line x1="120" y1="160" x2="120" y2="250" stroke="#4a6a8a" stroke-width="0.3" opacity="0.1"/>
    <text x="100" y="275" text-anchor="middle" fill="#8ab0c4" font-size="10" font-family="Georgia,serif" letter-spacing="4" opacity="0.7">FRANKEN</text>
    <text x="100" y="292" text-anchor="middle" fill="#8ab0c4" font-size="10" font-family="Georgia,serif" letter-spacing="4" opacity="0.7">STEIN</text>
  </svg>`,
  6: (w, h) => `<svg viewBox="0 0 200 300" width="${w}" height="${h}">
    <rect width="200" height="300" fill="#1a0a0a"/>
    <circle cx="100" cy="100" r="35" fill="none" stroke="#6a3a2a" stroke-width="0.8" opacity="0.25"/>
    <circle cx="100" cy="100" r="25" fill="none" stroke="#a05a3a" stroke-width="0.5" opacity="0.2"/>
    <path d="M75 100 Q87 80 100 100 Q113 80 125 100" fill="none" stroke="#d48a5a" stroke-width="1.5" opacity="0.3"/>
    <line x1="100" y1="140" x2="100" y2="220" stroke="#6a3a2a" stroke-width="0.4" opacity="0.2" stroke-dasharray="3 4"/>
    <rect x="70" y="180" width="60" height="40" rx="2" fill="none" stroke="#a05a3a" stroke-width="0.5" opacity="0.15"/>
    <text x="100" y="256" text-anchor="middle" fill="#d48a5a" font-size="7" font-family="sans-serif" letter-spacing="1.5" opacity="0.5">28 YEARS LATER</text>
    <text x="100" y="275" text-anchor="middle" fill="#a05a3a" font-size="9" font-family="Georgia,serif" letter-spacing="2" opacity="0.7">THE BONE</text>
    <text x="100" y="292" text-anchor="middle" fill="#a05a3a" font-size="9" font-family="Georgia,serif" letter-spacing="2" opacity="0.7">TEMPLE</text>
  </svg>`,
};
export function getPosterSvg(filmId, w, h) {
  const fn = POSTER_SVG[filmId];
  return fn ? fn(w, h) : POSTER_SVG[1](w, h);
}
