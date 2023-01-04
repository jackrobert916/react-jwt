const express = require('express');

const UserCtrl = require('../controllers/user');
const { catchError } = require('../controllers/error');

const router = express.Router();

// SignUp
router.post('/register', catchError(UserCtrl.signUp));

// Login
router.post('/login', catchError(UserCtrl.login));

// Edit own profile
router.post('/me', UserCtrl.checkAuth, catchError(UserCtrl.editMe));

// Edit own profile
router.get('/me', UserCtrl.checkAuth, catchError(UserCtrl.getMe));

module.exports = router;
