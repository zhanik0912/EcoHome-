import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user || data));
                window.dispatchEvent(new Event('storage'));
                toast.success("Қош келдіңіз!");
                navigate('/');
            } else {
                toast.error(data.error || data.message || "Email немесе құпия сөз қате");
            }
        } catch (error) {
            toast.error("Сервермен байланыс жоқ!");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh', background: '#f8f9fa' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 style={{ color: '#b01d76', marginBottom: '25px', fontSize: '24px' }}>Кіру</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="email" placeholder="Email" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Құпия сөз" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button type="submit" style={{ padding: '12px', background: '#b01d76', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Кіру</button>
                </form>
                <p style={{ marginTop: '20px', fontSize: '14px' }}>Аккаунтыңыз жоқ па? <Link to="/register" style={{ color: '#b01d76', textDecoration: 'none', fontWeight: 'bold' }}>Тіркелу</Link></p>
            </div>
        </div>
    );
};

export default Login;