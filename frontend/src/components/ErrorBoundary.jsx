import { Box, Button, Typography } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.assign('/');
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          role="alert"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'error.light',
                color: 'error.contrastText',
              }}
            >
              <AlertTriangle size={28} aria-hidden />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The application hit an unexpected error. You can try again or return to the dashboard.
            </Typography>
            {import.meta.env.DEV && this.state.error?.message && (
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  textAlign: 'left',
                  p: 1.5,
                  mb: 2,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error.message}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={this.handleRetry} startIcon={<RefreshCw size={16} />}>
                Try again
              </Button>
              <Button variant="contained" onClick={this.handleReload}>
                Go to dashboard
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
