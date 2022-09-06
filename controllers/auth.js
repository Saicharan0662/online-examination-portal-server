const Student = require('../models/Student');

const register = async (req, res) => {
    const { name, email, password, userType } = req.body;
    res.send('register controler')
}

const login = async (req, res) => {
    res.send('login controler')
}

module.exports = {
    register,
    login
}