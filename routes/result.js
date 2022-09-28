const router = require('express').Router();

const {
    getResult
} = require('../controllers/result');

router.route('/submit/:examID').post(getResult);

module.exports = router;