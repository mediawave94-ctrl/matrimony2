import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Card from './components/ui/Card';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import UserProfile from './pages/UserProfile';

import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans text-gray-900">
    <Header />
    <main className="flex-grow bg-gray-50">
      {children}
    </main>
    <Footer />
    <Toaster position="bottom-center" />
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
