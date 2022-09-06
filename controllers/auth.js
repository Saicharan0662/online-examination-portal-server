const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const { name, email, password, userType } = req.body;
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, { expiresIn: '20m' })
    const user = await Student.create({ name, email, password, userType });
    user.sendVerificationEmail(token)
    res.status(StatusCodes.ACCEPTED).json({ user: { name: user.name, email: user.email }, msg: 'Please confirm your email' })
}

const activate = async (req, res) => {
    const { clientToken } = req.body;
    let user;
    try {
        let payload = jwt.verify(clientToken, process.env.JWT_SECRET);
        user = await Student.findOneAndUpdate({ email: payload.email }, { isActivated: true }, {
            new: true,
            runValidators: true
        });
    } catch (error) {
        throw new UnauthenticatedError("Invalid Token");
    }
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, clientToken })
}

const login = async (req, res) => {
    res.send('login controler')
}

module.exports = {
    register,
    login,
    activate
}