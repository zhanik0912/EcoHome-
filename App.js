import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
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
  const [filteredHouses, setFilteredHouses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const resultsSectionRef = useRef(null);

  const isAdmin = user && user.email === 'zhanyk070@gmail.com';

  // --- ФУНКЦИЯ ОБНОВЛЕНИЯ (БЕЗ ПЕРЕЗАГРУЗКИ) ---
  const fetchHouses = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/houses')
      .then(res => res.json())
      .then(data => {
        setHouses(data);
        setFilteredHouses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Загрузка қатесі:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const getSafeUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser || savedUser === "undefined") return null;
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem('user');
        return null;
      }
    };
    setUser(getSafeUser());
    fetchHouses(); // Загружаем данные при старте

    const handleStorageChange = () => setUser(getSafeUser());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUser(null); 
    window.location.reload(); 
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredHouses(houses);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = houses.filter(house => 
        house.location.toLowerCase().includes(lowerTerm) || 
        house.details.toLowerCase().includes(lowerTerm)
      );
      setFilteredHouses(filtered);
    }
  };

  const logoutButtonStyle = { background: 'none', border: '1px solid #b01d76', color: '#b01d76', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', marginLeft: '10px' };
  const editBtnStyle = { position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', border: '1px solid #b01d76', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', zIndex: 10 };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div id="home">
        <header>
          <Link to="/" className="logo">
            <i className="fa-solid fa-house-chimney-window"></i> EcoHome = LoveNature
          </Link>
          <nav>
            <Link to="/">Басты бет</Link>
            <a href="#houses">Тәжірибелер</a>
            {isAdmin && <Link to="/admin" style={{ color: 'gold', fontWeight: 'bold' }}>Админ Панель</Link>}
            {user && (
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#555' }}>Сәлем, {user.name}!</span>
                <button onClick={handleLogout} style={logoutButtonStyle}>Шығу</button>
              </div>
            )}
          </nav>

          {/* ВОТ ТВОЯ ИКОНКА ПРОФИЛЯ (ВЕРНУЛ) */}
          <Link to={user ? "/profile" : "/login"} className="user-menu" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-bars"></i>
            {user ? (
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#b01d76', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <i className="fa-solid fa-circle-user" style={{ fontSize: '30px', color: '#717171' }}></i>
            )}
          </Link>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div style={{ position: 'sticky', top: '70px', zIndex: 1000, background: 'white', padding: '20px 8%', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                    <input type="text" placeholder="Қаланы немесе сипаттаманы енгізіңіз..." onChange={(e) => handleSearch(e.target.value)} style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', outline: 'none' }} />
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '25px', top: '50%', transform: 'translateY(-50%)', color: '#b01d76' }}></i>
                  </div>
                </div>

                <section id="houses" ref={resultsSectionRef} style={{ padding: '40px 8%' }}>
                  <h2 className="section-title">Танымал ұсыныстар</h2>
                  {loading ? <p style={{ textAlign: 'center' }}>Жүктелуде...</p> : (
                    <div className="card-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                      {filteredHouses.map(house => (
                        <div key={house.id} style={{ position: 'relative' }}>
                          <Card {...house} />
                          {isAdmin && (
                            <Link to={`/admin/edit/${house.id}`} style={editBtnStyle}>✎ Өңдеу</Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            } />

            <Route path="/house/:id" element={<HouseDetail houses={houses} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Передаем fetchHouses, чтобы админка могла обновлять список */}
            <Route path="/admin" element={isAdmin ? <AdminPanel onUpdate={fetchHouses} /> : <Navigate to="/" />} />
            <Route path="/admin/edit/:id" element={isAdmin ? <AdminPanel onUpdate={fetchHouses} /> : <Navigate to="/" />} />
          </Routes>
        </main>

        <footer style={{ padding: '40px 8%', background: '#f7f7f7', marginTop: '50px', textAlign: 'center' }}>
          <p>© 2026 EcoHome Rental Portal. Барлық құқықтар қорғалған.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;