const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts - retrieve all posts
router.get('/posts', feedController.getPosts);

// GET /feed/post/postId - retrieves single post which is selected by id 
router.get('/post/:postId', feedController.getPost);


// POST /feed/post - creates a single post
router.post('/post', 
[
    body('title').trim().isLength({min: 5, max: 30}),
    body('address.city').trim().not().isEmpty().isLength({min: 4, max: 30}),
    body('address.state').trim().isLength({min: 5, max: 30}),
    body('address.neighborhood').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('address.street').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('description').trim().isLength({min:5})
],
feedController.createPost
);

// PUT /feed/post/postId - update a single post
router.put('/post/:postId', 
[
    body('title').trim().isLength({min: 5, max: 30}),
    body('address.city').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('address.state').trim().isLength({min: 5, max: 30}),
    body('address.neighborhood').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('address.street').trim().not().isEmpty().isLength({min: 5, max: 30}),
    body('description').trim().isLength({min:5})
],
feedController.updatePost
);

// DELETE /feed/post/postId - delete a single post
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
