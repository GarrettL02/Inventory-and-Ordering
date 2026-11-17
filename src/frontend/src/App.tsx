import { PageRouter } from './pageRoutes/PageRouter';
import { AuthProvider } from './data/hooks/auth/useAuth';
import { ToastProvider } from './components/toast/ToastProvider';
import { SettingsProvider } from './data/hooks/userSettings/useSettings';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <PageRouter />
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
