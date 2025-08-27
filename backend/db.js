const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (err) {
        console.log("Database connection error:", err);
        throw err;
    }
};

module.exports = connectDB;