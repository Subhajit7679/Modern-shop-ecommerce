import { useContext, useState } from "react";

import { WishlistContext } from "../context/WishlistContext";

import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);
  const [selectedSizes, setSelectedSizes] = useState({});

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
                  src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${product.pImages?.[0]}`}
                  alt={product.pName}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold">{product.pName}</h2>

                  <p className="text-zinc-400 text-sm mt-2">
                    {product.pDescription}
                  </p>

                  <div className="mt-5">
                    <span className="text-2xl font-bold">
                      ₹ {product.pPrice}
                    </span>
                  </div>

                  {/* SIZE SELECTOR */}

                  <div className="mt-5">
                    <p className="text-sm text-zinc-400 mb-3">Select Size</p>

                    <div className="flex gap-3 flex-wrap">
                      {product.pSizes?.map((sizeItem, index) => (
                        <button
                          key={index}
                          disabled={sizeItem.quantity <= 0}
                          onClick={() =>
                            setSelectedSizes({
                              ...selectedSizes,

                              [product._id]: sizeItem.size,
                            })
                          }
                          className={`
              relative
              w-12
              h-12
              rounded-xl
              border
              text-sm
              font-bold
              transition

              ${
                selectedSizes[product._id] === sizeItem.size
                  ? "bg-white text-black border-white"
                  : "border-zinc-700 text-white"
              }

              ${
                sizeItem.quantity <= 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-800"
              }
            `}
                        >
                          {sizeItem.size}

                          {sizeItem.quantity <= 0 && (
                            <span
                              className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-red-500
                  text-2xl
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

                  {/* ACTION BUTTONS */}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        const selectedSize = selectedSizes[product._id];

                        if (!selectedSize) {
                          return alert("Please select size");
                        }

                        addToCart({
                          ...product,
                          selectedSize,
                          quantity: 1,
                        });
                      }}
                      className="
        bg-white
        text-black
        px-4
        py-3
        rounded-xl
        font-semibold
        flex-1
      "
                    >
                      Add To Cart
                    </button>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="
        border
        border-zinc-700
        px-4
        py-3
        rounded-xl
      "
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
