const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

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
        type: Boolean,
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

StudentSchema.methods.sendVerificationEmail = async function (token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASS
        }
    });

    const mailOptions = {
        from: process.env.SERVER_EMAIL,
        to: this.email,
        subject: 'Welcome, Please Verify Your Email',
        html: `https://localhost:3000/activate/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = mongoose.model('Student', StudentSchema);