const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Examiner = require('../models/Examiner')
const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const { default: mongoose, mongo } = require('mongoose');

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
                as: 'exams'
            }
        },
        {
            $project: {
                "response": 0,
                "studentID": 0,
                "__v": 0,
                "exams.questions": 0,
                "exams.__v": 0,
                "exams.registeredStudents": 0,
                "exams.duration": 0,
                "exams._id": 0,
                "exams.createdBy": 0,
                "exams.createdAt": 0,
                "exams.updatedAt": 0,
            }
        },
        {
            $group: {
                _id: "$examID",
                "resultID": { $first: "$_id" },
                "score": { $max: "$score" },
                "updatedAt": { $first: "$updatedAt" },
                "createdAt": { $first: "$createdAt" },
                "exams": { $first: "$exams" },
                count: { $sum: 1 },
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

const getTotalStudentExams = async (req, res) => {
    const { examID, studentID } = req.params;

    const results = await Result.aggregate([
        {
            $match: {
                examID: examID,
                studentID: studentID
            }
        },
        {
            $addFields: {
                "examID": {
                    "$toObjectId": "$examID"
                }
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: 'examID',
                foreignField: "_id",
                as: "examDetails"
            }
        },
        {
            $addFields: {
                examDetails: { $first: "$examDetails" }
            }
        },
        {
            $project: {
                "response": 0,
                "examID": 0,
                "studentID": 0,
                "updatedAt": 0,
                "examDetails.questions": 0,
                "examDetails.duration": 0,
                "examDetails.registeredStudents": 0,
                "examDetails.updatedAt": 0,
                "examDetails.createdBy": 0,
                "examDetails.createdAt": 0,
                "examDetails._id": 0,
                "examDetails.__v": 0,
                "__v": 0,
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    res.status(StatusCodes.OK).send({ results, msg: "success" })
}

const studentResultForExaminer = async (req, res) => {
    const { examinerID } = req.params;

    const tempResult = await Examiner.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(examinerID)
            },
        },
        {
            $project: {
                "_id": 0,
                "examsCreated": 1
            }
        }
    ])

    let examIDs = tempResult[0].examsCreated;
    if (examIDs.length === 0) {
        res.status(StatusCodes.OK).send({ results: [], msg: "success" })
    }

    for (let i = 0; i < examIDs.length; i++) {
        examIDs[i] = examIDs[i].toString();
    }

    const results = await Result.aggregate([
        {
            $match: {
                examID: { $in: examIDs }
            }
        },
        {
            $addFields: {
                "studentID": {
                    "$toObjectId": "$studentID"
                }
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentID",
                foreignField: "_id",
                as: "studentDetails"
            }
        },
        {
            $addFields: {
                "examID": {
                    "$toObjectId": "$examID"
                }
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: "examID",
                foreignField: "_id",
                as: "examDetails"
            }
        },
        {
            $project: {
                "response": 0,
                "__v": 0,
                "updatedAt": 0,
                "studentDetails.password": 0,
                "studentDetails.__v": 0,
                "studentDetails.exams": 0,
                "studentDetails.isActivated": 0,
                "examDetails.questions": 0,
                "examDetails.createdBy": 0,
                "examDetails.createdAt": 0,
                "examDetails.updatedAt": 0,
                "examDetails.__v": 0,
                "examDetails.registeredStudents": 0,
            }
        }
    ])

    res.send({ results, msg: "success" })
}

module.exports = {
    getResult,
    getSingleResult,
    getResultForOneStudent,
    getTotalStudentExams,
    studentResultForExaminer
}