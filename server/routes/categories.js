const express = require("express");
const router = express.Router();

const categoryController = require("../controller/categories");

router.get(
  "/all-category",
  categoryController.getAllCategory
);

router.post(
  "/add-category",
  categoryController.postAddCategory
);

module.exports = router;