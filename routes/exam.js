const router = require('express').Router();

const { createExam, getExams, deleteExam, getSingleExam, updateExam } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam).get(getSingleExam).patch(updateExam);

module.exports = router;