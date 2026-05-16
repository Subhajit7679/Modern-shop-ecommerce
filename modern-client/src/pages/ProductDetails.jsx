import { useEffect, useState, useContext } from "react";

import { useParams } from "react-router-dom";

import { getSingleProduct } from "../services/productService";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

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

  useEffect(() => {

    const fetchProduct = async () => {

      const data = await getSingleProduct(id);

      setProduct(data.product);

    };

    fetchProduct();

  }, [id]);

  if (!product) {

    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white text-3xl">
        Loading...
      </div>
    );
  }

  const quantity = getProductQuantity(product._id);

  return (
    <div className="bg-black min-h-screen text-white px-8 md:px-16 py-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* IMAGE */}
        <div>

          <img
            src={`http://localhost:8000/uploads/products/${product.pImages?.[0]}`}
            alt={product.pName}
            className="w-full rounded-3xl border border-zinc-800"
          />

        </div>

        {/* INFO */}
        <div>

          <p className="uppercase tracking-[5px] text-zinc-500 mb-5">
            Premium Product
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            {product.pName}
          </h1>

          <p className="text-zinc-400 text-lg mt-8 leading-relaxed">
            {product.pDescription}
          </p>

          <div className="mt-10">

            <span className="text-5xl font-bold">
              ₹ {product.pPrice}
            </span>

          </div>

          <div className="mt-10">

            {quantity > 0 ? (

              <div className="flex items-center gap-5">

                <button
                  onClick={() => decreaseQuantity(product._id)}
                  className="bg-white text-black w-12 h-12 rounded-full text-2xl font-bold"
                >
                  -
                </button>

                <span className="text-2xl font-bold">
                  {quantity}
                </span>

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

    </div>
  );
}

export default ProductDetails;