const express = require('express');
const router = express.Router();
const forums = require('../controllers/forums');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateForum } = require('../middleware');
// const multer = require('multer')
// const { storage } = require('../cloudinary')
// const upload = multer({ storage });

const Forum = require('../models/forum');

router.route('/')
    .get(catchAsync(forums.index))
    .post(isLoggedIn, validateForum, catchAsync(forums.createForum))
    
router.get('/new', isLoggedIn, forums.renderNewForm);

router.route('/:id')
    .get(catchAsync(forums.showForum))
    .put(isLoggedIn, isAuthor, validateForum, catchAsync(forums.updateForum))
    // .delete(isLoggedIn, isAuthor, catchAsync(forums.deleteForum))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(forums.renderEditForm));

module.exports = router;