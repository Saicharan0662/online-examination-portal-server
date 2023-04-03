const mongoose = require('mongoose');
const db = mongoose.connection;
const { StatusCodes } = require('http-status-codes');

const getData = async (req, res) => {

    const data = await db.collection('proctor__data').aggregate([
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
                "examDetails.questions": 0,
                "examDetails.createdAt": 0,
                "examDetails.updatedAt": 0,
                "examDetails.registeredStudents": 0,
                "examDetails.time": 0,
                "examDetails.topics": 0,
                "examDetails.createdBy": 0,
                "examDetails.duration": 0,
                "examDetails._id": 0,
                "examDetails.__v": 0,
            }
        }
    ]).toArray();

    res.status(StatusCodes.OK).json({ data })
}

module.exports = {
    getData
}