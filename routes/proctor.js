const router = require('express').Router();
const { getData } = require('../controllers/proctor');

router.get('/data', getData);

module.exports = router;