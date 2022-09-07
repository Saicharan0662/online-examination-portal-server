const Exam = require('../models/Exam');
const { UnauthenticatedError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const createExam = async (req, res) => {
    const { name, description, duration, topics, questions } = req.body;
    console.log(name, description, duration, topics, questions, req.user);
    res.send('create exam');
}

module.exports = {
    createExam,
}