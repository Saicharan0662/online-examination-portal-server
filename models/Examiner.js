const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ExaminerSchema = mongoose.Schema({
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
        enum: ['student', 'examiner'],
        default: 'examiner',
    },
    examsCreated: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    regStudents: {
        type: Array,
        default: []
    },
    dedicatedRoomID: {
        type: String,
        default: Math.random().toString(36).substring(2, 8)
    }
})

ExaminerSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

ExaminerSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, email: this.email, password: this.password }, process.env.JWT_SECRET, { expiresIn: '20m' });
}

ExaminerSchema.methods.matchPasswords = async function (clientPassword) {
    return await bcrypt.compare(clientPassword, this.password);
}

ExaminerSchema.methods.sendResetPasswordEmail = async function (token) {
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
        subject: 'Reset your password',
        html: `
        <p>Click on the link below to reset your password</p>
        <br/>
        <a href='http://localhost:3000/reset-password/${token}'>reset password</a>
        <br/><br/>
        <p>Thank you.</p>
        <p>Team OEP</p>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            // console.log('Email sent: ' + info.response);
        }
    });
}

ExaminerSchema.methods.sendVerificationEmail = async function (token) {
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
        html: `
        <p>Click on the link below to verify your email address and activate your account.</p>
        <br/>
        <a href='http://localhost:3000/activate/${this.userType}/${token}'>activate account</a>
        <br/><br/>
        <p>Thank you.</p>
        <p>Team OEP</p>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            // console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = mongoose.model("Examiner", ExaminerSchema);