// /api/server.js
const express = require('express');
const { Pool } = require('pg');  // Postgres client
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Postgres pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Set this on Vercel dashboard
});

// Route to create player account
app.post('/create-account', async (req, res) => {
  const loginCode = Math.random().toString(36).substr(2, 10);
  const query = 'INSERT INTO players(login_code) VALUES($1) RETURNING *';
  const result = await pool.query(query, [loginCode]);

  res.json({ loginCode: result.rows[0].login_code });
});

// Route to login player
app.post('/login', async (req, res) => {
  const { loginCode } = req.body;
  const query = 'SELECT * FROM players WHERE login_code = $1';
  const result = await pool.query(query, [loginCode]);

  if (result.rows.length > 0) {
    res.json({ message: 'Login successful', player: result.rows[0] });
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

// Vercel requires that the app listens on the correct port
app.listen(3000, () => console.log('Server is running on port 3000'));

