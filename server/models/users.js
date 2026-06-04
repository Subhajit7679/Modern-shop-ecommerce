const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true },
      match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    userImage: {
      type: String,
      default: "user.png",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    secretKey: {
      type: String,
      default: null,
    },
    history: {
      type: Array,
      default: [],
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    addresses: [
      {
        fullName: String,

        phone: String,

        pincode: String,

        state: String,

        city: String,

        house: String,

        area: String,

        landmark: String,

        addressType: {
          type: String,
          default: "Home",
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },

  { timestamps: true },
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
