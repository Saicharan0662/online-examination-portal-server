require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http')
const cors = require('cors')

const app = express();
const server = http.createServer(app);

const connectDB = require('./db/connect');
const authRoute = require('./routes/auth');
const examRoute = require('./routes/exam');
const resultRoute = require('./routes/result');
const authMiddleware = require('./middleware/authentication');
const ErrorHandlerMiddleware = require('./middleware/error-handler');

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/exam', authMiddleware, examRoute);
app.use('/api/v1/result', authMiddleware, resultRoute);
app.use(ErrorHandlerMiddleware)

// server start
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();