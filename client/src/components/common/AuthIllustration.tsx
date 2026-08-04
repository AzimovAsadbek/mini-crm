import authIllustration from '@/assets/auth-illustration.png';
import { Box } from '@mui/material';

/** Rasm chetlarini so'ndiradi — to'rtburchak chegarasi ko'rinmasligi uchun. */
const EDGE_FADE = 'radial-gradient(ellipse at center, #000 74%, transparent 97%)';

/** Login/Register sahifasining o'ng ustunidagi rasm. */
export function AuthIllustration() {
  return (
    <Box
      component="img"
      src={authIllustration}
      alt="Dashboard oldida turgan foydalanuvchi"
      sx={{
        width: '100%',
        maxWidth: 540,
        height: 'auto',
        display: 'block',
        mx: 'auto',
        maskImage: EDGE_FADE,
        WebkitMaskImage: EDGE_FADE,
      }}
    />
  );
}
