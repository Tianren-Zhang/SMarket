const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    storeName: {
      type: String,
      required: true,
    },

    storeCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreCategory',
      },
    ],

    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    description: String,

    logo: String, // URL to the store's logo

    bannerImage: String, // URL to the store's banner image

    address: {
      state: String,
      country: String,
    },

    contact: {
      email: String,
      phone: String,
    },

    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratings: [
      {
        rating: Number,
        reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
        review: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    operationalHours: {
      open: String,
      close: String,
      // WIll using subdocuments
    },

    inventory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],

    status: {
      type: String,
      enum: ['active', 'maintenance', 'closed'],
      default: 'active',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

StoreSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Store', StoreSchema);
