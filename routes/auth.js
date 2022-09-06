const router = require('express').Router();
const { register, login, activate } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/activate', activate);

module.exports = router;