const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// post /feed/post
router.post('/post', 
[
    body('title').trim().isLength({min: 5, max: 30}),
    body('address.city').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('address.state').trim().isLength({min: 5, max: 30}),
    body('address.neighborhood').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('address.street').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('description').trim().isLength({min:5})
],
feedController.createPost
);

module.exports = router;
