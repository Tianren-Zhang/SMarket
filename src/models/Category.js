const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null for first-level categories
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    images: {
      url: String,
      altText: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
