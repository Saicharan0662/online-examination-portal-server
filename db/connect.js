const mongoose = require('mongoose');

const connectDB = uri => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        wtimeoutMS: 5000,
    })
}

module.exports = connectDB;