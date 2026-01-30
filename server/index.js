
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (Placeholders for now)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/fileRoutes'));
app.use('/api/analyze', require('./routes/analysisRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('Deepfake Detection API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
