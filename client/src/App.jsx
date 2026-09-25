import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import CreateConfessionPage from './pages/CreateConfessionPage';
import MyConfessionsPage from './pages/MyConfessionsPage';
import ConfessionDetailPage from './pages/ConfessionDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confessions" element={<FeedPage />} />
          <Route path="/confessions/:id" element={<ConfessionDetailPage />} />
          
          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/confessions/create" element={<CreateConfessionPage />} />
            <Route path="/confessions/my" element={<MyConfessionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin & Moderator Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'moderator']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
