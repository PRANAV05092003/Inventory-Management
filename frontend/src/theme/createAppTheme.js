import { alpha, createTheme } from '@mui/material/styles';

import { colors, radius, shadows, typography } from './tokens';

export function createAppTheme() {
  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: colors.brand[600],
        light: colors.brand[400],
        dark: colors.brand[800],
        contrastText: '#fff',
      },
      secondary: {
        main: colors.slate[600],
      },
      success: { main: colors.success },
      warning: { main: colors.warning },
      error: { main: colors.error },
      info: { main: colors.info },
      background: {
        default: colors.slate[50],
        paper: '#ffffff',
      },
      text: {
        primary: colors.slate[900],
        secondary: colors.slate[500],
      },
      divider: alpha(colors.slate[900], 0.08),
    },
    typography: {
      fontFamily: typography.fontFamily,
      h4: typography.h2,
      h5: typography.h3,
      h6: typography.h3,
      body1: typography.body,
      body2: typography.caption,
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: radius.md },
    shadows: [
      'none',
      shadows.sm,
      shadows.md,
      shadows.md,
      shadows.lg,
      ...Array(20).fill(shadows.lg),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.slate[50],
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(colors.brand[500], 0.12)}, transparent)`,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            padding: '10px 18px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${colors.brand[600]} 0%, ${colors.brand[500]} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.brand[700]} 0%, ${colors.brand[600]} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: shadows.glow,
            },
          },
          outlined: {
            borderColor: alpha(colors.slate[900], 0.12),
            '&:hover': {
              borderColor: colors.brand[400],
              backgroundColor: alpha(colors.brand[500], 0.04),
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 10,
            border: `1px solid ${alpha(colors.slate[900], 0.06)}`,
            boxShadow: shadows.sm,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: `1px solid ${alpha(colors.slate[900], 0.06)}`,
            boxShadow: shadows.sm,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.xl,
            boxShadow: shadows.lg,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            color: colors.slate[600],
            backgroundColor: colors.slate[50],
            borderBottom: `1px solid ${alpha(colors.slate[900], 0.08)}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: radius.md,
              transition: 'box-shadow 0.2s',
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(colors.brand[500], 0.2)}`,
              },
            },
          },
        },
      },
    },
  });
}
