const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cName: {
      type: String,
      required: true,
    },

    cDescription: {
      type: String,
      default: "",
    },

    cImage: {
      type: String,
      default: "default.png",
    },

    cStatus: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;