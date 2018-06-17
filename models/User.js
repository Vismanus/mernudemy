const mongoose = require('mongoose')
const Schema = mongoose.Schema // eslint-disable-line prefer-destructuring

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// eslint-disable-next-line no-multi-assign, no-undef
module.exports = User = mongoose.model('users', UserSchema)