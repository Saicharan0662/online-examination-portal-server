const router = require('express').Router();

const { createExam, getExams, deleteExam, getSingleExam, updateExam, getAllExamsDataForStudent, registerStudent } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam).get(getSingleExam).patch(updateExam);
router.route('/get-exams/student').get(getAllExamsDataForStudent);
router.route('/register-student/:examID').post(registerStudent);

module.exports = router;