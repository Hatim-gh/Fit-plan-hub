import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrainerDashboard from './pages/TrainerDashboard';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import TrainerProfile from './pages/TrainerProfile';
import FollowingList from './pages/FollowingList';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/trainer/dashboard" 
              element={
                <ProtectedRoute role="TRAINER">
                  <TrainerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/plans/:id" element={<PlanDetails />} />
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <UserFeed />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/following" 
              element={
                <ProtectedRoute>
                  <FollowingList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/trainer/:trainerId" 
              element={
                <ProtectedRoute>
                  <TrainerProfile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

