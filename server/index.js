const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'My Project', 
    password: 'zhanik09', 
    port: 5432,
});

app.use(cors());
app.use(express.json());

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
            res.status(401).json({ error: "Email немесе құпия сөз қате!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Сервер қатесі" });
    }
});

app.get('/api/houses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM houses ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Деректерді алу мүмкін болмады" });
    }
});

app.post('/api/houses', async (req, res) => {
    const { title, location, price, details, image, company_name, gallery, video_url } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO houses (title, location, price, details, image, company_name, gallery, video_url, rating) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '5.0') RETURNING *`,
            [title || 'Атаусыз', location, price, details, image, company_name || null, gallery || null, video_url || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        const fallbackResult = await pool.query(
            `INSERT INTO houses (title, location, price, details, image, rating) 
             VALUES ($1, $2, $3, $4, $5, '5.0') RETURNING *`,
            [title || 'Атаусыз', location, price, details, image]
        );
        res.json(fallbackResult.rows[0]);
    }
});

app.put('/api/houses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location, price, details, image } = req.body;
    try {
        const result = await pool.query(
            `UPDATE houses SET title = $1, location = $2, price = $3, details = $4, image = $5 WHERE id = $6 RETURNING *`,
            [title, location, price, details, image, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/houses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM houses WHERE id = $1', [id]);
        res.status(200).json({ message: "Өшірілді" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(5000, () => console.log("Сервер қосылды: http://localhost:5000"));
// 2. Барлық үйлерді алу (Түзетілген нұсқа)
app.get('/api/houses', async (req, res) => {
    try {
        // SQL-де 'name' бағаны болса, оны фронтенд үшін 'title' деп бүркеншік атпен береміз
        const result = await pool.query(`
            SELECT id, 
                   COALESCE(title, name) AS title, 
                   location, price, details, image 
            FROM houses 
            ORDER BY id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Get houses error:", err);
        res.status(500).json({ error: "Деректерді алу мүмкін болмады" });
    }
});

// 3. Жарнама қосу (Толық сәйкестендірілген нұсқа)
app.post('/api/houses', async (req, res) => {
    const { title, location, price, details, image } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO houses (title, location, price, details, image, rating) 
             VALUES ($1, $2, $3, $4, $5, '5.0') RETURNING id, title, location, price, details, image`,
            [title, location, price, details, image]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Insert error:", err);
        res.status(500).json({ error: "Серверге сақтау кезінде қате кетті" });
    }
});