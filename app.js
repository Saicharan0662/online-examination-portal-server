require('dotenv').config();
const express = require('express');
const app = express();

const authRoute = require('./routes/auth');
const connectDB = require('./db/connect');

app.use(express.json());
app.use('/api/v1/auth', authRoute);

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