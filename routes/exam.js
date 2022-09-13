const router = require('express').Router();

const { createExam, getExams, deleteExam } = require('../controllers/exam');

router.route('/').get(getExams).post(createExam);
router.route('/:id').delete(deleteExam);

module.exports = router;