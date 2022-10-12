const Result = require('../models/Result');
const Exam = require('../models/Exam');
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');

const getResult = async (req, res) => {
    const { response } = req.body;

    const exam = await Exam.find({ _id: response.examID });
    let score = 0;
    let index = 0;
    for (let question of exam[0].questions) {
        if (question._id.toString() === response.response[index].questionID) {
            if (response.response && (response.response[index++].givenAnswer === question.answer)) {
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

const getResultForOneStudent = async (req, res) => {
    const { studentID } = req.params;

    const results = await Result.aggregate([
        {
            $match: {
                studentID: studentID
            }
        },
        { $group: { _id: null, examID: { $addToSet: "$examID" } } },
        { $unwind: "$examID" },
        {
            $addFields: {
                "examId": {
                    "$toObjectId": "$examID"
                }
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: "examId",
                foreignField: "_id",
                as: 'results'
            }
        },
        {
            $group: {
                _id: "$examID",
                exam: {
                    $push: {
                        examID: "$examID",
                        score: "$score",
                        examDetails: "$results",
                    }
                }
            }
        },
        {
            $unwind: "$exam",
        },
        {
            $unwind: "$exam.examDetails",
        },
        {
            $project: {
                "exam.examDetails.questions": 0,
                "exam.examDetails.duration": 0,
                "exam.examDetails.description": 0,
                "exam.examDetails.registeredStudents": 0,
                "exam.examDetails.createdBy": 0,
            }
        }
    ])

    res.status(StatusCodes.OK).send({ results, msg: "success" })
}

const getSingleResult = async (req, res) => {
    const { resultID } = req.params;

    const result = await Result.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(resultID)
            }
        },
        {
            $addFields: {
                "examId": {
                    "$toObjectId": "$examID"
                }
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: "examId",
                foreignField: "_id",
                as: "examDetails"
            },
        },
        {
            $project: {
                "examDetails.questions": 1,
                "examDetails.description": 1,
                "examDetails.name": 1,
                "examDetails.duration": 1,
                "examDetails._v": 1,
                "_v": 1,
                "examID": 1,
                "studentID": 1,
                "response": 1,
                "score": 1,
                "createdAt": 1,
            }
        }
    ])

    res.status(StatusCodes.OK).send({ result, msg: "success" })
}

module.exports = {
    getResult,
    getSingleResult,
    getResultForOneStudent
}