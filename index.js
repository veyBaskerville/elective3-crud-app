const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve index.html and assets

// Connect to MySQL
const db = mysql.createConnection({
host: 'host.docker.internal',
  user: 'root',
  password: '',
  database: 'crud_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
  )
`);

// -------------------- CRUD ROUTES --------------------

// READ all
app.get('/api/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// CREATE
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, description });
  });
});

// UPDATE
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query('UPDATE items SET name=?, description=? WHERE id=?', [name, description, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Updated successfully' });
  });
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id=?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Deleted successfully' });
  });
});

// -----------------------------------------------------

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
