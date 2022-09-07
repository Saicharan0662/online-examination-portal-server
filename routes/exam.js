const router = require('express').Router();

const { createExam } = require('../controllers/exam');

router.route('/create').post(createExam);

module.exports = router;