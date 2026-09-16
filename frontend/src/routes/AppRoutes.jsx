import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import LearningPath from '../pages/LearningPath';
import Quiz from '../pages/Quiz';
import Exam from '../pages/Exam';
import Certificates from '../pages/Certificates';
import VerifyCertificate from '../pages/VerifyCertificate';
import Profile from '../pages/Profile';
import Help from '../pages/Help';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Terms from '../pages/Terms';
import Admin from '../pages/Admin';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Guard components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f7fa', color: '#333' }}>
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f7fa', color: '#333' }}>
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const LearnerRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f7fa', color: '#333' }}>
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Home />} />
      <Route path="/login" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Login />} />
      <Route path="/register" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/help" element={<Help />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/certificates/verify/:certificateNumber" element={<VerifyCertificate />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <LearnerRoute>
            <Dashboard />
          </LearnerRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <LearnerRoute>
            <Courses />
          </LearnerRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <LearnerRoute>
            <CourseDetails />
          </LearnerRoute>
        }
      />
      <Route
        path="/learning-path/:id"
        element={
          <LearnerRoute>
            <LearningPath />
          </LearnerRoute>
        }
      />
      <Route
        path="/quiz/:id"
        element={
          <LearnerRoute>
            <Quiz />
          </LearnerRoute>
        }
      />
      <Route
        path="/exam/:id"
        element={
          <LearnerRoute>
            <Exam />
          </LearnerRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <LearnerRoute>
            <Certificates />
          </LearnerRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
