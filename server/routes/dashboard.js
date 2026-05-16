const express = require("express");

const router = express.Router();

const dashboardController =
  require("../controller/dashboard");

router.get(
  "/data",
  dashboardController.getDashboardData
);

module.exports = router;