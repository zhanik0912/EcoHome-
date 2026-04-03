const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Настройки
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'My Project', // Проверь, что в pgAdmin имя базы именно такое (с пробелом)
  password: 'zhanik09',
  port: 5432,
});

// Проверка подключения
pool.connect((err) => {
    if (err) console.error('БАЗАҒА ҚОСЫЛУ ҚАТЕСІ:', err.stack);
    else console.log('PostgreSQL-ге сәтті қосылды!');
});

// --- МАРШРУТЫ (API) ---

// 1. Получить все дома (Новые сверху)
app.get('/api/houses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM houses ORDER BY id DESC'); 
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Тізімді алу қатесі' });
  }
});

// 2. Получить один дом по ID (ДЛЯ PROPERTY PAGE)
app.get('/api/houses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM houses WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Үй табылмады" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("ID бойынша алу қатесі:", err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// 3. Добавление нового дома (ВАЖНО: Добавлен owner_email)
app.post('/api/houses', async (req, res) => {
  const { location, price, details, image, owner_name, phone, address, owner_email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO houses 
      (location, rating, price, details, image, owner_name, phone, address, owner_email) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [location, '5.0', price, details, image, owner_name, phone, address, owner_email || 'zhanyk070@gmail.com']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Қосу қатесі:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Обновление (редактирование)
app.put('/api/houses/:id', async (req, res) => {
  const { id } = req.params;
  const { location, price, details, image, owner_name, phone, address } = req.body;
  try {
    const result = await pool.query(
      `UPDATE houses SET 
      location=$1, price=$2, details=$3, image=$4, owner_name=$5, phone=$6, address=$7 
      WHERE id=$8 RETURNING *`,
      [location, price, details, image, owner_name, phone, address, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Өңдеу қатесі:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Удаление
app.delete('/api/houses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM houses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Объект табылмады" });
    res.json({ message: "Сәтті жойылды" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ПОЛЬЗОВАТЕЛИ ---

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Тіркелу қатесі:", err);
        res.status(500).json({ error: "Тіркелу кезінде қате кетті" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        if (result.rows.length > 0) {
            res.json({ message: "Қош келдіңіз!", user: result.rows[0] });
        } else {
            res.status(401).json({ error: "Электрондық пошта немесе құпия сөз қате" });
        }
    } catch (err) {
        console.error("Логин қатесі:", err);
        res.status(500).json({ error: "Сервер қатесі" });
    }
});

app.listen(PORT, () => {
  console.log(`Сервер ${PORT} портында қосылды`);
});