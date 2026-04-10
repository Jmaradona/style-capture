import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(p) {
    super(p);
    this.state = { err: null };
  }

  static getDerivedStateFromError(err) {
    return { err };
  }

  render() {
    if (this.state.err) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center',
        }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>
            Something went wrong
          </p>
          <p style={{ fontSize: 14, color: 'var(--mfg)', marginBottom: 20 }}>
            {this.state.err.message}
          </p>
          <button
            onClick={() => this.setState({ err: null })}
            style={{
              padding: '10px 24px', borderRadius: 100, fontSize: 14,
              fontWeight: 600, background: 'var(--primary)', color: 'white',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
