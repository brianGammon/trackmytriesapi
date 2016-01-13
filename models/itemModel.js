var Category = require('./categoryModel');
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
    type: Number
  },
  valueTime: {
    type: String
  },
  notes: {
    type: String
  }
});

itemSchema.pre("save",function(next) {
  var item = this;
  Category.findById(item.category).exec(function(err, category) {
    if (err) {
      return next(err);
    }

    if (category.dataType === 'number') {
      if (!item.valueNumber && item.valueNumber !== 0) {
        return next(new Error("The itemNumber field must be populated for category: " + category.name));
      }
      item.valueTime = null;
    } else {
      if (!item.valueTime) {
        return next(new Error("The itemTime field must be populated for category: " + category.name));
      }
      item.valueNumber = null;
    }

    next()
  });
});

module.exports = mongoose.model('Item', itemSchema);
