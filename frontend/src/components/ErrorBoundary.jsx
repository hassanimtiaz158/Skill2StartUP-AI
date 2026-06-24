import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-6">
          <div className="border-2 border-[#0A0A0A] bg-white p-8 max-w-md">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6A6A6A] mb-3">Error</p>
            <h1 className="text-3xl font-black uppercase leading-none mb-4">Something broke.</h1>
            <button type="button" onClick={() => window.location.reload()} className="h-11 px-6 bg-[#0A0A0A] text-[#F5F3EE] border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#0A0A0A] transition-colors">
              Reload
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
