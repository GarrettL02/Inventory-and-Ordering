import { PageRouter } from './pageRoutes/PageRouter';
import { AuthProvider } from './auth/hooks/useAuth';
import { ToastProvider } from './components/toast/ToastProvider';
import { ThemeProvider } from './settings/themeStyling/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <PageRouter />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
