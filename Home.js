import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import Card from '../component/Card'; 
import Hero from '../component/Hero'; 

function Home() {
  const [houses, setHouses] = useState([]); 
  const [filteredHouses, setFilteredHouses] = useState([]); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    fetch('http://localhost:5000/api/houses')
      .then(res => res.json())
      .then(data => { setHouses(data); setFilteredHouses(data); });
  }, []);

  const isAdmin = user?.email?.toLowerCase() === 'zhanyk070@gmail.com' || user?.email?.toLowerCase() === 'zhanyk09@gmail.com';

  return (
    <>
      <ToastContainer />
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 8%', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <Link to="/" style={{ color: '#b01d76', fontWeight: 'bold', textDecoration: 'none', fontSize: '22px' }}>EcoHome</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAdmin && <Link to="/admin" style={{ color: 'gold', fontWeight: 'bold' }}>Админ</Link>}
          <Link to={user ? "/profile" : "/login"} style={{ textDecoration: 'none', color: '#333', border: '1px solid #ddd', padding: '5px 15px', borderRadius: '20px' }}>
            {user ? user.name : "Кіру"}
          </Link>
        </nav>
      </header>
      <Hero />
      <main style={{ padding: '40px 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredHouses.map(house => (
            <Card key={house.id} {...house} />
          ))}
        </div>
    </main>
    </>
  );
}
export default Home;