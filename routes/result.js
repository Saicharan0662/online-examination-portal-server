const router = require('express').Router();

const {
    getResult,
    getSingleResult,
    getResultForOneStudent
} = require('../controllers/result');

router.route('/submit/:examID').post(getResult);
router.route('/:resultID').get(getSingleResult);
router.route('/student/:studentID').get(getResultForOneStudent);

module.exports = router;