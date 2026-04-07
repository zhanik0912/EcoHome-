import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AdminPanel = ({ onUpdate, houses }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [houseData, setHouseData] = useState({
        title: '',
        location: '',
        price: '',
        details: '',
        image: ''
    });

    // 1. Өңдеу режимі: Ескі деректерді формаға толтыру
    useEffect(() => {
        if (id && houses && houses.length > 0) {
            const houseToEdit = houses.find(h => h.id.toString() === id.toString());
            if (houseToEdit) {
                setHouseData({
                    title: houseToEdit.title || houseToEdit.name || '', 
                    location: houseToEdit.location || '',
                    price: houseToEdit.price || '',
                    details: houseToEdit.details || '',
                    image: houseToEdit.image || ''
                });
            }
        } else if (!id) {
            setHouseData({ title: '', location: '', price: '', details: '', image: '' });
        }
    }, [id, houses]);

    // 2. Деректерді серверге жіберу (Сақтау/Қосу)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            title: houseData.title, 
            location: houseData.location,
            price: parseInt(houseData.price) || 0,
            details: houseData.details,
            image: houseData.image
        };

        const url = id ? `http://localhost:5000/api/houses/${id}` : 'http://localhost:5000/api/houses';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                onUpdate(); 
                toast.success(id ? "Өзгерістер сақталды!" : "Жаңа жарнама қосылды!");
                navigate('/admin');
            } else {
                const errorData = await response.json();
                toast.error(`Қате: ${errorData.error || "Сервер қатесі"}`);
            }
        } catch (error) {
            toast.error("Сервермен байланыс үзілді!");
        }
    };

    // 3. Өшіру функциясы
    const handleDelete = async (houseId) => {
        const result = await Swal.fire({
            title: 'Өшіруді растайсыз ба?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Иә, өшіру',
            cancelButtonText: 'Болдырмау'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/houses/${houseId}`, { method: 'DELETE' });
                if (response.ok) {
                    onUpdate();
                    toast.success("Өшірілді!");
                }
            } catch (err) {
                toast.error("Өшіру кезінде қате кетті");
            }
        }
    };

    return (
        <div style={{ padding: '120px 8%', display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h2>{id ? "✏️ Жарнаманы өңдеу" : "🏠 Жаңа үй қосу"}</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <input 
                        style={inputStyle} 
                        placeholder="Үйдің атауы" 
                        value={houseData.title} 
                        onChange={e => setHouseData({...houseData, title: e.target.value})} 
                        required 
                    />
                    <input 
                        style={inputStyle} 
                        placeholder="Сурет сілтемесі (URL)" 
                        value={houseData.image} 
                        onChange={e => setHouseData({...houseData, image: e.target.value})} 
                        required 
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            style={inputStyle} 
                            placeholder="Орналасуы" 
                            value={houseData.location} 
                            onChange={e => setHouseData({...houseData, location: e.target.value})} 
                            required 
                        />
                        <input 
                            style={inputStyle} 
                            type="number" 
                            placeholder="Бағасы" 
                            value={houseData.price} 
                            onChange={e => setHouseData({...houseData, price: e.target.value})} 
                            required 
                        />
                    </div>
                    <textarea 
                        style={{ ...inputStyle, height: '100px' }} 
                        placeholder="Сипаттамасы..." 
                        value={houseData.details} 
                        onChange={e => setHouseData({...houseData, details: e.target.value})} 
                    />
                    <button type="submit" style={btnStyle}>{id ? "Өзгерістерді сақтау" : "Жарнаманы жариялау"}</button>
                </form>
            </div>

            <div style={{ width: '450px', background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #eee' }}>
                <h3>Барлық жарнамалар</h3>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {houses.map(house => (
                        <div key={house.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div>
                                <strong style={{ display: 'block' }}>{house.title || house.name || 'Атаусыз'}</strong>
                                <div style={{ color: '#b01d76' }}>{house.price} ₸</div>
                            </div>
                            <div>
                                <button onClick={() => navigate(`/admin/edit/${house.id}`)} style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '5px', fontSize: '18px' }}>✏️</button>
                                <button onClick={() => handleDelete(house.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '12px', background: '#b01d76', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default AdminPanel;