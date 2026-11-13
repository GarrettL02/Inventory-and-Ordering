import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';
import { useTheme } from '../hooks/userSettings/useTheme';

export function LoginPage() {
  const themeType = useTheme();
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
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(from || '/home', { replace: true });
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
        color: themeType.textPrimaryColor,
        background: themeType.loginBackground,
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
          background: themeType.loginCardBackground,
          color: themeType.textPrimaryColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '400px',
          padding: '40px 30px',
          borderRadius: '12px',
          outline: 'none',
          boxShadow: `0 10px 40px ${themeType.shadowColor}`,
          border: `1px solid ${themeType.borderColor}`,
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
            style={{
              color: themeType.textMutedColor,
              fontSize: '14px',
              fontWeight: '500',
            }}
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
                borderBottom: `2px solid ${themeType.inputBorderColor}`,
                borderRadius: '0px',
                outline: 'none',
                padding: '12px 0px',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: themeType.textPrimaryColor,
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              } as React.CSSProperties & { '&:focus'?: any }
            }
            placeholder="Username"
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = themeType.accentColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor =
                themeType.inputBorderColor;
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
                borderBottom: `2px solid ${themeType.inputBorderColor}`,
                borderRadius: '0px',
                outline: 'none',
                padding: '12px 0px',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: themeType.textPrimaryColor,
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              } as React.CSSProperties & { '&:focus'?: any }
            }
            placeholder="Password"
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = themeType.accentColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor =
                themeType.inputBorderColor;
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              border: `2px solid ${themeType.buttonBorderColor}`,
              borderRadius: '6px',
              outline: 'none',
              padding: '12px 16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              backgroundColor: 'transparent',
              color: submitting
                ? themeType.textMutedColor
                : themeType.textPrimaryColor,
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: submitting ? 0.5 : 1,
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor =
                  themeType.hoverOverlayColor;
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
              backgroundColor: themeType.warningBackgroundColor,
              color: themeType.warningTextColor,
              borderRadius: '6px',
              fontSize: '14px',
              border: `1px solid ${themeType.warningTextColor}`,
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
