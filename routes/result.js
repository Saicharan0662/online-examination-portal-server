const router = require('express').Router();

const {
    getResult,
    getSingleResult,
    getResultForOneStudent,
    getTotalStudentExams
} = require('../controllers/result');

router.route('/submit/:examID').post(getResult);
router.route('/:resultID').get(getSingleResult);
router.route('/student/:studentID').get(getResultForOneStudent);
router.route('/student/:studentID/:examID').get(getTotalStudentExams);

module.exports = router;