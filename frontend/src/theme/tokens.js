/** Design tokens — single source of truth for the SaaS design system */

export const colors = {
  brand: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const gradients = {
  brand: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
  brandSubtle: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
  surface: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 100%)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
  md: '0 4px 12px rgba(15, 23, 42, 0.08)',
  lg: '0 12px 40px rgba(15, 23, 42, 0.12)',
  glow: '0 0 0 1px rgba(99, 102, 241, 0.08), 0 8px 24px rgba(99, 102, 241, 0.15)',
};

export const typography = {
  fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
  h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
  h2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em' },
  h3: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6 },
  caption: { fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.5 },
  label: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.04em', textTransform: 'uppercase' },
};

export const layout = {
  sidebarExpanded: 221,
  sidebarCollapsed: 64,
  topbarHeight: 56,
};

/** Recharts / analytics palette */
export const chartColors = {
  healthy: '#10b981',
  medium: '#f59e0b',
  low: '#ef4444',
  brand: '#6366f1',
  brandAlt: '#8b5cf6',
  slate: '#94a3b8',
  series: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
};

export const stockThresholds = {
  low: 10,
  medium: 25,
};
