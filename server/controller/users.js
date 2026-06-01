const userModel = require("../models/users");
const bcrypt = require("bcryptjs");

class User {
  // =========================
  // GET ALL USERS
  // =========================

  async getAllUser(req, res) {
    try {
      const users = await userModel.find({}).sort({ _id: -1 });

      return res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // GET SINGLE USER
  // =========================

  async getSingleUser(req, res) {
    try {
      const { uId } = req.body;

      if (!uId) {
        return res.json({
          success: false,
          message: "User ID required",
        });
      }

      const user = await userModel.findById(uId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // EDIT USER PROFILE
  // =========================

  async postEditUser(req, res) {
    try {
      const { uId, name, email, phoneNumber } = req.body;

      if (!uId || !name || !email) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      // CHECK EMAIL ALREADY EXISTS
      const existingEmail = await userModel.findOne({
        email,
        _id: { $ne: uId },
      });

      if (existingEmail) {
        return res.json({
          success: false,
          message: "Email already exists",
        });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        uId,
        {
          name,
          email,
          phoneNumber,
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // ADD ADDRESS
  // =========================

  async addAddress(req, res) {
    try {
      const { uId, address } = req.body;

      if (!uId || !address) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const user = await userModel.findById(uId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      // MAX 5 ADDRESS LIMIT
      if (user.addresses.length >= 5) {
        return res.json({
          success: false,
          message: "Maximum 5 addresses allowed",
        });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        uId,
        {
          $push: {
            addresses: address,
          },
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Address added successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // EDIT ADDRESS
  // =========================

  async editAddress(req, res) {
    try {
      const { uId, addressId, address } = req.body;

      if (!uId || !addressId || !address) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const user = await userModel.findById(uId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      const updatedAddresses = user.addresses.map((item) =>
        item._id.toString() === addressId
          ? {
              ...item.toObject(),
              ...address,
            }
          : item
      );

      user.addresses = updatedAddresses;

      await user.save();

      return res.json({
        success: true,
        message: "Address updated successfully",
        addresses: user.addresses,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // DELETE ADDRESS
  // =========================

  async deleteAddress(req, res) {
    try {
      const { uId, addressId } = req.body;

      if (!uId || !addressId) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const user = await userModel.findById(uId);

      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }

      user.addresses = user.addresses.filter(
        (item) => item._id.toString() !== addressId
      );

      await user.save();

      return res.json({
        success: true,
        message: "Address deleted successfully",
        addresses: user.addresses,
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Server error",
      });
    }
  }

  // =========================
  // CHANGE PASSWORD
  // =========================

  async changePassword(req, res) {
    try {
      let { uId, oldPassword, newPassword } = req.body;

      if (!uId || !oldPassword || !newPassword) {
        return res.json({
          success: false,
          message: "All fields required",
        });
      }

      const user = await userModel.findById(uId);

      if (!user) {
        return res.json({
          success: false,
          message: "Invalid user",
        });
      }

      const oldPassCheck = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!oldPassCheck) {
        return res.json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await userModel.findByIdAndUpdate(uId, {
        password: hashedPassword,
      });

      return res.json({
        success: true,
        message: "Password updated successfully",
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

const usersController = new User();

module.exports = usersController;