var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var itemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  itemDateTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  valueNumber: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Item', itemSchema);
