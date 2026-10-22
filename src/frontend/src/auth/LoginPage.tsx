import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export function LoginPage() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (user) {
    return <Navigate to="/parts/unordered" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(from || '/parts/unordered', { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : 'Login failed',
      );
    } finally {
      setPassword('');
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        color: 'white',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        width: '100dvw',
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily:
          "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '400px',
          padding: '40px 30px',
          borderRadius: '12px',
          border: 'none',
          outline: 'none',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '100px',
            gap: 15,
          }}
        >
          <img
            src="FastecServicesLogo.PNG"
            alt="Fastec Services Logo"
            style={{
              height: '40px',
              width: 'auto',
              mixBlendMode: 'multiply' as any,
            }}
          />
          <div
            style={{ color: '#b0b0b0', fontSize: '14px', fontWeight: '500' }}
          >
            Sign in to your Partkeepr account
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: '1rem',
            width: '100%',
            border: 'none',
            outline: 'none',
          }}
        >
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            style={
              {
                border: 'none',
                borderBottom: '2px solid #808080',
                borderRadius: '0px',
                outline: 'none',
                padding: '12px 0px',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: 'white',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              } as React.CSSProperties & { '&:focus'?: any }
            }
            placeholder="Username"
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = 'white';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = '#808080';
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            style={
              {
                border: 'none',
                borderBottom: '2px solid #808080',
                borderRadius: '0px',
                outline: 'none',
                padding: '12px 0px',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: 'white',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              } as React.CSSProperties & { '&:focus'?: any }
            }
            placeholder="Password"
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = 'white';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = '#808080';
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              border: '2px solid white',
              borderRadius: '6px',
              outline: 'none',
              padding: '12px 16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              backgroundColor: 'transparent',
              color: submitting ? '#808080' : 'white',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: submitting ? 0.5 : 1,
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error && (
          <div
            role="alert"
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              color: '#ffc107',
              borderRadius: '6px',
              fontSize: '14px',
              border: '1px solid #ffc107',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
