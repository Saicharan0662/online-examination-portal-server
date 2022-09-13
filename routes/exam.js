const router = require('express').Router();

const { createExam, getExams, deleteExam } = require('../controllers/exam');

router.route('/create').post(createExam);
router.route('/').get(getExams);
router.route('/:id').delete(deleteExam);

module.exports = router;