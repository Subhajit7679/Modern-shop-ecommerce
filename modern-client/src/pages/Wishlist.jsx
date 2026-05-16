import { useContext } from "react";

import { WishlistContext } from "../context/WishlistContext";

import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-black min-h-screen text-white px-8 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-bold">Wishlist</h1>

          <p className="text-zinc-500">{wishlist.length} Items</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-zinc-500 text-lg">Wishlist is empty</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800"
              >
                <img
                  src={`http://localhost:8000/uploads/products/${product.pImages?.[0]}`}
                  alt={product.pName}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold">{product.pName}</h2>

                  <p className="text-zinc-400 text-sm mt-2">
                    {product.pDescription}
                  </p>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-2xl font-bold">
                      ₹ {product.pPrice}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-white text-black px-4 py-2 rounded-xl"
                    >
                      Add To Cart
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="border border-zinc-700 px-4 py-2 rounded-xl"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
