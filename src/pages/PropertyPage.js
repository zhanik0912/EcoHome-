import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyPage = () => {
  const { id } = useParams(); 
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/houses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Табылмады");
        return res.json();
      })
      .then(data => setHouse(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, [id]);

  if (error) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Қате: Мәлімет табылмады.</div>;
  if (!house) return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Жүктелуде...</div>;

  return (
    <div style={{ padding: '40px 8%', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Link to="/" style={{ color: '#b01d76', textDecoration: 'none' }}>← Артқа қайту</Link>
      <h1 style={{ marginTop: '20px' }}>{house.location}</h1>
      <img src={house.image} alt="house" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '15px' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div>
          <h3>Сипаттамасы</h3>
          <p>{house.details}</p>
          <p><strong>Рейтинг:</strong> ⭐ {house.rating || 0}</p>
        </div>
        
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '15px', border: '1px solid #444' }}>
          <h4>Байланыс мәліметтері</h4>
          <p><strong>Бағасы:</strong> {house.price} ₸</p>
          <p><strong>Иесі:</strong> {house.owner_name || 'Jade Myersed'}</p>
          <p style={{ fontSize: '20px', color: '#b01d76' }}><strong>Тел:</strong> {house.phone || '+7 (707) 123-45-67'}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;