const express = require("express");
const router = express.Router();

const multer = require("multer");

const productController = require("../controller/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

/* GET ALL PRODUCTS */
router.get("/all-product", productController.getAllProduct);

/* GET SINGLE PRODUCT */
router.get("/single-product/:id", async (req, res) => {
  req.body.pId = req.params.id;

  return productController.getSingleProduct(req, res);
});

/* ADD PRODUCT */
router.post(
  "/add-product",
  upload.array("pImages", 5),
  productController.postAddProduct,
);

router.get(
  "/product-count",
  productController.productCount
);

/* EDIT PRODUCT */
router.put(
  "/edit-product/:id",
  upload.array("pImages", 2),
  async (req, res) => {
    req.body.pId = req.params.id;

    return productController.postEditProduct(req, res);
  },
);

/* DELETE PRODUCT */
router.delete("/delete-product/:id", async (req, res) => {
  req.body.pId = req.params.id;

  return productController.getDeleteProduct(req, res);
});


router.post(
  "/filter-products",
  productController.filterProducts
);



router.get(
  "/paginate-products",
  productController.paginateProducts
);

router.get(
  "/related-products",
  productController.relatedProducts
);

router.post(
  "/add-review",
  productController.addReview
);

router.get("/search", productController.searchProduct);

module.exports = router;
