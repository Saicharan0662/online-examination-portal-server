require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authRoute = require('./routes/auth');
const ErrorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use('/api/v1/auth', authRoute);
app.use(ErrorHandlerMiddleware)

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