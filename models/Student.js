const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxLength: [20, 'Name cannot be more than 20 characters'],
        minlength: [3, 'Name cannot be less than 3 characters'],
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
    },
    isActivated: {
        default: false
    },
    userType: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student',
    },
    exams: [{
        examID: String,
        isCompleted: {
            type: Boolean,
            default: false,
        },

        default: []
    }]
})

module.exports = mongoose.model('Student', StudentSchema);