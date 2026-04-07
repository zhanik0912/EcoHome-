import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

import Card from './component/Card';
import Hero from './component/Hero'; 
import Profile from './component/Profile';
import Register from './component/Register'; 
import Login from './component/Login'; 
import AdminPanel from './component/AdminPanel'; 
import HouseDetail from './component/HouseDetail';
import './App.css';

function App() {
  const [houses, setHouses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user && (user.email === 'zhanyk070@gmail.com' || user.email === 'zhanyk09@gmail.com');

  const fetchHouses = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/houses')
      .then(res => res.json())
      .then(data => {
        const housesArray = Array.isArray(data) ? data : (data.houses || []);
        setHouses(housesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Загрузка қатесі:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("LocalStorage error:", e);
      }
    }
    fetchHouses(); 
  }, [fetchHouses]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload(); 
  };

  const filteredHouses = houses.filter(house => {
    const title = (house.title || house.name || "").toLowerCase();
    const location = (house.location || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || location.includes(search);
  });

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div id="home">
        <header style={headerStyle}>
          <Link to="/" className="logo" style={logoStyle}>
            <i className="fa-solid fa-house-chimney-window"></i> EcoHome = LoveNature
          </Link>

          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={navLinkStyle}>Басты бет</Link>
            <a href="#houses" style={navLinkStyle}>Тәжірибелер</a>
            {isAdmin && <Link to="/admin" style={{ color: 'gold', fontWeight: 'bold', textDecoration: 'none' }}>Админ Панель</Link>}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user && user.name && <span style={{ fontSize: '14px' }}>Сәлем, {user.name}!</span>}
            <Link to={user ? "/profile" : "/login"} className="user-menu" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-bars"></i>
              {user && user.name ? (
                <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
              ) : (
                <i className="fa-solid fa-circle-user" style={{ fontSize: '30px', color: '#717171' }}></i>
              )}
            </Link>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div className="search-section" style={searchBoxContainerStyle}>
                  <div style={searchBarStyle}>
                    <i className="fa-solid fa-magnifying-glass" style={{ color: '#b01d76', marginRight: '15px' }}></i>
                    <input 
                      type="text" 
                      placeholder="Іздеу..." 
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <section id="houses" style={{ padding: '40px 8%' }}>
                  <h2 className="section-title">Танымал ұсыныстар</h2>
                  {loading ? <p style={{ textAlign: 'center' }}>Жүктелуде...</p> : (
                    <div className="card-container" style={gridStyle}>
                      {filteredHouses.map(house => (
                        <Card key={house.id} {...house} />
                      ))}
                    </div>
                  )}
                </section>
              </>
            } />

            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} user={user} />} />
            <Route path="/house/:id" element={<HouseDetail houses={houses} />} />

            <Route path="/admin" element={isAdmin ? <AdminPanel onUpdate={fetchHouses} houses={houses} /> : <Navigate to="/" />} />
            <Route path="/admin/edit/:id" element={isAdmin ? <AdminPanel onUpdate={fetchHouses} houses={houses} /> : <Navigate to="/" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 8%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 };
const logoStyle = { textDecoration: 'none', color: '#b01d76', fontSize: '24px', fontWeight: 'bold' };
const navLinkStyle = { textDecoration: 'none', color: '#333' };
const avatarStyle = { width: '35px', height: '35px', borderRadius: '50%', background: '#b01d76', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const searchBoxContainerStyle = { position: 'sticky', top: '75px', zIndex: 900, background: '#fff', padding: '20px 8%', borderBottom: '1px solid #eee' };
const searchBarStyle = { display: 'flex', alignItems: 'center', background: '#f5f5f5', padding: '10px 20px', borderRadius: '50px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' };

export default App;