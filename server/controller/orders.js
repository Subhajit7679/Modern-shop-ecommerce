const orderModel = require("../models/orders");
const productModel = require("../models/products");
const crypto = require("crypto");

const razorpay = require("../config/razorpay");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        const totalOrders = Orders.length;

        const deliveredOrders = Orders.filter(
          (item) => item.status === "Delivered",
        ).length;

        const shippedOrders = Orders.filter(
          (item) => item.status === "Shipped",
        ).length;

        const cancelledOrders = Orders.filter(
          (item) => item.status === "Cancelled",
        ).length;

        const processingOrders = Orders.filter(
          (item) => item.status === "Processing",
        ).length;

        return res.json({
          Orders,

          totalOrders,

          deliveredOrders,

          shippedOrders,

          cancelledOrders,

          processingOrders,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleOrder(req, res) {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.json({
          success: false,
          message: "Order ID required",
        });
      }

      const order = await orderModel

        .findById(orderId)

        .populate("allProduct.id", "pName pImages pPrice")

        .populate("user", "name email");

      if (!order) {
        return res.json({
          success: false,
          message: "Order not found",
        });
      }

      return res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

async createRazorpayOrder(req, res) {

  try {

    const { amount } = req.body;

    const options = {

      amount: Number(amount) * 100,

      currency: "INR",

      receipt:
        "receipt_" + Date.now(),
    };

    const order =
      await razorpay.orders.create(
        options
      );

    return res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message:
        "Failed to create Razorpay order",
    });

  }
}

async verifyPayment(req, res) {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )

        .update(body.toString())

        .digest("hex");

    const isAuthentic =
      expectedSignature ===
      razorpay_signature;

    if (!isAuthentic) {

      return res.json({
        success: false,
      });

    }

    return res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
    });

  }
}

  async postCreateOrder(req, res) {
    try {
      const {
        allProduct,
        user,
        amount,
        transactionId,
        orderId,
        shippingAddress,
        paymentMethod,
        paymentStatus,
        estimatedDelivery,
      } = req.body;

      if (
        !allProduct ||
        !user ||
        !amount ||
        !transactionId ||
        !orderId ||
        !shippingAddress
      ) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const newOrder = new orderModel({
        allProduct,

        user,

        amount,

        transactionId,

        orderId,

        shippingAddress,

        paymentMethod,

        paymentStatus,

        estimatedDelivery,
      });

      const savedOrder = await newOrder.save();

      // REDUCE STOCK
      // REDUCE STOCK
      for (const item of allProduct) {
        await productModel.updateOne(
          {
            _id: item.id?._id || item.id || item._id,
            "pSizes.size": item.selectedSize,
          },

          {
            $inc: {
              "pSizes.$.quantity": -Number(item.quantity),
            },
          },
        );
      }

      return res.json({
        success: true,
        message: "Order placed successfully",
        order: savedOrder,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        error: "Order failed",
      });
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({
          success: true,
          message: "Order updated successfully",
        });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
