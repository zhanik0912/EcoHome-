import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import PropertyPage from './pages/PropertyPage';
import AdminPanel from './component/AdminPanel'; 
import Login from './pages/Login';       
import Register from './pages/Register'; 
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add" element={<AdminPanel />} />
        <Route path="/admin/edit/:id" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;