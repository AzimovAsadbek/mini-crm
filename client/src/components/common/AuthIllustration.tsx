import authIllustration from '@/assets/auth-illustration.png';
import { Box } from '@mui/material';

/**
 * Rasm chetlarini so'ndiradi — to'rtburchak chegarasi ko'rinmasligi uchun.
 * Rasm foni och rangda bo'lgani sababli dark mode'da kuchliroq so'nish kerak.
 */
const EDGE_FADE = {
  light: 'radial-gradient(ellipse at center, #000 74%, transparent 97%)',
  dark: 'radial-gradient(ellipse at center, #000 52%, transparent 92%)',
} as const;

/** Login/Register sahifasining o'ng ustunidagi rasm. */
export function AuthIllustration() {
  return (
    <Box
      component="img"
      src={authIllustration}
      alt="Dashboard oldida turgan foydalanuvchi"
      sx={(theme) => {
        const fade = EDGE_FADE[theme.palette.mode];

        return {
          width: '100%',
          maxWidth: 540,
          height: 'auto',
          display: 'block',
          mx: 'auto',
          maskImage: fade,
          WebkitMaskImage: fade,
          opacity: theme.palette.mode === 'dark' ? 0.85 : 1,
        };
      }}
    />
  );
}
