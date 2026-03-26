import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Pages & Components (to be created)
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import LogHabit from './pages/LogHabit';
import Analytics from './pages/Analytics';
import DigitalTwin from './pages/DigitalTwin';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="log-habit" element={<LogHabit />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="twin" element={<DigitalTwin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
