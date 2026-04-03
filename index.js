import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Ищем пользователя по email и паролю
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(`Пользователь ${user.name} вошел в систему`);
            res.json({ message: "Қош келдіңіз!", user: user });
        } else {
            // Если данных нет в базе
            res.status(401).json({ error: "Электрондық пошта немесе құпия сөз қате" });
        }
    } catch (err) {
        console.error("Логин қатесі:", err);
        res.status(500).json({ error: "Сервер қатесі" });
    }
});