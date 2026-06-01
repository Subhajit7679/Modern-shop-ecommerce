const express =
  require("express");

const router =
  express.Router();

const couponController =
  require("../controller/coupons");

router.post(
  "/create-coupon",
  couponController.createCoupon
);

router.post(
  "/apply-coupon",
  couponController.applyCoupon
);

router.get(
  "/all-coupons",
  couponController.getAllCoupons
);

module.exports = router;