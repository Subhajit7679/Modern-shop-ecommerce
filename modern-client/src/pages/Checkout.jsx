import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";

import { createOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const [address, setAddress] = useState("");

  const [phone, setPhone] = useState("");

  const totalAmount = cart.reduce(
    (total, item) => total + item.pPrice * item.quantity,
    0,
  );

  const handleOrder = async () => {
    if (!address || !phone) {
      return toast.error("All fields required");
    }

    const orderData = {
      allProduct: cart.map((item) => ({
        id: item._id,

        quantity: item.quantity,

        selectedSize: item.selectedSize,
      })),

      user: user.user._id,

      amount: totalAmount,

      transactionId: "COD_" + Date.now(),

      address,

      phone,
    };

    const response = await createOrder(orderData);

    if (response.success) {
      localStorage.removeItem("cart");

      window.location.href = "/order-success";
    } else {
      toast.error("Order Failed");
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-black
      text-white
      px-8
      py-16
    "
    >
      <div
        className="
        max-w-3xl
        mx-auto
      "
      >
        <h1
          className="
          text-5xl
          font-black
          mb-12
        "
        >
          Checkout
        </h1>

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          space-y-6
        "
        >
          <textarea
            rows="4"
            placeholder="Shipping Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="
              w-full
              bg-black
              border
              border-zinc-700
              rounded-2xl
              px-5
              py-4
            "
          />

          <input
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="
              w-full
              bg-black
              border
              border-zinc-700
              rounded-2xl
              px-5
              py-4
            "
          />

          <div
            className="
            flex
            items-center
            justify-between
            text-2xl
            font-bold
            pt-4
          "
          >
            <span>Total</span>

            <span>₹ {totalAmount}</span>
          </div>

          <button
            onClick={handleOrder}
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
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
