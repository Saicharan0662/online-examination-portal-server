const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a exam name'],
        trim: true,
        maxLength: [30, 'Exam name cannot be more than 30 characters'],
        minLength: [3, 'Exam name cannot be less than 3 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide a duration of exam'],
    },
    topics: {
        type: Array,
        required: [true, 'Please provide a topics of exam'],
    },
    createdBy: {
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
        image: {
            type: String,
        },
    }],
    registeredStudents: {
        type: Array,
    },
    time: {
        type: Date,
        required: [true, 'Please provide a time of exam'],
    }
}, { timestamps: true })

module.exports = mongoose.model('Exam', ExamSchema);