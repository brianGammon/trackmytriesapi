var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  valueType: {
    type: String,
    enum: ['number','duration']
  },
  goalType: {
    type: String,
    enum: ['more','less']
  }
});

module.exports = mongoose.model('Category', categorySchema);
