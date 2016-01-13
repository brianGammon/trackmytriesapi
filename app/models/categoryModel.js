var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  dataType: {
    type: String,
    enum: ['number','time']
  },
  goalType: {
    type: String,
    enum: ['most','least']
  }
});

module.exports = mongoose.model('Category', categorySchema);
