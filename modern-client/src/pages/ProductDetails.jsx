import { useEffect, useState, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { getSingleProduct } from "../services/productService";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

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

  const quantity = getProductQuantity(product._id);

  const handleReviewSubmit = async () => {
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

      alert("Review Added");

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  console.log(product);
  console.log(product.pRatingsReviews);
  console.log(selectedImage);

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

          <p className="text-zinc-400 text-lg mt-8 leading-relaxed">
            {product.pDescription}
          </p>

          <div className="mt-10">
            <span className="text-5xl font-bold">₹ {product.pPrice}</span>
          </div>

          {/* CART */}
          <div className="mt-10">
            {quantity > 0 ? (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => decreaseQuantity(product._id)}
                  className="bg-white text-black w-12 h-12 rounded-full text-2xl font-bold"
                >
                  -
                </button>

                <span className="text-2xl font-bold">{quantity}</span>

                <button
                  onClick={() => increaseQuantity(product._id)}
                  className="bg-white text-black w-12 h-12 rounded-full text-2xl font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition"
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
              <div key={index} className="bg-zinc-900 p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(Number(item.rating))].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-zinc-300 text-lg">{item.review}</p>

                <p className="text-zinc-500 text-sm mt-4">— {item.user}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
