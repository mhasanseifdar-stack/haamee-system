const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Database
const db = new sqlite3.Database('./haamee.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully');
    initDatabase();
  }
});

// Create Tables
function initDatabase() {
  db.serialize(() => {
    // Persons Table
    db.run(`CREATE TABLE IF NOT EXISTS persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nationalCode TEXT,
      firstName TEXT,
      lastName TEXT,
      gender TEXT,
      birthDate TEXT,
      mobile TEXT,
      email TEXT,
      city TEXT,
      country TEXT,
      education TEXT,
      job TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Organizations Table
    db.run(`CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      nationalId TEXT,
      country TEXT,
      city TEXT,
      address TEXT,
      phone TEXT,
      website TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Events Table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      organizer TEXT,
      startDate TEXT,
      endDate TEXT,
      location TEXT,
      capacity TEXT,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Applications Table
    db.run(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicantId INTEGER,
      applicantName TEXT,
      requestType TEXT,
      field TEXT,
      submitDate TEXT,
      status TEXT,
      score TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Payments Table
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      paymentCategory TEXT,
      relatedId TEXT,
      relatedName TEXT,
      paymentDate TEXT,
      amount TEXT,
      method TEXT,
      direction TEXT,
      paymentType TEXT,
      status TEXT,
      refNumber TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ All tables created/verified');
  });
}

// ==================== PERSONS API ====================
app.get('/api/persons', (req, res) => {
  db.all('SELECT * FROM persons ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/persons', (req, res) => {
  const { nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, notes } = req.body;
  
  const sql = `INSERT INTO persons (nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Person created' });
  });
});

app.put('/api/persons/:id', (req, res) => {
  const { nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, notes } = req.body;
  
  const sql = `UPDATE persons SET nationalCode=?, firstName=?, lastName=?, gender=?, birthDate=?, mobile=?, email=?, city=?, country=?, education=?, job=?, notes=? WHERE id=?`;
  
  db.run(sql, [nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, notes, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Person updated' });
  });
});

app.delete('/api/persons/:id', (req, res) => {
  db.run('DELETE FROM persons WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Person deleted' });
  });
});

// ==================== ORGANIZATIONS API ====================
app.get('/api/organizations', (req, res) => {
  db.all('SELECT * FROM organizations ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/organizations', (req, res) => {
  const { name, type, nationalId, country, city, address, phone, website, notes } = req.body;
  
  const sql = `INSERT INTO organizations (name, type, nationalId, country, city, address, phone, website, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, type, nationalId, country, city, address, phone, website, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Organization created' });
  });
});

app.put('/api/organizations/:id', (req, res) => {
  const { name, type, nationalId, country, city, address, phone, website, notes } = req.body;
  
  const sql = `UPDATE organizations SET name=?, type=?, nationalId=?, country=?, city=?, address=?, phone=?, website=?, notes=? WHERE id=?`;
  
  db.run(sql, [name, type, nationalId, country, city, address, phone, website, notes, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Organization updated' });
  });
});

app.delete('/api/organizations/:id', (req, res) => {
  db.run('DELETE FROM organizations WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Organization deleted' });
  });
});

// ==================== EVENTS API ====================
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events', (req, res) => {
  const { title, type, organizer, startDate, endDate, location, capacity, description } = req.body;
  
  const sql = `INSERT INTO events (title, type, organizer, startDate, endDate, location, capacity, description) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [title, type, organizer, startDate, endDate, location, capacity, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Event created' });
  });
});

app.put('/api/events/:id', (req, res) => {
  const { title, type, organizer, startDate, endDate, location, capacity, description } = req.body;
  
  const sql = `UPDATE events SET title=?, type=?, organizer=?, startDate=?, endDate=?, location=?, capacity=?, description=? WHERE id=?`;
  
  db.run(sql, [title, type, organizer, startDate, endDate, location, capacity, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Event updated' });
  });
});

app.delete('/api/events/:id', (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Event deleted' });
  });
});

// ==================== APPLICATIONS API ====================
app.get('/api/applications', (req, res) => {
  db.all('SELECT * FROM applications ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/applications', (req, res) => {
  const { applicantId, applicantName, requestType, field, submitDate, status, score, notes } = req.body;
  
  const sql = `INSERT INTO applications (applicantId, applicantName, requestType, field, submitDate, status, score, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [applicantId, applicantName, requestType, field, submitDate, status, score, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Application created' });
  });
});

app.put('/api/applications/:id', (req, res) => {
  const { applicantId, applicantName, requestType, field, submitDate, status, score, notes } = req.body;
  
  const sql = `UPDATE applications SET applicantId=?, applicantName=?, requestType=?, field=?, submitDate=?, status=?, score=?, notes=? WHERE id=?`;
  
  db.run(sql, [applicantId, applicantName, requestType, field, submitDate, status, score, notes, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Application updated' });
  });
});

app.delete('/api/applications/:id', (req, res) => {
  db.run('DELETE FROM applications WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Application deleted' });
  });
});

// ==================== PAYMENTS API ====================
app.get('/api/payments', (req, res) => {
  db.all('SELECT * FROM payments ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/payments', (req, res) => {
  const { title, paymentCategory, relatedId, relatedName, paymentDate, amount, method, direction, paymentType, status, refNumber, notes } = req.body;
  
  const sql = `INSERT INTO payments (title, paymentCategory, relatedId, relatedName, paymentDate, amount, method, direction, paymentType, status, refNumber, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [title, paymentCategory, relatedId, relatedName, paymentDate, amount, method, direction, paymentType, status, refNumber, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Payment created' });
  });
});

app.put('/api/payments/:id', (req, res) => {
  const { title, paymentCategory, relatedId, relatedName, paymentDate, amount, method, direction, paymentType, status, refNumber, notes } = req.body;
  
  const sql = `UPDATE payments SET title=?, paymentCategory=?, relatedId=?, relatedName=?, paymentDate=?, amount=?, method=?, direction=?, paymentType=?, status=?, refNumber=?, notes=? WHERE id=?`;
  
  db.run(sql, [title, paymentCategory, relatedId, relatedName, paymentDate, amount, method, direction, paymentType, status, refNumber, notes, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Payment updated' });
  });
});

app.delete('/api/payments/:id', (req, res) => {
  db.run('DELETE FROM payments WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Payment deleted' });
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Haamee Server Running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Haamee Server running on http://localhost:${PORT}`);
});
