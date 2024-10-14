const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    addresses: {
      type: [Schema.Types.ObjectId],
      ref: 'UserAddress',
      default: [],
    },

    firstName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    profilePicture: String,

    dateOfBirth: Date,

    socialMedia: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      // ... other platforms with default empty string ...
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
  },
  { timestamps: true }
);

ProfileSchema.index({ firstName: 1, lastName: 1, phoneNumber: 1 });

ProfileSchema.methods.calculateCompleteness = function () {
  let fieldsFilled = 0;
  let totalFields = 0;
  for (let field in this.schema.paths) {
    if (this[field]) fieldsFilled++;
    totalFields++;
  }
  return (fieldsFilled / totalFields) * 100;
};

module.exports = mongoose.model('Profile', ProfileSchema);
