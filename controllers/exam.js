const Exam = require('../models/Exam');
const Examiner = require('../models/Examiner');
const { UnauthenticatedError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const createExam = async (req, res) => {
    const { name, description, duration, topics, questions } = req.body;

    if (!name || !description || !duration || !topics || !questions)
        throw new BadRequestError("Please provide the required fields");

    const exam = await Exam.create({ name, description, duration, topics, questions, createdBy: req.user.userID });
    const examiner = await Examiner.findByIdAndUpdate({ _id: req.user.userID },
        { $push: { examsCreated: exam._id } },
        { new: true, runValidators: true });

    res.status(StatusCodes.CREATED).json({ exam, msg: "success" })
}

module.exports = {
    createExam,
}