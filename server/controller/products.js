const productModel = require("../models/products");
const cloudinary = require("../config/cloudinary");

class Product {
  // Delete Image from uploads -> products folder
  
static async deleteImages(images = []) {
  for (const image of images) {
    try {
      // Keep old local filenames untouched.
      if (
        !image ||
        typeof image !== "string" ||
        !image.includes("res.cloudinary.com")
      ) {
        continue;
      }

      const url = new URL(image);
      const uploadIndex = url.pathname.indexOf("/upload/");

      if (uploadIndex === -1) continue;

      const pathAfterUpload = url.pathname
        .substring(uploadIndex + 8)
        .split("/");

      // Find the Cloudinary version segment.
      const versionIndex = pathAfterUpload.findIndex((part) =>
        /^v\d+$/.test(part)
      );

      if (versionIndex === -1) continue;

      const publicId = pathAfterUpload
        .slice(versionIndex + 1)
        .join("/")
        .replace(/\.[^/.]+$/, "");

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Cloudinary image deletion failed:", error.message);
    }
  }
}

  
async postAddProduct(req, res) {
  try {
    const {
      pName,
      pDescription,
      pPrice,
      pCategory,
      pGender,
    } = req.body;

    // Save Cloudinary image URLs
    const pImages = req.files?.length
      ? req.files.map((file) => file.path)
      : ["default.png"];

    if (!pName || !pDescription || !pPrice || !pCategory) {
      return res.json({
        error: "All fields required",
      });
    }

    const newProduct = new productModel({
      pName,
      pDescription,
      pPrice,
      pCategory,
      pGender,
      pSizes: JSON.parse(req.body.pSizes),
      pOffer: "No",
      pStatus: "Active",
      pImages,
    });

    await newProduct.save();

    return res.json({
      success: "Product created successfully",
    });
  } catch (err) {
  console.error("ADD PRODUCT ERROR:", err);
  console.error("Error message:", err?.message);
  console.error("Cloudinary details:", err?.error);

  return res.status(500).json({
    error: err?.message || "Product save failed",
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
      existingImages,
    } = req.body;

    const newImages = req.files || [];

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

    // Find the existing product
    const oldProduct = await productModel.findById(pId);

    if (!oldProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Read images that the admin wants to keep
    let keptImages = oldProduct.pImages || [];

    if (existingImages !== undefined) {
      const parsedImages = JSON.parse(existingImages);

      if (!Array.isArray(parsedImages)) {
        return res.status(400).json({
          error: "Invalid existing images",
        });
      }

      // Only allow images that already belong to this product
      keptImages = parsedImages.filter((image) =>
        (oldProduct.pImages || []).includes(image)
      );
    }

    // Add newly uploaded Cloudinary image URLs
    const newImageUrls = newImages.map((file) => file.path);

    const finalImages = [...keptImages, ...newImageUrls];

    const editData = {
      pName,
      pDescription,
      pPrice,
      pCategory,
      pOffer,
      pStatus,
      pSizes: JSON.parse(pSizes),
      pImages: finalImages.length > 0 ? finalImages : ["default.png"],
    };

    // Update product in MongoDB
    const updatedProduct = await productModel.findByIdAndUpdate(
      pId,
      editData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Product update failed",
      });
    }

    // Delete only images removed by the admin
    const removedImages = (oldProduct.pImages || []).filter(
      (image) => !keptImages.includes(image)
    );

    if (removedImages.length > 0) {
      await Product.deleteImages(removedImages);
    }

    return res.json({
      success: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Product Update Error:", err);

    return res.status(500).json({
      error: "Product update failed",
    });
  }
}


  
async getDeleteProduct(req, res) {
  try {
    const { pId } = req.body;

    if (!pId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }

    // Find product before deleting
    const product = await productModel.findById(pId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Delete product from MongoDB
    await productModel.findByIdAndDelete(pId);

    // Delete its Cloudinary images
    await Product.deleteImages(product.pImages || []);

    return res.json({
      success: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: "Product deletion failed",
    });
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
