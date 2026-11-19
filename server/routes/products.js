
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const productController = require("../controller/products");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "modern-shop/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/* GET ALL PRODUCTS */
router.get("/all-product", productController.getAllProduct);

/* GET SINGLE PRODUCT */
router.get("/single-product/:id", async (req, res) => {
  req.body.pId = req.params.id;
  return productController.getSingleProduct(req, res);
});

/* ADD PRODUCT */


router.post("/add-product", (req, res, next) => {
  upload.array("pImages", 5)(req, res, (err) => {
    if (err) {
      console.error("========== CLOUDINARY UPLOAD ERROR ==========");
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Full error:", err);
      console.error("==============================================");

      return res.status(500).json({
        success: false,
        error: err.message || "Image upload failed",
      });
    }

    console.log("========== IMAGE UPLOAD SUCCESS ==========");
    console.log("Files received:", req.files?.length);
    console.log("Image URLs:", req.files?.map(file => file.path));
    console.log("==========================================");

    return productController.postAddProduct(req, res, next);
  });
});





/* PRODUCT COUNT */
router.get("/product-count", productController.productCount);

/* EDIT PRODUCT */
router.put(
  "/edit-product/:id",
  upload.array("pImages", 2),
  async (req, res) => {
    req.body.pId = req.params.id;
    return productController.postEditProduct(req, res);
  }
);

/* DELETE PRODUCT */
router.delete("/delete-product/:id", async (req, res) => {
  req.body.pId = req.params.id;
  return productController.getDeleteProduct(req, res);
});

/* FILTER PRODUCTS */
router.post("/filter-products", productController.filterProducts);

/* PAGINATION */
router.get("/paginate-products", productController.paginateProducts);

/* RELATED PRODUCTS */
router.get("/related-products", productController.relatedProducts);

/* ADD REVIEW */
router.post("/add-review", productController.addReview);

/* SEARCH */
router.get("/search", productController.searchProduct);

module.exports = router;
