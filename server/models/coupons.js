const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    discountPercent: {
      type: Number,
      required: true,
    },

    minAmount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

const couponModel = mongoose.model("coupons", couponSchema);

module.exports = couponModel;
