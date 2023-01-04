const express = require('express');

const UserCtrl = require('../controllers/user');
const PostCtrl = require('../controllers/post');
const ReviewCtrl = require('../controllers/review');
const { catchError } = require('../controllers/error');

const router = express.Router();

router.post('/post/create', UserCtrl.checkAuth, catchError(PostCtrl.create));
router.get('/post', UserCtrl.checkAuth, catchError(PostCtrl.get));

router.post('/review/create', UserCtrl.checkAuth, catchError(ReviewCtrl.create));
router.get('/review', UserCtrl.checkAuth, catchError(ReviewCtrl.get));

module.exports = router;
