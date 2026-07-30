/**
 * Pictorial (illustrated) Ather × Autoelite showroom facade — used in place of a
 * storefront photo. Fills its container; pass the store locality as `name`.
 */
export default function Storefront({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Illustration of the Autoelite ${name} Ather showroom`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="sf-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7dc98" />
          <stop offset="1" stopColor="#d8ab52" />
        </linearGradient>
        <linearGradient id="sf-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfeaee" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#b6c6cd" stopOpacity="0.25" />
          <stop offset="1" stopColor="#8fa4ac" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="sf-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8cc63f" />
          <stop offset="1" stopColor="#3f9d34" />
        </linearGradient>
      </defs>

      {/* wall + pavement */}
      <rect width="800" height="500" fill="#eceae4" />
      <rect x="0" y="0" width="800" height="118" fill="#e4e2db" />
      <rect x="0" y="430" width="800" height="70" fill="#dad8d1" />
      <rect x="0" y="430" width="800" height="3" fill="#c9c7bf" />

      {/* brick accent (right edge) */}
      <g>
        <rect x="742" y="0" width="58" height="430" fill="#a6614a" />
        {[16, 44, 72, 100, 128, 156, 184, 212, 240, 268, 296, 324, 352, 380, 408].map((y) => (
          <line key={y} x1="742" y1={y} x2="800" y2={y} stroke="#8a4d39" strokeWidth="2" />
        ))}
        <line x1="771" y1="0" x2="771" y2="430" stroke="#8a4d39" strokeWidth="2" />
      </g>

      {/* signboard */}
      <rect x="44" y="26" width="700" height="80" rx="3" fill="#1c1c1a" />
      {/* Autoelite mark: green power-ring + e */}
      <g transform="translate(92,66)">
        <path
          d="M -18 6 A 20 20 0 1 1 18 6"
          fill="none"
          stroke="url(#sf-brand)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="-4" y="-26" width="8" height="16" rx="3" fill="#2f7d2a" />
        <text x="0" y="9" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="22" fill="url(#sf-brand)">e</text>
      </g>
      <text x="122" y="74" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="26" letterSpacing="1.5" fill="#ffffff">AUTOELITE</text>
      <text x="700" y="74" textAnchor="end" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="26" letterSpacing="2" fill="#ffffff">ATHER</text>

      {/* pilaster between windows */}
      <rect x="392" y="106" width="26" height="324" fill="#d7d5cd" />
      {/* left window */}
      <g>
        <rect x="66" y="120" width="320" height="250" fill="url(#sf-glow)" />
        <rect x="66" y="120" width="320" height="250" fill="url(#sf-glass)" />
        {/* neon accent */}
        <polyline points="96,150 210,150 250,196" fill="none" stroke="#fffbe9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* tagline */}
        <text x="96" y="196" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#ffffff">Quick</text>
        <text x="96" y="222" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#ffffff">Quicker</text>
        <text x="96" y="248" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#ffffff">Ather</text>
        <path d="M96 262 l16 16 m0 -12 l0 12 l-12 0" fill="none" stroke="#e8792b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* scooter silhouette (step-through, facing right) */}
        <g transform="translate(208,296)" fill="#2a2a24">
          <path d="M30 44 Q30 22 54 22 L82 22 Q93 22 95 33 L97 44 Z" />
          <rect x="26" y="41" width="78" height="8" rx="4" />
          <path d="M96 44 L92 15 Q92 9 100 9 L108 9 L118 44 Z" />
          <rect x="98" y="5" width="27" height="6" rx="3" />
          <circle cx="125" cy="8" r="4" />
          <circle cx="30" cy="52" r="13" />
          <circle cx="118" cy="52" r="13" />
          <circle cx="30" cy="52" r="5.5" fill="#dcbf63" />
          <circle cx="118" cy="52" r="5.5" fill="#dcbf63" />
        </g>
      </g>
      <rect x="66" y="120" width="320" height="250" fill="none" stroke="#cfcdc4" strokeWidth="4" />

      {/* right window (shorter — steps below) */}
      <g>
        <rect x="424" y="120" width="252" height="188" fill="url(#sf-glow)" />
        <rect x="424" y="120" width="252" height="188" fill="url(#sf-glass)" />
        <text x="550" y="180" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" letterSpacing="2" fill="#3c3c34">ATHER</text>
        <g transform="translate(482,232) scale(0.74)" fill="#2a2a24">
          <path d="M30 44 Q30 22 54 22 L82 22 Q93 22 95 33 L97 44 Z" />
          <rect x="26" y="41" width="78" height="8" rx="4" />
          <path d="M96 44 L92 15 Q92 9 100 9 L108 9 L118 44 Z" />
          <rect x="98" y="5" width="27" height="6" rx="3" />
          <circle cx="125" cy="8" r="4" />
          <circle cx="30" cy="52" r="13" />
          <circle cx="118" cy="52" r="13" />
        </g>
      </g>
      <rect x="424" y="120" width="252" height="188" fill="none" stroke="#cfcdc4" strokeWidth="4" />

      {/* steps (below right window) */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={470 + i * 28} y={318 + i * 22} width={210 - i * 28} height="22" fill={i % 2 ? "#c9c7c0" : "#d6d4cd"} />
        ))}
        <line x1="470" y1="318" x2="450" y2="430" stroke="#33322e" strokeWidth="6" strokeLinecap="round" />
        <line x1="680" y1="318" x2="680" y2="430" stroke="#33322e" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* charger pillar */}
      <g transform="translate(432,322)">
        <rect x="0" y="0" width="26" height="86" rx="4" fill="#f5f5f2" stroke="#cfcdc5" strokeWidth="2" />
        <rect x="10" y="12" width="6" height="40" rx="3" fill="url(#sf-brand)" />
        <rect x="4" y="86" width="18" height="22" rx="2" fill="#2b2b27" />
      </g>

      {/* potted plants on the steps */}
      {[[560, 300], [598, 322], [636, 344]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="10" cy="-4" r="14" fill="#3f7d3a" />
          <circle cx="0" cy="2" r="11" fill="#4b8f42" />
          <circle cx="20" cy="2" r="11" fill="#356b31" />
          <path d="M-4 8 h28 l-4 20 h-20 z" fill="#e7e6e0" />
        </g>
      ))}

      {/* bollards */}
      {[712, 748].map((x) => (
        <g key={x}>
          <rect x={x} y="452" width="14" height="40" rx="4" fill="#2b2b27" />
          <rect x={x} y="452" width="14" height="8" rx="4" fill="#4a4a44" />
        </g>
      ))}

      {/* location tag */}
      <g transform="translate(24,452)">
        <rect x="0" y="0" width={26 + name.length * 10.5} height="26" rx="13" fill="url(#sf-brand)" />
        <circle cx="16" cy="13" r="4" fill="#ffffff" />
        <text x="28" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" letterSpacing="1" fill="#ffffff">
          {name.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
