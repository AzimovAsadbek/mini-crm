import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles';
import { tokens } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: { bg: string; text: string; activeText: string; activeBg: string };
  }
  interface PaletteOptions {
    sidebar?: { bg: string; text: string; activeText: string; activeBg: string };
  }
}

export function createAppTheme(mode: PaletteMode): Theme {
  const isLight = mode === 'light';

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary, dark: tokens.primaryDark },
      success: { main: '#22C55E' },
      warning: { main: '#F5B301' },
      error: { main: '#EF4444' },
      info: { main: '#8B5CF6' },
      background: {
        default: isLight ? '#F3F5F9' : '#0B1220',
        paper: isLight ? '#FFFFFF' : '#151E2E',
      },
      text: {
        primary: isLight ? '#1E293B' : '#E2E8F0',
        secondary: isLight ? '#64748B' : '#94A3B8',
      },
      divider: isLight ? '#EDF0F5' : '#243044',
      sidebar: isLight ? tokens.sidebar.light : tokens.sidebar.dark,
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      h1: { fontSize: '1.75rem', fontWeight: 700 },
      h2: { fontSize: '1.5rem', fontWeight: 700 },
      h3: { fontSize: '1.25rem', fontWeight: 600 },
      h4: { fontSize: '1.125rem', fontWeight: 600 },
      h5: { fontSize: '1rem', fontWeight: 600 },
      h6: { fontSize: '0.9375rem', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
  });

  const cardBorder = `1px solid ${theme.palette.divider}`;
  const softShadow = isLight
    ? '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)'
    : '0 1px 3px rgba(0,0,0,0.4)';

  theme.components = {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: isLight ? '#CBD5E1' : '#334155',
          borderRadius: 8,
        },
        body: { backgroundColor: theme.palette.background.default },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 12 },
        elevation0: { border: cardBorder },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 12, border: cardBorder, boxShadow: softShadow },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16, whiteSpace: 'nowrap' },
        sizeSmall: { paddingInline: 12 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: isLight ? '#F8FAFC' : '#1B2537',
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: 0.2,
          borderBottom: cardBorder,
          whiteSpace: 'nowrap',
          padding: '12px',
        },
        body: {
          fontSize: 14,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${isLight ? '#F1F5F9' : '#1F2A3C'}`,
          whiteSpace: 'nowrap',
          padding: '14px 12px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type td': { borderBottom: 0 },
          '&:hover': { backgroundColor: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.02)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: 12, height: 24 },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  };

  return theme;
}
