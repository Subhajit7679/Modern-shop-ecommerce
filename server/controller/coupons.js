const couponModel = require("../models/coupons");

class Coupon {
  async createCoupon(req, res) {
    try {
      const { code, discountPercent, minAmount, expiryDate } = req.body;

      if (!code || !discountPercent || !expiryDate) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const existingCoupon = await couponModel.findOne({
        code,
      });

      if (existingCoupon) {
        return res.json({
          success: false,
          message: "Coupon already exists",
        });
      }

      const newCoupon = new couponModel({
        code,
        discountPercent,
        minAmount,
        expiryDate,
      });

      await newCoupon.save();

      return res.json({
        success: true,
        message: "Coupon created successfully",
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  async getAllCoupons(req, res) {
    try {
      const coupons = await couponModel.find({}).sort({ createdAt: -1 });

      return res.json({
        success: true,

        coupons,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,

        message: "Server error",
      });
    }
  }

  async applyCoupon(req, res) {
    try {
      const { code, totalAmount } = req.body;

      const coupon = await couponModel.findOne({
        code,
        isActive: true,
      });

      if (!coupon) {
        return res.json({
          success: false,
          message: "Invalid coupon",
        });
      }

      const today = new Date();

      if (new Date(coupon.expiryDate) < today) {
        return res.json({
          success: false,
          message: "Coupon expired",
        });
      }

      if (totalAmount < coupon.minAmount) {
        return res.json({
          success: false,
          message: "Minimum amount not reached",
        });
      }

      const discountAmount = (totalAmount * coupon.discountPercent) / 100;

      const finalAmount = totalAmount - discountAmount;

      return res.json({
        success: true,

        discountAmount,

        finalAmount,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,

        message: "Server error",
      });
    }
  }
}

const couponController = new Coupon();

module.exports = couponController;
