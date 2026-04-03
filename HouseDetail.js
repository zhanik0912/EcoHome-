import React from 'react';
import { useParams, Link } from 'react-router-dom';

const HouseDetail = ({ houses }) => {
  const { id } = useParams();
  const house = houses.find(h => h.id === parseInt(id));

  if (!house) return <div style={{ padding: '100px', textAlign: 'center' }}>Үй табылмады...</div>;

  // Превращаем строку ссылок из базы обратно в массив
  const galleryImages = house.gallery ? house.gallery.split(',') : [];

  return (
    <div style={{ padding: '40px 8%', marginTop: '80px' }}>
      <Link to="/" style={{ color: '#b01d76', textDecoration: 'none', fontWeight: 'bold' }}>← Артқа қайту</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginTop: '20px' }}>
        
        {/* ЛЕВАЯ ЧАСТЬ: МЕДИА */}
        <div>
          {/* Главное фото */}
          <img src={house.image_url || house.image} alt="Main" style={{ width: '100%', borderRadius: '15px', marginBottom: '15px' }} />
          
          {/* Галлерея доп. фото */}
          {galleryImages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {galleryImages.map((img, index) => (
                <img key={index} src={img.trim()} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} alt="Gallery" />
              ))}
            </div>
          )}

          {/* Видео */}
          {house.video_url && (
            <div style={{ marginTop: '20px' }}>
              <h3>Видео шолу:</h3>
              <iframe 
                width="100%" 
                height="350" 
                src={house.video_url.replace("watch?v=", "embed/")} 
                title="House Video" 
                frameBorder="0" 
                allowFullScreen
                style={{ borderRadius: '15px', marginTop: '10px' }}
              ></iframe>
            </div>
          )}
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ИНФО */}
        <div>
          <h1 style={{ fontSize: '32px' }}>{house.location}</h1>
          <p style={{ color: '#b01d76', fontSize: '24px', fontWeight: 'bold' }}>{house.price} ₸</p>
          
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
            <p><strong>🏢 Компания:</strong> {house.company_name || 'EcoHome Partner'}</p>
            <p><strong>📝 Сипаттама:</strong> {house.details}</p>
            <hr />
            <p style={{ fontSize: '14px', color: '#666' }}>Барлық сұрақтар бойынша менеджерге хабарласыңыз.</p>
          </div>

          <button style={{ width: '100%', padding: '15px', background: '#b01d76', color: 'white', border: 'none', borderRadius: '10px', marginTop: '20px', cursor: 'pointer' }}>
            Брондау
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseDetail;