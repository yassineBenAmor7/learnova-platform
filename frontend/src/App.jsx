import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';
import './components/Toast.css';
import './components/ConfirmModal.css';

function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password';

  return (
    <div className="app-layout">
      <Navbar />
      <AppRoutes />
      {!isAuthPage && <Footer />}
      {!isAuthPage && pathname !== '/chatbot' && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AppLayout />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
