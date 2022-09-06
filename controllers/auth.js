const Student = require('../models/Student');

const register = async (req, res) => {
    const { name, email, password, userType } = req.body;
    const user = await Student.create({ name, email, password, userType });
    res.status(201).json({ user });
}

const login = async (req, res) => {
    res.send('login controler')
}

module.exports = {
    register,
    login
}