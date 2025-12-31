const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
    res.send('GoPark API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
