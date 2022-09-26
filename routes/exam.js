const router = require('express').Router();

const { createExam, getExams, deleteExam, getSingleExam, updateExam, getAllExamsForStudent } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam).get(getSingleExam).patch(updateExam);
router.route('/get-exams/student').get(getAllExamsForStudent);

module.exports = router;