const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

// Load User model
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "users works" }))

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' })
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      })
      return bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error
          newUser.password = hash
          newUser.save()
            .then(savedUser => res.json(savedUser))
            .catch(e => console.log(e))
        })
      })
    })
})

// @route   GET api/users/login
// @desc    Login User / Return JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User not found' })
      }

      // Check password
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            return res.json({ msg: 'Login success' })
          }
          return res.status(400).json({ password: 'Password incorrect' })
        })
    })
})

module.exports = router