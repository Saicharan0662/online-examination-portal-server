require('dotenv').config();
const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();