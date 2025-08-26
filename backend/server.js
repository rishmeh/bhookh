const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

// Configure CORS to accept requests from your frontend
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Connect to database
connectDB().catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

// API routes
app.use("/api", require("./route"));

// Periodic cleanup in case TTL index is not immediately effective
const { DonateData } = require('./schema');
setInterval(async () => {
    try {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await DonateData.deleteMany({ createdAt: { $lt: cutoff } });
    } catch (e) {
        console.error('Cleanup job failed:', e);
    }
}, 60 * 60 * 1000); // hourly

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`CORS enabled for: http://localhost:5173`);
});