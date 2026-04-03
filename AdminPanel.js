import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2'; 

const AdminPanel = ({ onUpdate }) => { // Принимаем пропс здесь
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [houseData, setHouseData] = useState({
        location: '', rating: '5.0', price: '', details: '', image: '', 
        owner_name: '', phone: '', address: '', gallery: '', video_url: '', company_name: ''
    });

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/api/houses/${id}`)
                .then(res => res.json())
                .then(data => {
                    const actualData = Array.isArray(data) ? data[0] : data;
                    if (actualData) setHouseData(actualData);
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:5000/api/houses/${id}` : 'http://localhost:5000/api/houses';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(houseData)
            });
            
            if (response.ok) {
                if (onUpdate) onUpdate(); // ОБНОВЛЯЕМ ДАННЫЕ В APP.JS
                toast.success(id ? "Жарнама жаңартылды!" : "Үй сәтті қосылды!");
                navigate('/'); 
            }
        } catch (error) {
            toast.error("Қате кетті");
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: 'Сенімдісіз бе?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Иә, өшіру!',
            cancelButtonText: 'Бас тарту'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`http://localhost:5000/api/houses/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    if (onUpdate) onUpdate(); // ОБНОВЛЯЕМ ДАННЫЕ В APP.JS
                    toast.info("Жарнама өшірілді");
                    navigate('/');
                }
            }
        });
    };

    const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' };
    const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#555', marginBottom: '5px', display: 'block' };

    return (
        <div style={{ padding: '120px 8%', maxWidth: '700px', margin: '0 auto' }}>
            <h2>{id ? 'Жарнаманы өңдеу' : 'Жаңа үй қосу'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={labelStyle}>Атауы</label>
                    <input required style={inputStyle} value={houseData.location} onChange={e => setHouseData({...houseData, location: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input placeholder="Бағасы" style={inputStyle} value={houseData.price} onChange={e => setHouseData({...houseData, price: e.target.value})} />
                    <input placeholder="Сурет URL" style={inputStyle} value={houseData.image} onChange={e => setHouseData({...houseData, image: e.target.value})} />
                </div>
                <input placeholder="Компания" style={inputStyle} value={houseData.company_name} onChange={e => setHouseData({...houseData, company_name: e.target.value})} />
                <input placeholder="Галерея (URL, URL)" style={inputStyle} value={houseData.gallery} onChange={e => setHouseData({...houseData, gallery: e.target.value})} />
                <input placeholder="Видео URL" style={inputStyle} value={houseData.video_url} onChange={e => setHouseData({...houseData, video_url: e.target.value})} />
                <textarea placeholder="Сипаттама" rows="4" style={inputStyle} value={houseData.details} onChange={e => setHouseData({...houseData, details: e.target.value})} />
                
                <button type="submit" style={{ padding: '15px', background: '#b01d76', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Сақтау
                </button>
                {id && <button type="button" onClick={handleDelete} style={{ padding: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '8px', marginTop: '10px' }}>Өшіру</button>}
            </form>
        </div>
    );
};

export default AdminPanel;