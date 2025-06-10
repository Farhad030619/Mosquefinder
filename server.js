const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const SUBMISSIONS_FILE = path.join(__dirname, 'mosque_submissions.json');

app.post('/api/submit-mosque', (req, res) => {
  const data = req.body;
  fs.readFile(SUBMISSIONS_FILE, 'utf8', (err, content) => {
    const submissions = err ? [] : JSON.parse(content);
    submissions.push({ ...data, timestamp: new Date().toISOString() });
    fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Kunde inte spara bidraget.' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log(`API-server kör på http://localhost:${PORT}`));