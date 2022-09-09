const Student = require('../models/Student');
const Examiner = require('../models/Examiner');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require('../errors')

const register = async (req, res) => {
    const { name, email, password, userType } = req.body;

    let user, token;
    if (userType === 'student') {
        user = await Student.create({ name, email, password, userType });
        token = user.createJWT();
    } else {
        user = await Examiner.create({ name, email, password, userType });
        token = user.createJWT();
    }

    user.sendVerificationEmail(token)
    res.status(StatusCodes.ACCEPTED).json({ user: { userID: user._id, name: user.name, email: user.email }, msg: 'Please confirm your email' })
}

const activate = async (req, res) => {
    const { clientToken, userType } = req.body;
    let user;
    try {
        let payload = jwt.verify(clientToken, process.env.JWT_SECRET);
        if (userType === 'student') {
            user = await Student.findOneAndUpdate({ email: payload.email }, { isActivated: true }, {
                new: true,
                runValidators: true
            });
        } else {
            user = await Examiner.findOneAndUpdate({ email: payload.email }, { isActivated: true }, {
                new: true,
                runValidators: true
            });
        }
    } catch (error) {
        throw new UnauthenticatedError("Invalid Token");
    }
    res.status(StatusCodes.CREATED).json({ user: { userID: user._id, name: user.name, email: user.email }, clientToken })
}

const login = async (req, res) => {
    const { email, password, userType } = req.body;
    let user;
    if (userType === 'student')
        user = await Student.findOne({ email });
    else user = await Examiner.findOne({ email })
    if (!email || !password)
        throw new BadRequestError(`Please provide email and password`)
    if (!user)
        throw new UnauthenticatedError(`Invalid credentials`)

    if (!user.isActivated) {
        let token = user.createJWT();
        user.sendVerificationEmail(token)
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Please verify your email, verification link sent to the email ${user.email}` })
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = jwt.sign({ userID: user._id, email, password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    res.status(StatusCodes.OK).json({ user: { userID: user._id, name: user.name, email: user.email, userType: user.userType }, token })
}

const forgotPassword = async (req, res) => {
    const { email, userType } = req.body;
    let user;
    if (userType === 'student') user = await Student.findOne({ email });
    else user = await Examiner.findOne({ email });

    if (!user) throw new UnauthenticatedError("Invalid Email");
    const token = user.createJWT();

    user.sendResetPasswordEmail(token);
    res.status(StatusCodes.OK).json({ msg: `Reset password link sent to the email ${user.email}` })
}

const changePassword = async (req, res) => {
    const { newPassword, clientToken, userType } = req.body;
    let user;
    try {
        const payload = jwt.verify(clientToken, process.env.JWT_SECRET)
        const salt = await bcrypt.genSalt(10)
        hashedPassword = await bcrypt.hash(newPassword, salt)
        if (userType === 'student') {
            user = await Student.findOneAndUpdate({ email: payload.email }, { password: hashedPassword }, {
                new: true,
                runValidators: true
            });
        }
        else {
            user = await Examiner.findOneAndUpdate({ email: payload.email }, { password: hashedPassword }, {
                new: true,
                runValidators: true
            })
        }
    } catch (error) {
        // console.log(error)
        throw new UnauthenticatedError("Not Authorized");
    }

    const token = jwt.sign({ userID: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })

    res.status(StatusCodes.OK).json({ user: { userID: user._id, name: user.name, email: user.email }, token, msg: "Password changed successfully" })
}

module.exports = {
    register,
    login,
    activate,
    forgotPassword,
    changePassword
}