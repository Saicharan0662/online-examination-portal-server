const Student = require('../models/Student');
const Examiner = require('../models/Examiner');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require('../errors')

const register = async (req, res) => {
    const { name, email, password, userType } = req.body;
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, { expiresIn: '20m' })
    let user;
    if (userType === 'student') {
        user = await Student.create({ name, email, password, userType });
    } else {
        user = await Examiner.create({ name, email, password, userType });
    }

    user.sendVerificationEmail(token)
    res.status(StatusCodes.ACCEPTED).json({ user: { name: user.name, email: user.email }, msg: 'Please confirm your email' })
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
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, clientToken })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Student.findOne({ email });
    if (!email || !password)
        throw new BadRequestError(`Please provide email and password`)
    if (!user)
        throw new UnauthenticatedError(`Invalid credentials`)

    if (!user.isActivated) {
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '20m' })
        user.sendVerificationEmail(token)
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Please verify your email, verification link sent to the email ${user.email}` })
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })
}

module.exports = {
    register,
    login,
    activate
}