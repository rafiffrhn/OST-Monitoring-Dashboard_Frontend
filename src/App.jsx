import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DashboardMonitor from './pages/Dashboardmonitor';
import History from './pages/History';
import DatasetManagement from './pages/DatasetManagement';
import TankManagement from './pages/TankManagement';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SidebarProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/monitor/:tankId"
              element={
                <ProtectedRoute>
                  <DashboardMonitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataset"
              element={
                <ProtectedRoute>
                  <DatasetManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tanks"
              element={
                <ProtectedRoute>
                  <TankManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </SidebarProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;