const express = require('express');
const router = express.Router();
const whanaus = require('../controllers/whanaus');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateWhanau } = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const Whanau = require('../models/whanau');

router.route('/')
    .get(catchAsync(whanaus.index))
    .post(isLoggedIn, upload.array('image'), validateWhanau, catchAsync(whanaus.createWhanau))
    
router.get('/new', isLoggedIn, whanaus.renderNewForm);

router.route('/:id')
    .get(catchAsync(whanaus.showWhanau))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateWhanau, catchAsync(whanaus.updateWhanau))
    .delete(isLoggedIn, isAuthor, catchAsync(whanaus.deleteWhanau))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(whanaus.renderEditForm));

module.exports = router;