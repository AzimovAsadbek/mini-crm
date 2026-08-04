/** Dizayn maketidan olingan ranglar — barcha komponentlar shu qiymatlarga tayanadi. */
export const tokens = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',

  sidebar: {
    light: { bg: '#1B2537', text: '#94A3B8', activeText: '#FFFFFF', activeBg: 'rgba(59,130,246,0.16)' },
    dark: { bg: '#111827', text: '#94A3B8', activeText: '#FFFFFF', activeBg: 'rgba(59,130,246,0.22)' },
  },

  stat: {
    customers: '#3B82F6',
    projects: '#22C55E',
    tasks: '#F5B301',
    completed: '#8B5CF6',
    inProgress: '#EF4444',
  },

  chart: {
    completed: '#3B82F6',
    inProgress: '#F5B301',
    pending: '#C7D2E5',
    cancelled: '#EF4444',
    line: '#3B82F6',
  },

  status: {
    success: { light: { bg: '#DCFCE7', fg: '#16A34A' }, dark: { bg: 'rgba(34,197,94,0.18)', fg: '#4ADE80' } },
    warning: { light: { bg: '#FEF3C7', fg: '#D97706' }, dark: { bg: 'rgba(245,179,1,0.18)', fg: '#FBBF24' } },
    neutral: { light: { bg: '#E2E8F0', fg: '#64748B' }, dark: { bg: 'rgba(148,163,184,0.18)', fg: '#CBD5E1' } },
    danger: { light: { bg: '#FEE2E2', fg: '#DC2626' }, dark: { bg: 'rgba(239,68,68,0.18)', fg: '#F87171' } },
  },

  action: {
    view: '#94A3B8',
    edit: '#3B82F6',
    delete: '#EF4444',
  },
} as const;

export const SIDEBAR_WIDTH = 260;
export const TOPBAR_HEIGHT = 64;
