const express = require('express');
const router = express.Router({ mergeParams: true });
const { validatePost, isLoggedIn, isPostAuthor } = require ('../middleware');
const Forum = require('../models/forum');
const Post = require('../models/post');
const posts = require('../controllers/posts');
const { postSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validatePost, catchAsync(posts.createPost))
 
router.delete('/:postId', isLoggedIn, isPostAuthor, catchAsync(posts.deletePost))

 module.exports = router;