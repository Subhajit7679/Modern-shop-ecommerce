
import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Check,
  LoaderCircle,
  MessageSquare,
  Ruler,
  ArrowUpRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { getSingleProduct } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

const PRODUCT_IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const getProductImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/600x600?text=No+Image";
  }

  return image.startsWith("http")
    ? image
    : `${PRODUCT_IMAGE_BASE}${image}`;
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getProductQuantity,
  } = useContext(CartContext);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  // FETCH PRODUCT
  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);
        setRelatedProducts([]);
        setSelectedImage("");
        setSelectedSize("");

        const data = await getSingleProduct(id);

        if (!active) return;

        const productData = data?.product;

        if (!productData) {
          toast.error("Product not found");
          return;
        }

        setProduct(productData);
        setSelectedImage(productData.pImages?.[0] || "");

        if (productData.pCategory?._id) {
          try {
            const relatedResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/product/related-products`,
              {
                params: {
                  categoryId: productData.pCategory._id,
                  productId: productData._id,
                },
              }
            );

            if (active) {
              setRelatedProducts(
                relatedResponse.data.products || []
              );
            }
          } catch (error) {
            console.error("Related products error:", error);
          }
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        if (active) {
          toast.error("Unable to load product");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#171715] px-5 sm:px-8 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-[#242420] aspect-[4/5]" />

          <div className="space-y-6 pt-5">
            <div className="bg-[#242420] h-4 w-36" />
            <div className="bg-[#242420] h-12 w-4/5" />
            <div className="bg-[#242420] h-5 w-40" />
            <div className="bg-[#242420] h-28 w-full" />
            <div className="bg-[#242420] h-12 w-48" />
            <div className="bg-[#242420] h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#171715] text-white flex flex-col items-center justify-center px-6 text-center">
        <Package size={42} className="text-[#c7b99d] mb-5" />
        <h2 className="text-3xl font-semibold mb-3">
          Product unavailable
        </h2>
        <p className="text-zinc-500 mb-8">
          This product could not be found.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#c7b99d] text-[#171715] px-7 py-4 text-xs uppercase tracking-[2px] font-bold"
        >
          Back To Shop
        </button>
      </div>
    );
  }

  const quantity = getProductQuantity(product._id, selectedSize);

  const totalReviews = product.pRatingsReviews?.length || 0;

  const averageRating =
    totalReviews > 0
      ? (
          product.pRatingsReviews.reduce(
            (acc, item) => acc + Number(item.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const selectedSizeStock =
    product.pSizes?.find(
      (item) => item.size === selectedSize
    )?.quantity || 0;

  const totalStock =
    product.pSizes?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) || 0;

  const isWishlisted = isInWishlist(product._id);

  const handleIncrease = () => {
    if (!selectedSize) {
      return toast.error("Please select a size");
    }

    if (quantity >= selectedSizeStock) {
      return toast.error("Stock limit reached");
    }

    increaseQuantity(product._id, selectedSize);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return toast.error("Please select a size");
    }

    if (selectedSizeStock <= 0) {
      return toast.error("This size is out of stock");
    }

    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
    });
  };

  // REVIEW SUBMISSION
  const handleReviewSubmit = async () => {
    if (!rating) {
      return toast.error("Please select a rating");
    }

    if (!review.trim()) {
      return toast.error("Please write your review");
    }

    try {
      setReviewLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/product/add-review`,
        {
          productId: product._id,
          user: "Subhajit",
          rating,
          review: review.trim(),
        }
      );

      if (response.data.success === false) {
        return toast.error(
          response.data.message || "Review failed"
        );
      }

      toast.success("Review added successfully");
      setReview("");
      setRating(0);

      // Refresh product data without reloading the entire page.
      const updatedData = await getSingleProduct(id);

      if (updatedData?.product) {
        setProduct(updatedData.product);
      }
    } catch (error) {
      console.error("Review error:", error);
      toast.error(
        error.response?.data?.message || "Review failed"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRelatedProduct = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#171715] text-white overflow-hidden">

      {/* BACKGROUND LIGHT */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-180px] right-[-150px] w-[500px] h-[500px] rounded-full bg-[#c7b99d]/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 left-[-180px] w-[450px] h-[450px] rounded-full bg-[#a18e6d]/[0.04] blur-[150px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16">

        {/* BREADCRUMB */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/shop")}
            className="group flex items-center gap-3 text-zinc-500 hover:text-[#c7b99d] transition text-xs uppercase tracking-[2px]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back To Collection
          </button>

          <p className="hidden sm:block text-[10px] uppercase tracking-[3px] text-zinc-700">
            Modern Shop / Product
          </p>
        </div>

        {/* MAIN PRODUCT */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-20 items-start">

         

{/* PRODUCT GALLERY */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  className="w-full max-w-[450px] mx-auto lg:mr-auto"
>
  {/* MAIN IMAGE */}
  <div className="relative bg-[#20201d] border border-white/[0.08] overflow-hidden">
    {/* Label */}
    <div className="absolute top-4 left-4 z-10">
      <span className="bg-[#171715]/80 backdrop-blur-md border border-white/10 px-3 py-2 text-[9px] uppercase tracking-[2px] text-[#c7b99d]">
        Modern Shop Selection
      </span>
    </div>

    {/* Wishlist */}
    <button
      onClick={() =>
        isWishlisted
          ? removeFromWishlist(product._id)
          : addToWishlist(product)
      }
      aria-label={
        isWishlisted ? "Remove from wishlist" : "Add to wishlist"
      }
      className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center border backdrop-blur-md transition ${
        isWishlisted
          ? "bg-[#c7b99d] text-[#171715] border-[#c7b99d]"
          : "bg-[#171715]/80 text-white border-white/10 hover:text-[#c7b99d]"
      }`}
    >
      <Heart
        size={17}
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>

    {/* Product Image */}
    <div className="flex items-center justify-center p-5 sm:p-7">
      <img
        src={getProductImageUrl(selectedImage)}
        alt={product.pName}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/500x600?text=No+Image";
        }}
        className="w-full h-[320px] sm:h-[390px] object-contain transition-transform duration-700 hover:scale-[1.04]"
      />
    </div>

    {/* Bottom Signature */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c7b99d]/30 to-transparent" />
  </div>

  {/* THUMBNAILS */}
  {product.pImages?.length > 1 && (
    <div className="flex items-center justify-center gap-3 mt-4">
      {product.pImages.map((img, index) => (
        <button
          key={`${img}-${index}`}
          type="button"
          onClick={() => setSelectedImage(img)}
          aria-label={`View product image ${index + 1}`}
          className={`shrink-0 w-[62px] sm:w-[70px] bg-[#20201d] border overflow-hidden transition-all duration-300 ${
            selectedImage === img
              ? "border-[#c7b99d]"
              : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/40"
          }`}
        >
          <img
            src={getProductImageUrl(img)}
            alt={`${product.pName} view ${index + 1}`}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/200x200?text=No+Image";
            }}
            className="w-full aspect-square object-contain p-1"
          />
        </button>
      ))}
    </div>
  )}
</motion.div>



          {/* PRODUCT INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-9 h-px bg-[#c7b99d]" />
              <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                Product Details
              </p>
            </div>

            <p className="text-zinc-500 text-xs uppercase tracking-[3px] mb-4">
              {product.pCategory?.cName || "Collection"}
            </p>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-[-2px] leading-[1.08]">
              {product.pName}
            </h1>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-4 mt-7">
              <div className="flex items-center gap-1 text-[#c7b99d]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={
                      star <= Math.round(Number(averageRating))
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      star <= Math.round(Number(averageRating))
                        ? ""
                        : "text-zinc-700"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-zinc-400">
                {averageRating} / 5
              </span>

              <span className="w-px h-4 bg-zinc-700" />

              <span className="text-xs text-zinc-500">
                {totalReviews} customer reviews
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-9 pb-8 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500 mb-3">
                Price
              </p>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#c7b99d]">
                  {formatPrice(product.pPrice)}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="py-8 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500 mb-4">
                Description
              </p>

              <p className="text-zinc-400 leading-8 text-sm sm:text-base">
                {product.pDescription}
              </p>
            </div>

            {/* STOCK STATUS */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500">
                Availability
              </p>

              {totalStock === 0 ? (
                <span className="text-red-400 text-xs uppercase tracking-[2px]">
                  Out Of Stock
                </span>
              ) : selectedSize ? (
                selectedSizeStock <= 3 ? (
                  <span className="text-orange-400 text-xs uppercase tracking-[2px]">
                    Only {selectedSizeStock} Left
                  </span>
                ) : (
                  <span className="text-emerald-400 text-xs uppercase tracking-[2px] flex items-center gap-2">
                    <Check size={14} />
                    In Stock
                  </span>
                )
              ) : (
                <span className="text-zinc-500 text-xs">
                  Select a size to check stock
                </span>
              )}
            </div>

            {/* SIZE SELECTOR */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-[#c7b99d]" />
                  <h2 className="text-xs uppercase tracking-[2px] font-semibold">
                    Select Size
                  </h2>
                </div>

                {selectedSize && (
                  <span className="text-xs text-[#c7b99d]">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>

              {product.pSizes?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {product.pSizes.map((item, index) => {
                    const isSelected = selectedSize === item.size;
                    const isUnavailable = item.quantity <= 0;

                    return (
                      <button
                        key={`${item.size}-${index}`}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => setSelectedSize(item.size)}
                        className={`relative min-w-[58px] h-[56px] px-4 border text-sm font-semibold transition-all duration-300 ${
                          isSelected
                            ? "bg-[#c7b99d] border-[#c7b99d] text-[#171715]"
                            : "bg-transparent border-white/15 text-zinc-300 hover:border-[#c7b99d] hover:text-[#c7b99d]"
                        } ${
                          isUnavailable
                            ? "opacity-30 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {item.size}

                        {isUnavailable && (
                          <span className="absolute inset-0 flex items-center justify-center text-red-400 text-3xl font-light">
                            /
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Size information unavailable.
                </p>
              )}
            </div>

            {/* CART ACTIONS */}
            <div className="mt-10">
              {totalStock === 0 ? (
                <button
                  disabled
                  className="w-full bg-white/5 text-zinc-500 border border-white/10 py-5 text-xs uppercase tracking-[3px] cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              ) : quantity > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border border-white/10 p-4">
                    <span className="text-[10px] uppercase tracking-[2px] text-zinc-500">
                      Quantity
                    </span>

                    <div className="flex items-center gap-6">
                      <button
                        onClick={() =>
                          decreaseQuantity(product._id, selectedSize)
                        }
                        aria-label="Decrease quantity"
                        className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-[#c7b99d] hover:text-[#c7b99d] transition"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="text-lg font-semibold min-w-[20px] text-center">
                        {quantity}
                      </span>

                      <button
                        onClick={handleIncrease}
                        aria-label="Increase quantity"
                        disabled={quantity >= selectedSizeStock}
                        className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-[#c7b99d] hover:text-[#c7b99d] transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/cart")}
                    className="group w-full bg-[#c7b99d] text-[#171715] py-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ded2bb] transition"
                  >
                    <ShoppingBag size={17} />
                    View Shopping Bag
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || selectedSizeStock <= 0}
                  className="group w-full bg-[#c7b99d] text-[#171715] py-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ded2bb] transition disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={17} />
                  {!selectedSize
                    ? "Select A Size"
                    : "Add To Shopping Bag"}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              )}
            </div>

            {/* WISHLIST */}
            <button
              onClick={() =>
                isWishlisted
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)
              }
              className={`w-full mt-4 border py-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[2px] transition ${
                isWishlisted
                  ? "border-[#c7b99d] text-[#c7b99d] bg-[#c7b99d]/[0.06]"
                  : "border-white/15 text-zinc-300 hover:border-[#c7b99d] hover:text-[#c7b99d]"
              }`}
            >
              <Heart
                size={16}
                fill={isWishlisted ? "currentColor" : "none"}
              />
              {isWishlisted
                ? "Remove From Wishlist"
                : "Add To Wishlist"}
            </button>

            {/* SERVICE INFORMATION */}
            <div className="grid grid-cols-3 gap-3 mt-10 pt-8 border-t border-white/10">
              <div className="text-center">
                <Truck
                  size={19}
                  className="text-[#c7b99d] mx-auto mb-3"
                />
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[1px] text-zinc-500">
                  Delivery
                </p>
              </div>

              <div className="text-center border-x border-white/10">
                <ShieldCheck
                  size={19}
                  className="text-[#c7b99d] mx-auto mb-3"
                />
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[1px] text-zinc-500">
                  Secure Payment
                </p>
              </div>

              <div className="text-center">
                <RotateCcw
                  size={19}
                  className="text-[#c7b99d] mx-auto mb-3"
                />
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[1px] text-zinc-500">
                  Easy Support
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 md:mt-36">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-[#c7b99d]" />
                  <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                    Curated For You
                  </p>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  You May Also Like<span className="text-[#c7b99d]">.</span>
                </h2>
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-zinc-400 hover:text-[#c7b99d] transition"
              >
                Explore Collection
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleRelatedProduct(item._id)}
                  className="group text-left"
                >
                  <div className="relative bg-[#22221f] overflow-hidden border border-white/[0.06]">
                    <img
                      src={getProductImageUrl(item.pImages?.[0])}
                      alt={item.pName}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/400x500?text=No+Image";
                      }}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <span className="absolute bottom-3 right-3 w-9 h-9 bg-[#c7b99d] text-[#171715] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-[#c7b99d] transition line-clamp-1">
                      {item.pName}
                    </h3>

                    <p className="text-[#c7b99d] text-sm mt-2">
                      {formatPrice(item.pPrice)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOMER REVIEWS */}
        <section className="mt-28 md:mt-36">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">

            {/* REVIEW INTRO */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-[#c7b99d]" />
                <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                  Customer Feedback
                </p>
              </div>

              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                What People
                <br />
                <span className="text-[#c7b99d]">Are Saying.</span>
              </h2>

              <p className="text-zinc-500 text-sm leading-7 mt-6 max-w-sm">
                Discover what customers think about this product.
                Your feedback helps others make confident choices.
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-semibold text-[#c7b99d]">
                    {averageRating}
                  </span>

                  <div>
                    <div className="flex gap-1 text-[#c7b99d] mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={
                            star <= Math.round(Number(averageRating))
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-500">
                      Based on {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEW FORM AND LIST */}
            <div>
              {/* REVIEW FORM */}
              <div className="bg-[#20201d] border border-white/10 p-6 sm:p-9">
                <div className="flex items-center gap-3 mb-7">
                  <MessageSquare
                    size={18}
                    className="text-[#c7b99d]"
                  />
                  <h3 className="text-lg font-semibold">
                    Write A Review
                  </h3>
                </div>

                <p className="text-xs text-zinc-500 mb-4">
                  Select your rating
                </p>

                <div className="flex gap-2 mb-7">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={
                          rating >= star
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          rating >= star
                            ? "text-[#c7b99d]"
                            : "text-zinc-600"
                        }
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={5}
                  placeholder="Share your experience with this product..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full resize-y bg-[#111110] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#c7b99d]/60 transition"
                />

                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewLoading}
                  className="mt-5 bg-[#c7b99d] text-[#171715] px-8 py-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ded2bb] transition disabled:opacity-60"
                >
                  {reviewLoading ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      Submit Review
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* REVIEW LIST */}
              <div className="mt-10">
                <div className="flex items-center justify-between mb-7">
                  <h3 className="text-xl font-semibold">
                    Customer Reviews
                  </h3>

                  <span className="text-xs text-zinc-500">
                    {totalReviews} total
                  </span>
                </div>

                {totalReviews === 0 ? (
                  <div className="border border-white/10 p-8 text-center">
                    <MessageSquare
                      size={25}
                      className="text-[#c7b99d] mx-auto mb-4"
                    />
                    <p className="text-zinc-300 font-medium">
                      No reviews yet
                    </p>
                    <p className="text-zinc-600 text-xs mt-2">
                      Be the first to share your experience.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.pRatingsReviews.map((item, index) => {
                      const reviewerName = item.user || "Customer";

                      return (
                        <div
                          key={item._id || index}
                          className="border border-white/10 bg-[#1d1d1a] p-6 sm:p-7"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 shrink-0 rounded-full bg-[#c7b99d]/10 border border-[#c7b99d]/20 text-[#c7b99d] flex items-center justify-center text-lg font-semibold">
                                {reviewerName.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-zinc-200">
                                  {reviewerName}
                                </h4>

                                <p className="text-[10px] uppercase tracking-[2px] text-emerald-500 mt-1">
                                  Customer Review
                                </p>
                              </div>
                            </div>

                            <p className="text-[10px] text-zinc-600">
                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : ""}
                            </p>
                          </div>

                          <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill={
                                  star <= Number(item.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  star <= Number(item.rating)
                                    ? "text-[#c7b99d]"
                                    : "text-zinc-700"
                                }
                              />
                            ))}
                          </div>

                          <p className="text-sm text-zinc-400 leading-7">
                            {item.review}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SIGNATURE */}
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[3px] text-zinc-600">
            Modern Shop / Product Experience
          </p>

          <p className="text-[10px] uppercase tracking-[2px] text-zinc-700">
            Style. Quality. Simplicity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
