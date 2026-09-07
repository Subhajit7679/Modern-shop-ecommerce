const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const fs = require("fs");

class Category {
  async getAllCategory(req, res) {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });

      if (Categories) {
        return res.json({
          categories: Categories,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async postAddCategory(req, res) {
    try {
      console.log(req.body);

      let { cName, cGender } = req.body;

      if (!cName) {
        return res.json({
          error: "Category name is required",
        });
      }

      const newCategory = new categoryModel({
        cName,
        cGender,
      });

      console.log(newCategory);

      await newCategory.save();

      console.log("CATEGORY SAVED");

      return res.json({
        success: "Category created successfully",
      });
    } catch (err) {
      console.log("SAVE ERROR:", err);

      return res.json({
        error: "Something went wrong",
      });
    }
  }

  async postEditCategory(req, res) {
    let { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editCategory = categoryModel.findByIdAndUpdate(cId, {
        cDescription,
        cStatus,
        updatedAt: Date.now(),
      });
      let edit = await editCategory.exec();
      if (edit) {
        return res.json({ success: "Category edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getDeleteCategory(req, res) {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(cId);
        const filePath = `../server/public/uploads/categories/${deletedCategoryFile.cImage}`;

        let deleteCategory = await categoryModel.findByIdAndDelete(cId);
        if (deleteCategory) {
          // Delete Image from uploads -> categories folder
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Category deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
