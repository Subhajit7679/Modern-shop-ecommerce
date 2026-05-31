const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");

class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }

  async productCount(req, res) {
    try {
      const totalProducts = await productModel.countDocuments();

      return res.json({
        success: true,
        totalProducts,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      let Products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
      if (Products) {
        return res.json({
          products: Products,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddProduct(req, res) {
    try {
      console.log(req.body);

      let { pName, pDescription, pPrice, pCategory } = req.body;

      // MULTIPLE IMAGES
      let pImages = req.files?.length
        ? req.files.map((file) => file.filename)
        : ["default.png"];

      // VALIDATION
      if (!pName || !pDescription || !pPrice || !pCategory) {
        return res.json({
          error: "All fields required",
        });
      }

      // CREATE PRODUCT
      const newProduct = new productModel({
        pName,
        pDescription,
        pPrice,
        pCategory,

        pSizes: JSON.parse(req.body.pSizes),

        pOffer: "No",
        pStatus: "Active",

        // SAVE MULTIPLE IMAGES
        pImages,
      });

      await newProduct.save();

      console.log("PRODUCT SAVED");

      return res.json({
        success: "Product created successfully",
      });
    } catch (err) {
      console.log(err);

      return res.json({
        error: "Product save failed",
      });
    }
  }

  async postEditProduct(req, res) {
    try {
      const {
        pId,
        pName,
        pDescription,
        pPrice,
        pSizes,
        pCategory,
        pOffer,
        pStatus,
        pImages,
      } = req.body;

      // SAFE FILES
      const editImages = req.files || [];

      // VALIDATION
      if (
        !pId ||
        !pName ||
        !pDescription ||
        !pPrice ||
        !pCategory ||
        !pStatus
      ) {
        return res.json({
          error: "All fields required",
        });
      }

      // UPDATE OBJECT
      let editData = {
        pName,
        pDescription,
        pPrice,
        pCategory,
        pOffer,
        pStatus,

        // IMPORTANT
        pSizes: JSON.parse(pSizes),
      };

      // IF NEW IMAGES UPLOADED
      if (editImages.length > 0) {
        const allEditImages = [];

        for (const img of editImages) {
          allEditImages.push(img.filename);
        }

        editData.pImages = allEditImages;

        // DELETE OLD IMAGES
        if (pImages) {
          Product.deleteImages(pImages.split(","), "string");
        }
      }

      // UPDATE PRODUCT
      const updatedProduct = await productModel.findByIdAndUpdate(
        pId,
        editData,
        {
          new: true,
        },
      );

      return res.json({
        success: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        error: "Product update failed",
      });
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          // Delete Image from uploads -> products folder
          Product.deleteImages(deleteProductObj.pImages, "string");
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;

    if (!pId) {
      return res.json({
        error: "All filled must be required",
      });
    }

    try {
      let singleProduct = await productModel
        .findById(pId)
        .populate("pCategory", "cName");

      return res.json({
        product: singleProduct,
      });
    } catch (err) {
      console.log(err);

      return res.json({
        error: "Product fetch failed",
      });
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "cName");
        if (products) {
          return res.json({ products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  }

  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lt: price } })
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ products: products });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let wishProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (wishProducts) {
          return res.json({ products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let cartProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (cartProducts) {
          return res.json({ products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Cart product wrong" });
      }
    }
  }

  async postAddReview(req, res) {
    let { pId, uId, rating, review } = req.body;
    if (!pId || !rating || !review || !uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      let checkReviewRatingExists = await productModel.findOne({ _id: pId });
      if (checkReviewRatingExists.pRatingsReviews.length > 0) {
        checkReviewRatingExists.pRatingsReviews.map((item) => {
          if (item.user === uId) {
            return res.json({ error: "Your already reviewd the product" });
          } else {
            try {
              let newRatingReview = productModel.findByIdAndUpdate(pId, {
                $push: {
                  pRatingsReviews: {
                    review: review,
                    user: uId,
                    rating: rating,
                  },
                },
              });
              newRatingReview.exec((err, result) => {
                if (err) {
                  console.log(err);
                }
                return res.json({ success: "Thanks for your review" });
              });
            } catch (err) {
              return res.json({ error: "Cart product wrong" });
            }
          }
        });
      } else {
        try {
          let newRatingReview = productModel.findByIdAndUpdate(pId, {
            $push: {
              pRatingsReviews: { review: review, user: uId, rating: rating },
            },
          });
          newRatingReview.exec((err, result) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Thanks for your review" });
          });
        } catch (err) {
          return res.json({ error: "Cart product wrong" });
        }
      }
    }
  }

  async deleteReview(req, res) {
    let { rId, pId } = req.body;
    if (!rId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let reviewDelete = productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        reviewDelete.exec((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "Your review is deleted" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async productCount(req, res) {
    try {
      const totalProducts = await productModel.countDocuments();

      return res.json({
        success: true,
        totalProducts,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }
  }

  async searchProduct(req, res) {
    try {
      const query = req.query.q;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query required",
        });
      }

      const products = await productModel.find({
        $or: [
          {
            pName: {
              $regex: query,
              $options: "i",
            },
          },
          {
            pDescription: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      });

      return res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Search failed",
      });
    }
  }

  async filterProducts(req, res) {
    try {
      const { category, minPrice, maxPrice, sort } = req.body;

      let filter = {};

      // CATEGORY FILTER
      if (category) {
        filter.pCategory = category;
      }

      // PRICE FILTER
      if (minPrice || maxPrice) {
        filter.pPrice = {};

        if (minPrice) {
          filter.pPrice.$gte = minPrice;
        }

        if (maxPrice) {
          filter.pPrice.$lte = maxPrice;
        }
      }

      // SORTING
      let sortOption = {};

      if (sort === "low-high") {
        sortOption.pPrice = 1;
      }

      if (sort === "high-low") {
        sortOption.pPrice = -1;
      }

      if (sort === "newest") {
        sortOption.createdAt = -1;
      }

      const products = await productModel.find(filter).sort(sortOption);

      return res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Filter failed",
      });
    }
  }

  async paginateProducts(req, res) {
    try {
      const page = Number(req.query.page) || 1;

      const limit = Number(req.query.limit) || 8;

      const skip = (page - 1) * limit;

      const totalProducts = await productModel.countDocuments();

      const products = await productModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Pagination failed",
      });
    }
  }

  async relatedProducts(req, res) {
    try {
      const { categoryId, productId } = req.query;

      const products = await productModel
        .find({
          pCategory: categoryId,
          _id: { $ne: productId },
        })
        .limit(4)
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch related products",
      });
    }
  }

  async addReview(req, res) {
    try {
      const { productId, user, rating, review } = req.body;

      // FIND PRODUCT
      const product = await productModel.findById(productId);

      // CHECK PRODUCT
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // NEW REVIEW OBJECT
      const newReview = {
        user,
        rating,
        review,
      };

      // PUSH REVIEW
      product.pRatingsReviews.push(newReview);

      // SAVE PRODUCT
      await product.save();

      return res.json({
        success: true,
        message: "Review added successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Review failed",
      });
    }
  }
}

const productController = new Product();
module.exports = productController;
