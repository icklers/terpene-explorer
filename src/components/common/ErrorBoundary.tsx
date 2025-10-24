/**
 * Error Boundary Component
 *
 * React error boundary that catches JavaScript errors in child components.
 * Displays user-friendly error messages with reload action.
 *
 * @see plan.md - Phase 2 foundational components
 */

import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, AlertTitle, Button, Box, Container } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Optional fallback UI to render when error occurs
   */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches errors in component tree and displays graceful fallback UI.
 * Supports optional custom fallback or default Material UI Alert.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to error tracking service here
    // e.g., Sentry.captureException(error);
  }

  handleReload = (): void => {
    // Clear error state and reload the page
    window.location.reload();
  };

  handleReset = (): void => {
    // Clear error state to attempt re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI with Material UI
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Alert
            severity="error"
            sx={{
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <AlertTitle>Something went wrong</AlertTitle>

            <Box sx={{ mb: 2 }}>
              We're sorry, but something unexpected happened. The application
              encountered an error and couldn't continue.
            </Box>

            {/* Show error message in development mode */}
            {import.meta.env.DEV && error && (
              <Box
                component="details"
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Error Details (Development Mode)
                </summary>
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {error.toString()}
                  {errorInfo && errorInfo.componentStack}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Reload Application
              </Button>

              {import.meta.env.DEV && (
                <Button variant="outlined" onClick={this.handleReset}>
                  Try Again
                </Button>
              )}
            </Box>
          </Alert>
        </Container>
      );
    }

    // No error, render children normally
    return children;
  }
}

export default ErrorBoundary;
