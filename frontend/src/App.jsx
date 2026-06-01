import { CssBaseline, ThemeProvider } from '@mui/material';

import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import { createAppTheme } from './theme/createAppTheme';

const theme = createAppTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
