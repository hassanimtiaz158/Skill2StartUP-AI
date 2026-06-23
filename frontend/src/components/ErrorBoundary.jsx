import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount >= 2) return; // prevent infinite loops
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4" role="alert" aria-live="assertive">
          <div className="max-w-md text-center p-8">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-ink mb-2">
              Something went wrong
            </h2>
            <p className="text-ink-muted text-sm mb-6">
              {this.state.retryCount >= 2
                ? 'The problem persists. Please return home and try again later.'
                : 'An unexpected error occurred. Please try again or return home.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {this.state.retryCount < 2 && (
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 h-11 px-6 border border-border bg-white text-sm font-medium text-ink-muted hover:text-ink hover:border-border-strong transition-all duration-150 cursor-pointer rounded-[var(--r-md)]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              )}
              <Link
                to="/"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-[var(--r-md)] bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-150"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
