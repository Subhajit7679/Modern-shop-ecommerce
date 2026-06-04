const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    allProduct: [
      {
        id: {
          type: ObjectId,
          ref: "products",
        },

        quantity: {
          type: Number,
          required: true,
        },

        selectedSize: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
      required: true,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      house: {
        type: String,
        required: true,
      },

      area: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      landmark: {
        type: String,
      },

      addressType: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    estimatedDelivery: {
      type: Date,
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
