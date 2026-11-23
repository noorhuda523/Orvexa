import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Orvexa Workspace Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8F9FC',
            color: '#19182B',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E9E8F1',
              boxShadow: '0 12px 32px rgba(25, 24, 43, 0.08)',
              padding: '32px 28px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              O
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#19182B', margin: '0 0 8px' }}>
              Workspace Session Refreshed
            </h2>
            <p style={{ fontSize: '13px', color: '#74758A', lineHeight: 1.5, margin: '0 0 20px' }}>
              A view state required synchronisation. Click below to continue directly to your active dashboard.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/app';
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                backgroundColor: '#7047EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(112, 71, 235, 0.25)',
              }}
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
