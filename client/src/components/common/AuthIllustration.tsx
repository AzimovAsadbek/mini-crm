import { Box } from '@mui/material';

/** Login/Register sahifasidagi o'ng ustun rasmi — tashqi fayl talab qilmaydi. */
export function AuthIllustration() {
  return (
    <Box
      component="svg"
      viewBox="0 0 420 320"
      sx={{ width: '100%', maxWidth: 460, height: 'auto', display: 'block' }}
    >
      <ellipse cx="210" cy="292" rx="150" ry="14" fill="#3B82F6" opacity="0.10" />

      {/* monitor */}
      <rect x="168" y="76" width="196" height="132" rx="10" fill="#fff" stroke="#CBD5E1" strokeWidth="3" />
      <rect x="182" y="90" width="168" height="104" rx="6" fill="#EFF6FF" />
      <rect x="194" y="104" width="60" height="9" rx="4.5" fill="#3B82F6" />
      <rect x="194" y="122" width="144" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="194" y="136" width="120" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="194" y="156" width="40" height="26" rx="5" fill="#22C55E" opacity="0.85" />
      <rect x="242" y="156" width="40" height="26" rx="5" fill="#F5B301" opacity="0.85" />
      <rect x="290" y="156" width="48" height="26" rx="5" fill="#8B5CF6" opacity="0.85" />
      <rect x="248" y="208" width="36" height="22" fill="#CBD5E1" />
      <rect x="216" y="228" width="100" height="10" rx="5" fill="#94A3B8" />

      {/* person */}
      <path d="M74 288V228c0-26 18-44 42-44s42 18 42 44v60z" fill="#3B82F6" />
      <rect x="104" y="196" width="24" height="22" rx="8" fill="#F5C9A6" />
      <circle cx="116" cy="176" r="26" fill="#F5C9A6" />
      <path d="M90 172c0-16 12-26 26-26s26 10 26 26c-8-6-16-9-26-9s-18 3-26 9z" fill="#1E293B" />
      <rect x="146" y="224" width="52" height="15" rx="7.5" fill="#F5C9A6" transform="rotate(18 146 224)" />
      <rect x="62" y="240" width="34" height="48" rx="10" fill="#2563EB" />

      {/* plant */}
      <path d="M352 288v-34" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
      <path d="M352 262c-16-4-24-16-22-30 14 0 24 12 22 30z" fill="#22C55E" />
      <path d="M352 250c12-6 17-18 14-30-12 2-19 14-14 30z" fill="#16A34A" />
      <path d="M336 288h32l-4 24h-24z" fill="#F5B301" />
    </Box>
  );
}
