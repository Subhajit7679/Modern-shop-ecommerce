const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");

router.get("/all-user", usersController.getAllUser);
router.post("/single-user", usersController.getSingleUser);

router.post("/edit-user", usersController.postEditUser);
router.post("/add-address", usersController.addAddress);
router.post("/edit-address", usersController.editAddress);

router.post("/delete-address", usersController.deleteAddress);

router.post("/change-password", usersController.changePassword);

module.exports = router;
