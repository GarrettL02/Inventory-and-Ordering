import { PageRouter } from './pageRoutes/PageRouter';
import { AuthProvider } from './auth/hooks/useAuth';
import { ToastProvider } from './components/toast/ToastProvider';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PageRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
