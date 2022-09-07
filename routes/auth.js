const router = require('express').Router();
const { register, login, activate, forgotPassword, changePassword } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/activate', activate);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', changePassword);

module.exports = router;