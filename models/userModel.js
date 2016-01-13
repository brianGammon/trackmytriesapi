var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    enum: ['user','admin'],
  }]
});

userSchema.pre("save",function(next) {
  if (this.roles.length == 0)
    this.roles.push("user");

  next();
});

module.exports = mongoose.model('User', userSchema);
