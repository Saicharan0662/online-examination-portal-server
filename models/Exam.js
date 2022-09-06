const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a exam name'],
        trim: true,
        maxLength: [30, 'Exam name cannot be more than 30 characters'],
        minLength: [3, 'Exam name cannot be less than 3 characters'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide a duration of exam'],
    },
    topics: {
        type: Array,
        required: [true, 'Please provide a topics of exam'],
    },
    CreatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Examiner',
        required: [true, 'Please provide a examiner id'],
    },
    questions: [{
        question: {
            type: String,
        },
        options: {
            type: Array,
        },
        answer: {
            type: String,
        },

        default: []
    }]
}, { timestamps: true })

module.exports = mongoose.model('Exam', ExamSchema);