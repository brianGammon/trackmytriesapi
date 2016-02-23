'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
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
  loginType: {
    type: String,
    required: true,
    default: 'local',
    enum: ['local', 'fb']
  },
  externalId: {
    type: String
  },
  roles: [{
    type: String,
    required: true,
    enum: ['user', 'admin']
  }]
})

userSchema.pre('save', (next) => {
  if (this.roles.length === 0) {
    this.roles.push('user')
  }

  next()
})

module.exports = mongoose.model('User', userSchema)
