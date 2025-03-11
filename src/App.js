import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SubmitReport from './components/SubmitReport';
import Search from './components/Search';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const auth = getAuth();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Handle user session on page load
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, [auth]);

  // ✅ Protect Routes that require login
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  // ✅ Redirect users who visit "/" to either Dashboard or Login
  const PublicRoute = () => {
    if (loading) return <div>Loading...</div>;
    return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<PublicRoute />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/submit-report"
          element={
            <ProtectedRoute>
              <SubmitReport />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        
        {/* ✅ Catch-All Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
