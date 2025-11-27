const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

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
      organizationId INTEGER,
      changeFieldToHumanities INTEGER DEFAULT 0,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact Methods Table
    db.run(`CREATE TABLE IF NOT EXISTS person_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personId INTEGER,
      contactType TEXT,
      contactValue TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (personId) REFERENCES persons(id) ON DELETE CASCADE
    )`);

    // Person Roles Table
    db.run(`CREATE TABLE IF NOT EXISTS person_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personId INTEGER,
      roleTitle TEXT,
      organization TEXT,
      startDate TEXT,
      endDate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (personId) REFERENCES persons(id) ON DELETE CASCADE
    )`);

    // Person Documents Table
    db.run(`CREATE TABLE IF NOT EXISTS person_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personId INTEGER,
      documentType TEXT,
      fileName TEXT,
      filePath TEXT,
      uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (personId) REFERENCES persons(id) ON DELETE CASCADE
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

    // Event Organization Collaborators Table
    db.run(`CREATE TABLE IF NOT EXISTS event_org_collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      organizationId INTEGER,
      organizationName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    )`);

    // Event Person Collaborators Table
    db.run(`CREATE TABLE IF NOT EXISTS event_person_collaborators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      personId INTEGER,
      personName TEXT,
      role TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (personId) REFERENCES persons(id) ON DELETE CASCADE
    )`);

    // Event Participants Table
    db.run(`CREATE TABLE IF NOT EXISTS event_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      firstName TEXT,
      lastName TEXT,
      mobile TEXT,
      position TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    )`);

    // Applications Table (Updated with season and year)
    db.run(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicantId INTEGER,
      applicantName TEXT,
      requestType TEXT,
      field TEXT,
      submitYear TEXT,
      submitSeason TEXT,
      status TEXT,
      score TEXT,
      approvedAmount TEXT,
      currency TEXT,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Application Documents Table (NEW)
    db.run(`CREATE TABLE IF NOT EXISTS application_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicationId INTEGER,
      documentType TEXT,
      fileName TEXT,
      filePath TEXT,
      uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
    )`);

    // Payments Table (Updated with relations)
    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      paymentCategory TEXT,
      relatedPersonId INTEGER,
      relatedPersonName TEXT,
      relatedOrgId INTEGER,
      relatedOrgName TEXT,
      relatedEventId INTEGER,
      relatedEventName TEXT,
      paymentDate TEXT,
      amount TEXT,
      method TEXT,
      transactionType TEXT,
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

app.get('/api/persons/:id', (req, res) => {
  db.get('SELECT * FROM persons WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/persons', (req, res) => {
  const { nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, organizationId, changeFieldToHumanities, notes } = req.body;
  
  const sql = `INSERT INTO persons (nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, organizationId, changeFieldToHumanities, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, organizationId, changeFieldToHumanities ? 1 : 0, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Person created' });
  });
});

app.put('/api/persons/:id', (req, res) => {
  const { nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, organizationId, changeFieldToHumanities, notes } = req.body;
  
  const sql = `UPDATE persons SET nationalCode=?, firstName=?, lastName=?, gender=?, birthDate=?, mobile=?, email=?, city=?, country=?, education=?, job=?, organizationId=?, changeFieldToHumanities=?, notes=? WHERE id=?`;
  
  db.run(sql, [nationalCode, firstName, lastName, gender, birthDate, mobile, email, city, country, education, job, organizationId, changeFieldToHumanities ? 1 : 0, notes, req.params.id], function(err) {
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

// ==================== PERSON CONTACTS API ====================
app.get('/api/persons/:personId/contacts', (req, res) => {
  db.all('SELECT * FROM person_contacts WHERE personId = ?', [req.params.personId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/persons/:personId/contacts', (req, res) => {
  const { contactType, contactValue } = req.body;
  const sql = 'INSERT INTO person_contacts (personId, contactType, contactValue) VALUES (?, ?, ?)';
  
  db.run(sql, [req.params.personId, contactType, contactValue], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Contact added' });
  });
});

app.delete('/api/persons/:personId/contacts/:contactId', (req, res) => {
  db.run('DELETE FROM person_contacts WHERE id = ?', [req.params.contactId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contact deleted' });
  });
});

// ==================== PERSON ROLES API ====================
app.get('/api/persons/:personId/roles', (req, res) => {
  db.all('SELECT * FROM person_roles WHERE personId = ?', [req.params.personId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/persons/:personId/roles', (req, res) => {
  const { roleTitle, organization, startDate, endDate } = req.body;
  const sql = 'INSERT INTO person_roles (personId, roleTitle, organization, startDate, endDate) VALUES (?, ?, ?, ?, ?)';
  
  db.run(sql, [req.params.personId, roleTitle, organization, startDate, endDate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Role added' });
  });
});

app.delete('/api/persons/:personId/roles/:roleId', (req, res) => {
  db.run('DELETE FROM person_roles WHERE id = ?', [req.params.roleId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Role deleted' });
  });
});

// ==================== PERSON DOCUMENTS API ====================
app.get('/api/persons/:personId/documents', (req, res) => {
  db.all('SELECT * FROM person_documents WHERE personId = ?', [req.params.personId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/persons/:personId/documents', upload.single('file'), (req, res) => {
  const { documentType } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const sql = 'INSERT INTO person_documents (personId, documentType, fileName, filePath) VALUES (?, ?, ?, ?)';
  
  db.run(sql, [req.params.personId, documentType, file.originalname, file.path], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Document uploaded', fileName: file.originalname, filePath: file.path });
  });
});

app.delete('/api/persons/:personId/documents/:documentId', (req, res) => {
  db.get('SELECT filePath FROM person_documents WHERE id = ?', [req.params.documentId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row && row.filePath && fs.existsSync(row.filePath)) {
      fs.unlinkSync(row.filePath);
    }
    
    db.run('DELETE FROM person_documents WHERE id = ?', [req.params.documentId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Document deleted' });
    });
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

// ==================== EVENT ORG COLLABORATORS API ====================
app.get('/api/events/:eventId/org-collaborators', (req, res) => {
  db.all('SELECT * FROM event_org_collaborators WHERE eventId = ?', [req.params.eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events/:eventId/org-collaborators', (req, res) => {
  const { organizationId, organizationName } = req.body;
  const sql = 'INSERT INTO event_org_collaborators (eventId, organizationId, organizationName) VALUES (?, ?, ?)';
  
  db.run(sql, [req.params.eventId, organizationId, organizationName], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Organization collaborator added' });
  });
});

app.delete('/api/events/:eventId/org-collaborators/:collabId', (req, res) => {
  db.run('DELETE FROM event_org_collaborators WHERE id = ?', [req.params.collabId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Organization collaborator deleted' });
  });
});

// ==================== EVENT PERSON COLLABORATORS API ====================
app.get('/api/events/:eventId/person-collaborators', (req, res) => {
  db.all('SELECT * FROM event_person_collaborators WHERE eventId = ?', [req.params.eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events/:eventId/person-collaborators', (req, res) => {
  const { personId, personName, role } = req.body;
  const sql = 'INSERT INTO event_person_collaborators (eventId, personId, personName, role) VALUES (?, ?, ?, ?)';
  
  db.run(sql, [req.params.eventId, personId, personName, role], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Person collaborator added' });
  });
});

app.delete('/api/events/:eventId/person-collaborators/:collabId', (req, res) => {
  db.run('DELETE FROM event_person_collaborators WHERE id = ?', [req.params.collabId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Person collaborator deleted' });
  });
});

// ==================== EVENT PARTICIPANTS API ====================
app.get('/api/events/:eventId/participants', (req, res) => {
  db.all('SELECT * FROM event_participants WHERE eventId = ?', [req.params.eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events/:eventId/participants', (req, res) => {
  const { firstName, lastName, mobile, position } = req.body;
  const sql = 'INSERT INTO event_participants (eventId, firstName, lastName, mobile, position) VALUES (?, ?, ?, ?, ?)';
  
  db.run(sql, [req.params.eventId, firstName, lastName, mobile, position], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Participant added' });
  });
});

app.delete('/api/events/:eventId/participants/:participantId', (req, res) => {
  db.run('DELETE FROM event_participants WHERE id = ?', [req.params.participantId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Participant deleted' });
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
  const { applicantId, applicantName, requestType, field, submitYear, submitSeason, status, score, approvedAmount, currency, notes } = req.body;
  
  const sql = `INSERT INTO applications (applicantId, applicantName, requestType, field, submitYear, submitSeason, status, score, approvedAmount, currency, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [applicantId, applicantName, requestType, field, submitYear, submitSeason, status, score, approvedAmount, currency, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Application created' });
  });
});

app.put('/api/applications/:id', (req, res) => {
  const { applicantId, applicantName, requestType, field, submitYear, submitSeason, status, score, approvedAmount, currency, notes } = req.body;
  
  const sql = `UPDATE applications SET applicantId=?, applicantName=?, requestType=?, field=?, submitYear=?, submitSeason=?, status=?, score=?, approvedAmount=?, currency=?, notes=? WHERE id=?`;
  
  db.run(sql, [applicantId, applicantName, requestType, field, submitYear, submitSeason, status, score, approvedAmount, currency, notes, req.params.id], function(err) {
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

// ==================== APPLICATION DOCUMENTS API ====================
app.get('/api/applications/:applicationId/documents', (req, res) => {
  db.all('SELECT * FROM application_documents WHERE applicationId = ?', [req.params.applicationId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/applications/:applicationId/documents', upload.single('file'), (req, res) => {
  const { documentType } = req.body;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const sql = 'INSERT INTO application_documents (applicationId, documentType, fileName, filePath) VALUES (?, ?, ?, ?)';
  
  db.run(sql, [req.params.applicationId, documentType, file.originalname, file.path], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Document uploaded', fileName: file.originalname, filePath: file.path });
  });
});

app.delete('/api/applications/:applicationId/documents/:documentId', (req, res) => {
  db.get('SELECT filePath FROM application_documents WHERE id = ?', [req.params.documentId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row && row.filePath && fs.existsSync(row.filePath)) {
      fs.unlinkSync(row.filePath);
    }
    
    db.run('DELETE FROM application_documents WHERE id = ?', [req.params.documentId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Document deleted' });
    });
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
  const { title, paymentCategory, relatedPersonId, relatedPersonName, relatedOrgId, relatedOrgName, relatedEventId, relatedEventName, paymentDate, amount, method, transactionType, paymentType, status, refNumber, notes } = req.body;
  
  const sql = `INSERT INTO payments (title, paymentCategory, relatedPersonId, relatedPersonName, relatedOrgId, relatedOrgName, relatedEventId, relatedEventName, paymentDate, amount, method, transactionType, paymentType, status, refNumber, notes) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [title, paymentCategory, relatedPersonId, relatedPersonName, relatedOrgId, relatedOrgName, relatedEventId, relatedEventName, paymentDate, amount, method, transactionType, paymentType, status, refNumber, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Payment created' });
  });
});

app.put('/api/payments/:id', (req, res) => {
  const { title, paymentCategory, relatedPersonId, relatedPersonName, relatedOrgId, relatedOrgName, relatedEventId, relatedEventName, paymentDate, amount, method, transactionType, paymentType, status, refNumber, notes } = req.body;
  
  const sql = `UPDATE payments SET title=?, paymentCategory=?, relatedPersonId=?, relatedPersonName=?, relatedOrgId=?, relatedOrgName=?, relatedEventId=?, relatedEventName=?, paymentDate=?, amount=?, method=?, transactionType=?, paymentType=?, status=?, refNumber=?, notes=? WHERE id=?`;
  
  db.run(sql, [title, paymentCategory, relatedPersonId, relatedPersonName, relatedOrgId, relatedOrgName, relatedEventId, relatedEventName, paymentDate, amount, method, transactionType, paymentType, status, refNumber, notes, req.params.id], function(err) {
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
