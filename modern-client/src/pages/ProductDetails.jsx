import { useEffect, useState, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { getSingleProduct } from "../services/productService";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedImage, setSelectedImage] = useState("");

  const { addToCart, increaseQuantity, decreaseQuantity, getProductQuantity } =
    useContext(CartContext);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [rating, setRating] = useState(0);

  const [review, setReview] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(id);

        setProduct(data.product);

        setSelectedImage(data.product.pImages?.[0]);

        const relatedResponse = await axios.get(
          `http://localhost:8000/api/product/related-products?categoryId=${data.product.pCategory._id}&productId=${data.product._id}`,
        );

        setRelatedProducts(relatedResponse.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  /* LOADING SKELETON */
  if (!product) {
    return (
      <div className="bg-black min-h-screen px-8 md:px-16 py-20 animate-pulse">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="bg-zinc-900 h-[500px] rounded-3xl"></div>

          <div>
            <div className="bg-zinc-900 h-6 w-40 rounded mb-6"></div>

            <div className="bg-zinc-900 h-14 w-96 rounded mb-8"></div>

            <div className="bg-zinc-900 h-32 w-full rounded mb-8"></div>

            <div className="bg-zinc-900 h-12 w-40 rounded mb-8"></div>

            <div className="bg-zinc-900 h-16 w-60 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const quantity = getProductQuantity(product._id, selectedSize);

  const totalReviews = product.pRatingsReviews?.length || 0;

  const averageRating =
    totalReviews > 0
      ? (
          product.pRatingsReviews.reduce(
            (acc, item) => acc + Number(item.rating),
            0,
          ) / totalReviews
        ).toFixed(1)
      : 0;

  const handleReviewSubmit = async () => {
    if (!rating) {
      return toast.error("Please select rating");
    }

    if (!review.trim()) {
      return toast.error("Please write review");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/product/add-review",
        {
          productId: product._id,
          user: "Subhajit",
          rating,
          review,
        },
      );

      console.log(response.data);

      toast.success("Review Added");

      window.location.reload();
    } catch (err) {
      console.log(err);

      toast.error("Review failed");
    }
  };

  const selectedSizeStock =
    product?.pSizes?.find((item) => item.size === selectedSize)?.quantity || 0;

  const totalStock =
    product?.pSizes?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleIncrease = () => {
    if (quantity >= selectedSizeStock) {
      return toast.error("Stock limit reached");
    }

    increaseQuantity(product._id, selectedSize);
  };

  return (
    <div className="bg-black min-h-screen text-white px-8 md:px-16 py-20">
      {/* MAIN PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* IMAGE */}
        {/* IMAGE GALLERY */}
        <div>
          {/* MAIN IMAGE */}
          <div className="overflow-hidden rounded-3xl border border-zinc-800">
            <img
              src={
                selectedImage
                  ? `http://localhost:8000/uploads/products/${selectedImage}`
                  : "https://placehold.co/600x600?text=No+Image"
              }
              alt={product.pName}
              className="w-full h-[600px] object-cover hover:scale-110 transition duration-500"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {product.pImages?.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition ${
                  selectedImage === img ? "border-white" : "border-zinc-800"
                }`}
              >
                <img
                  src={`http://localhost:8000/uploads/products/${img}`}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="uppercase tracking-[5px] text-zinc-500 mb-5">
            Premium Product
          </p>

          <h1 className="text-5xl font-bold leading-tight">{product.pName}</h1>

          <div className="flex items-center gap-4 mt-5">
            {/* STARS */}
            <div className="flex text-yellow-400 text-2xl">
              {"★".repeat(Math.round(averageRating))}
            </div>

            {/* REVIEW INFO */}
            <p className="text-zinc-400 text-lg">
              {averageRating} ({totalReviews} reviews)
            </p>
          </div>

          <p className="text-zinc-400 text-lg mt-8 leading-relaxed">
            {product.pDescription}
          </p>

          <div className="mt-10">
            <span className="text-5xl font-bold">₹ {product.pPrice}</span>
          </div>

          <div className="mt-4">
            {selectedSize ? (
              selectedSizeStock <= 3 ? (
                <p className="text-orange-400 font-semibold">
                  Only {selectedSizeStock} left
                </p>
              ) : (
                <p className="text-green-500 font-semibold">In Stock</p>
              )
            ) : (
              <p className="text-zinc-500">Select size to check stock</p>
            )}
          </div>

          {/* SIZE SELECTOR */}

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-5">Select Size</h2>

            <div className="flex gap-4 flex-wrap">
              {product.pSizes?.map((item, index) => (
                <button
                  key={index}
                  disabled={item.quantity <= 0}
                  onClick={() => setSelectedSize(item.size)}
                  className={`
      relative
      w-16
      h-16
      rounded-2xl
      border
      text-lg
      font-bold
      transition

      ${
        selectedSize === item.size
          ? "bg-white text-black border-white"
          : "border-zinc-700 text-white"
      }

      ${
        item.quantity <= 0
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-zinc-800"
      }
    `}
                >
                  {item.size}

                  {item.quantity <= 0 && (
                    <span
                      className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-red-500
          text-3xl
          font-bold
        "
                    >
                      /
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CART */}
{/* CART */}

<div className="mt-10">

  {quantity > 0 ? (

    <div
      className="
        flex
        flex-wrap
        items-center
        gap-5
      "
    >

      {/* QUANTITY CONTROLS */}

      <div
        className="
          flex
          items-center
          gap-5
        "
      >

        <button
          onClick={() =>
            decreaseQuantity(
              product._id,
              selectedSize
            )
          }

          className="
            bg-white
            text-black
            w-12
            h-12
            rounded-full
            text-2xl
            font-bold
          "
        >
          -
        </button>

        <span
          className="
            text-2xl
            font-bold
          "
        >
          {quantity}
        </span>

        <button
          onClick={handleIncrease}

          className="
            bg-white
            text-black
            w-12
            h-12
            rounded-full
            text-2xl
            font-bold
          "
        >
          +
        </button>

      </div>

      {/* VIEW CART */}

      <button
        onClick={() =>
          navigate("/cart")
        }

        className="
          bg-green-500
          text-white
          px-8
          py-3
          rounded-2xl
          font-bold
          hover:scale-105
          transition
        "
      >
        View Cart
      </button>

    </div>

  ) : totalStock === 0 ? (

    <button
      disabled

      className="
        bg-red-500/20
        text-red-400
        px-10
        py-5
        rounded-2xl
        font-bold
        text-lg
        cursor-not-allowed
      "
    >
      Out Of Stock
    </button>

  ) : (

    <button
      onClick={() => {

        if (!selectedSize) {

          return toast.error(
            "Please select size"
          );

        }

        addToCart({

          ...product,

          quantity: 1,

          selectedSize,

        });

      }}

      disabled={
        selectedSize &&
        selectedSizeStock <= 0
      }

      className="
        bg-white
        text-black
        px-10
        py-5
        rounded-2xl
        font-bold
        text-lg
        hover:scale-105
        transition
        disabled:bg-zinc-700
        disabled:text-zinc-400
        disabled:cursor-not-allowed
      "
    >
      Add To Cart
    </button>

  )}

</div>
          

          {/* WISHLIST */}
          <button
            onClick={() =>
              isInWishlist(product._id)
                ? removeFromWishlist(product._id)
                : addToWishlist(product)
            }
            className="mt-6 border border-zinc-700 px-10 py-5 rounded-2xl hover:bg-zinc-900 transition"
          >
            {isInWishlist(product._id)
              ? "Remove From Wishlist"
              : "Add To Wishlist"}
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-28">
        <h2 className="text-4xl font-bold mb-12">You May Also Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {relatedProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
              className="bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition"
            >
              <img
                src={`http://localhost:8000/uploads/products/${item.pImages?.[0]}`}
                alt={item.pName}
                className="w-full h-72 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold">{item.pName}</h3>

                <p className="text-zinc-400 mt-2">₹ {item.pPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS SECTION */}

      <div className="mt-28">
        <h2 className="text-4xl font-bold mb-10">Customer Reviews</h2>

        {/* STAR SELECT */}

        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl ${
                rating >= star ? "text-yellow-400" : "text-zinc-600"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* REVIEW INPUT */}

        <textarea
          rows="5"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-white"
        />

        <button
          onClick={handleReviewSubmit}
          className="mt-5 bg-white text-black px-8 py-4 rounded-2xl font-bold"
        >
          Submit Review
        </button>

        {/* REVIEW LIST */}

        <div className="mt-14 space-y-8">
          {Array.isArray(product.pRatingsReviews) &&
            product.pRatingsReviews.map((item, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl"
              >
                {/* TOP */}

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    {/* AVATAR */}

                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                      {item.user?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{item.user}</h3>

                      <p className="text-green-500 text-sm">
                        Verified Purchase
                      </p>
                    </div>
                  </div>

                  {/* DATE */}

                  <p className="text-zinc-500 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* STARS */}

                <div className="flex gap-1 mb-4">
                  {[...Array(Number(item.rating))].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">
                      ★
                    </span>
                  ))}
                </div>

                {/* REVIEW */}

                <p className="text-zinc-300 text-lg leading-relaxed">
                  {item.review}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
