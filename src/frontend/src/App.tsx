import { PageRouter } from './pageRoutes/PageRouter';
import { AuthProvider } from './hooks/auth/useAuth';
import { ToastProvider } from './components/toast/ToastProvider';
import { ThemeProvider } from './hooks/userSettings/useTheme';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <PageRouter />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
