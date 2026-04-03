import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ id, location, price, details, image_url, image, rating }) => {
  // Если из базы приходит image_url — берем его, если просто image — берем его
  const displayImage = image_url || image;

  return (
    <Link to={`/house/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        <img 
          src={displayImage} 
          alt={location} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} 
        />
        <div className="card-content">
          <div className="card-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{location}</h3>
            <span>
              <i className="fa-solid fa-star" style={{ color: '#ffc107', marginRight: '5px' }}></i> 
              {rating || 0}
            </span>
          </div>
          <p className="card-sub" style={{ fontSize: '14px', color: '#717171', margin: '5px 0' }}>
            {details}
          </p>
          <p className="price" style={{ margin: '5px 0', fontSize: '16px', color: '#b01d76' }}>
            <strong>{price} ₸</strong> 
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;