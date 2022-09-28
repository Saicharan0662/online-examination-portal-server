const Result = require('../models/Result');
const Exam = require('../models/Exam');
const { StatusCodes } = require('http-status-codes');

const getResult = async (req, res) => {
    const { response } = req.body;

    const exam = await Exam.find({ _id: response.examID });
    let score = 0;
    let index = 0;
    for (let question of exam[0].questions) {
        if (question._id.toString() === response.response[index].questionID) {
            if (response.response[index++].givenAnswer === question.answer) {
                score = score + 1;
            }
        }
    }

    score = ((score / response.response.length) * 100).toFixed(2);

    const result = await Result.create({
        examID: response.examID,
        studentID: response.studentID,
        response: response.response,
        score: score.toString()
    });

    res.status(StatusCodes.OK).send({ result, msg: "success" })
}

module.exports = {
    getResult
}