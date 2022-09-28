const mongoose = require('mongoose');

const ResultSchema = mongoose.Schema({
    examID: {
        type: String
    },
    studentID: {
        type: String
    },
    response: [{
        question: String,
        questionID: mongoose.Types.ObjectId,
        givenAnswer: String,
    }],
    score: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Result', ResultSchema);