const router = require('express').Router();

const {
    getResult,
    getSingleResult
} = require('../controllers/result');

router.route('/submit/:examID').post(getResult);
router.route('/:resultID').get(getSingleResult);

module.exports = router;