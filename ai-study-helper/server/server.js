const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const askRoute = require('./routes/ask');
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');
const summaryRoute = require('./routes/summary');

app.use('/api', askRoute);
app.use('/api/auth', authRoute);
app.use('/api/notes', notesRoute);
app.use('/api/ai', summaryRoute);

// Basic health check
app.get('/', (req, res) => {
  res.send('AI Study Helper Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
