import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    if (!user) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>Сіз жүйеге кірмегенсіз. <button onClick={() => navigate('/login')}>Кіру</button></div>;
    }

    return (
        <div style={{ padding: '80px 8%', textAlign: 'center', background: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'inline-block', minWidth: '300px' }}>
                <div style={{ width: '80px', height: '80px', background: '#b01d76', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px' }}>
                    {user.name?.charAt(0)}
                </div>
                <h2>{user.name}</h2>
                <p style={{ color: '#777' }}>{user.email}</p>
                <hr style={{ margin: '20px 0', opacity: 0.2 }} />
                <button onClick={handleLogout} style={{ background: '#b01d76', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Шығу</button>
            </div>
        </div>
    );
};

export default Profile;