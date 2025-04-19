import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('/api/auth/verify');
          setIsAuthenticated(true);
          setUser(res.data.user);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : 
            <AuthPage setIsAuthenticated={ setIsAuthenticated } />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;