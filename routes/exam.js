const router = require('express').Router();

const {
    createExam,
    getExams,
    deleteExam,
    getSingleExam,
    updateExam,
    getAllExamsDataForStudent,
    registerStudent,
    getExamForStudent } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam).get(getSingleExam).patch(updateExam);
router.route('/get-exams/student').get(getAllExamsDataForStudent);
router.route('/get-exam-data/:examID').get(getExamForStudent);
router.route('/register-student/:examID').post(registerStudent);

module.exports = router;