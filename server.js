const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Gör så att allt i public-mappen är tillgängligt
app.use(express.static(path.join(__dirname, 'public')));

// Servera index.html på "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});