const express = require('express')
const router = express.Router()
const passport = require('passport')

// Models
const Post = require('../../models/Post')

// Validation
const validatePostInput = require('../../validation/post')

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'posts works' }))

// @route   GET api/posts
// @desc    Get post
// @access  Public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ noPostsFound: 'No posts found', error: err })
    )
})

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res
        .status(404)
        .json({ noPostFound: 'No post found with that ID', error: err })
    )
})

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    if (!isValid) {
      res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    })

    newPost.save().then(post => res.json(post))
  }
)

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findOneAndRemove({ user: req.user.id, _id: req.params.postId })
      .then(post => {
        if (post) {
          res.status(200).json({ post: 'Post deleted' })
          return
        }
        res.status(401).json({ post: 'No post found' })
      })
      .catch(err =>
        res
          .status(404)
          .json({ postNotFound: 'Error deleting post', error: err })
      )
  }
)

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post(
  '/like/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          res.status(400).json({ alreadyLiked: 'User already liked this post' })
          return
        }
        post.likes.unshift({ user: req.user.id })
        post.save().then(updatedPost => res.json(updatedPost))
      })
      .catch(err =>
        res.status(404).json({ postNotFound: 'Error liking post', error: err })
      )
  }
)

// @route   POST api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.post(
  '/unlike/:postId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.postId)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          res.status(400).json({ notLiked: 'User has not yet liked this post' })
          return
        }
        const removeIndex = post.likes
          .map(like => like.user.toString())
          .indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        post.save().then(updatedPost => res.json(updatedPost))
      })
      .catch(err =>
        res
          .status(404)
          .json({ postNotFound: 'Error unliking post', error: err })
      )
  }
)

module.exports = router
