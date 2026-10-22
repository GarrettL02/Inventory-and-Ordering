import { PageRouter } from './pageRoutes/PageRouter';
import { AuthProvider } from './auth/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <PageRouter />
    </AuthProvider>
  );
}

export default App;
