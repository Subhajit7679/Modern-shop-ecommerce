const orderModel = require("../models/orders");
const productModel = require("../models/products");
const userModel = require("../models/users");

class Dashboard {
  async getDashboardData(req, res) {
    try {
      // TOTAL PRODUCTS
      const totalProducts = await productModel.countDocuments();

      // TOTAL ORDERS
      const totalOrders = await orderModel.countDocuments();

      // DELIVERED ORDERS
      const deliveredOrders = await orderModel.countDocuments({
        status: "Delivered",
      });

      //Shipped order
      const shippedOrders = await orderModel.countDocuments({
        status: "Shipped",
      });

      //PROCESSING order
      const processingOrders = await orderModel.countDocuments({
        status: "Processing",
      });

      //CANCELLED order
      const cancelledOrders = await orderModel.countDocuments({
        status: "Cancelled",
      });

      // TOTAL REVENUE
      const revenueData = await orderModel.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

      const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

      // RECENT ORDERS
      const recentOrders = await orderModel
        .find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

      // RECENT USERS
      const recentUsers = await userModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        totalProducts,
        totalOrders,
        deliveredOrders,
        shippedOrders,
        processingOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders,
        recentUsers,
      });
    } catch (err) {
      console.log(err);

      return res.json({
        error: "Dashboard error",
      });
    }
  }
}

const dashboardController = new Dashboard();

module.exports = dashboardController;
