import { Box } from '@mui/material';

/**
 * Login/Register sahifasidagi illyustratsiya — dashboard oldida turgan
 * foydalanuvchi. Tashqi rasm fayli talab qilmaydi, hamma narsa SVG ichida.
 */
export function AuthIllustration() {
  return (
    <Box
      component="svg"
      viewBox="0 0 380 300"
      role="img"
      aria-label="Dashboard oldida turgan foydalanuvchi"
      sx={{ width: '100%', maxWidth: 480, height: 'auto', display: 'block' }}
    >
      {/* yumshoq fon dog'i */}
      <path
        d="M190 14c68 0 130 22 154 68 24 46 10 110-36 142-46 32-120 42-182 28C64 238 18 204 14 154 10 104 44 54 92 32c31-13 63-18 98-18Z"
        fill="#E8F0FB"
      />

      {/* dekorativ nuqtalar */}
      <circle cx="44" cy="92" r="13" fill="none" stroke="#D2E0F5" strokeWidth="2" />
      <circle cx="44" cy="92" r="3.5" fill="#D2E0F5" />
      <circle cx="338" cy="66" r="6" fill="#D2E0F5" />
      <circle cx="324" cy="42" r="3.5" fill="#D2E0F5" />
      <circle cx="96" cy="252" r="4" fill="#D2E0F5" />

      {/* o'simlik */}
      <g transform="translate(86 230)">
        <path d="M0 0C-16-24-15-50 0-66c15 16 16 42 0 66Z" fill="#27437A" transform="rotate(-46)" />
        <path d="M0 0C-17-28-15-56 0-76c15 20 17 48 0 76Z" fill="#33569A" transform="rotate(-26)" />
        <path d="M0 0C-18-30-16-62 0-82c18 20 18 52 0 82Z" fill="#2A4A88" transform="rotate(-6)" />
        <path d="M0 0C-17-28-15-56 0-76c15 20 17 48 0 76Z" fill="#33569A" transform="rotate(14)" />
        <path d="M0 0C-16-24-15-50 0-66c15 16 16 42 0 66Z" fill="#27437A" transform="rotate(30)" />
      </g>
      <rect x="62" y="226" width="48" height="13" rx="4" fill="#35548F" />
      <path d="M67 239h38l-5 33H72Z" fill="#2A4477" />

      {/* monitor soyasi */}
      <ellipse cx="200" cy="222" rx="62" ry="6" fill="#C9D9F1" opacity=".7" />

      {/* monitor */}
      <rect x="108" y="46" width="184" height="142" rx="9" fill="#4B70C4" />
      <rect x="116" y="54" width="168" height="118" rx="4" fill="#FFFFFF" />
      <rect x="192" y="188" width="16" height="20" fill="#C3D2EA" />
      <rect x="164" y="206" width="72" height="9" rx="4.5" fill="#B3C5E3" />

      {/* ekran: sarlavha paneli */}
      <path d="M116 58a4 4 0 0 1 4-4h160a4 4 0 0 1 4 4v10H116Z" fill="#EDF2FA" />
      <circle cx="262" cy="63" r="2.6" fill="#C7D6EF" />
      <circle cx="271" cy="63" r="2.6" fill="#C7D6EF" />
      <circle cx="280" cy="63" r="2.6" fill="#C7D6EF" />

      {/* ekran: chap menyu */}
      <rect x="116" y="68" width="40" height="104" fill="#F5F8FD" />
      {[76, 92, 108, 124, 140].map((y) => (
        <g key={y}>
          <rect x="123" y={y} width="8" height="8" rx="2" fill="#89AAE2" />
          <rect x="135" y={y + 2} width="15" height="4" rx="2" fill="#D5E1F5" />
        </g>
      ))}

      {/* ekran: kontent kartalari */}
      <rect x="166" y="78" width="56" height="6" rx="3" fill="#B9CEEE" />
      <rect x="166" y="92" width="106" height="17" rx="3" fill="#F1F5FC" />
      <rect x="172" y="98" width="64" height="5" rx="2.5" fill="#CFDEF5" />
      <rect x="166" y="114" width="106" height="17" rx="3" fill="#F1F5FC" />
      <rect x="172" y="120" width="48" height="5" rx="2.5" fill="#CFDEF5" />

      {/* ekran: diagramma */}
      <rect x="170" y="152" width="9" height="12" rx="2" fill="#A8C2E9" />
      <rect x="185" y="146" width="9" height="18" rx="2" fill="#8FAFE2" />
      <rect x="200" y="152" width="9" height="12" rx="2" fill="#A8C2E9" />
      <rect x="215" y="140" width="9" height="24" rx="2" fill="#6B94D8" />
      <rect x="230" y="147" width="9" height="17" rx="2" fill="#8FAFE2" />
      <rect x="245" y="134" width="9" height="30" rx="2" fill="#4B70C4" />
      <polyline
        points="172,158 189,150 204,153 219,141 234,144 249,130"
        fill="none"
        stroke="#25396B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* monitor tepasidagi belgi */}
      <circle cx="140" cy="46" r="15" fill="#4B70C4" />
      <path
        d="M133 48a4.5 4.5 0 0 1 .6-9 6 6 0 0 1 11.2 1.6 3.9 3.9 0 0 1-.6 7.4Z"
        fill="#FFFFFF"
      />

      {/* odam soyasi */}
      <ellipse cx="322" cy="252" rx="34" ry="5.5" fill="#C9D9F1" opacity=".7" />

      {/* odam */}
      <path d="M301 172h42l-2 58h-14l-5-32-5 32h-14Z" fill="#25355E" />
      <rect x="295" y="228" width="23" height="9" rx="4.5" fill="#1A2743" />
      <rect x="325" y="228" width="23" height="9" rx="4.5" fill="#1A2743" />

      <path d="M300 134c0-11 9-19 22-19s22 8 22 19v44h-44Z" fill="#3D6FD3" />
      <path d="M305 137 275 150" stroke="#3D6FD3" strokeWidth="11" strokeLinecap="round" />
      <circle cx="271" cy="151" r="6.5" fill="#F0BE9B" />

      <rect x="316" y="105" width="12" height="13" rx="5" fill="#E2AC88" />
      <circle cx="322" cy="97" r="16" fill="#F0BE9B" />
      <path d="M305.5 93a17 17 0 0 1 33 0Z" fill="#20304F" />
      <path d="M334 87c6 5 7 16 2 23-1-9-3-16-6-20Z" fill="#20304F" />
    </Box>
  );
}
