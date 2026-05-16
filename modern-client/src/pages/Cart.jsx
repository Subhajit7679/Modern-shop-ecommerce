import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.pPrice * item.quantity,
    0,
  );

  return (
    <div className="bg-black min-h-screen text-white px-8 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold">Shopping Cart</h1>

          <p className="text-zinc-500">{cart.length} Items</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-zinc-500 text-xl">Your cart is empty</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex gap-5"
                >
                  <img
                    src={`http://localhost:8000/uploads/products/${item.pImages?.[0]}`}
                    alt={item.pName}
                    className="w-32 h-32 object-cover rounded-2xl"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{item.pName}</h2>

                    <p className="text-zinc-400 mt-2">₹ {item.pPrice}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="bg-zinc-800 w-10 h-10 rounded-xl text-xl"
                      >
                        -
                      </button>

                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="bg-zinc-800 w-10 h-10 rounded-xl text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl h-fit"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-fit sticky top-28">
              <h2 className="text-3xl font-bold mb-8">Summary</h2>

              <div className="flex items-center justify-between text-lg mb-5">
                <span>Total Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex items-center justify-between text-2xl font-bold mb-10">
                <span>Total</span>
                <span>₹ {totalPrice}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="
                 w-full
                bg-white
               text-black
               py-4
               rounded-2xl
              font-semibold
              hover:scale-[1.02]
              transition
               "
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
