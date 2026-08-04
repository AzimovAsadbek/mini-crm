import { createTheme, type Theme } from '@mui/material/styles';
import { tokens } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: { bg: string; text: string; activeText: string; activeBg: string };
  }
  interface PaletteOptions {
    sidebar?: { bg: string; text: string; activeText: string; activeBg: string };
  }
}

function buildTheme(): Theme {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: tokens.primary, dark: tokens.primaryDark },
      success: { main: '#22C55E' },
      warning: { main: '#F5B301' },
      error: { main: '#EF4444' },
      info: { main: '#8B5CF6' },
      background: {
        default: '#F3F5F9',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1E293B',
        secondary: '#64748B',
      },
      divider: '#EDF0F5',
      sidebar: tokens.sidebar,
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

  theme.components = {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#CBD5E1', borderRadius: 8 },
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
        root: {
          borderRadius: 12,
          border: cardBorder,
          boxShadow: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
        },
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
          backgroundColor: '#F8FAFC',
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
          borderBottom: '1px solid #F1F5F9',
          whiteSpace: 'nowrap',
          padding: '14px 12px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type td': { borderBottom: 0 },
          '&:hover': { backgroundColor: '#F8FAFC' },
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

export const appTheme = buildTheme();
