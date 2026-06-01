import { useContext, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { CartContext } from "../context/CartContext";

import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  

  const [discountAmount, setDiscountAmount] = useState(0);

  const [finalAmount, setFinalAmount] = useState(null);

  const {
    cart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity,
  } = useContext(CartContext);

  // COUPON STATES

  const [couponCode, setCouponCode] = useState("");

  const [discount, setDiscount] = useState(0);

  const [finalTotal, setFinalTotal] = useState(null);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  {
    discountAmount > 0 && (
      <div
        className="
    flex
    items-center
    justify-between
    text-green-400
    text-lg
    mb-4
  "
      >
        <span>Discount</span>

        <span>- ₹ {discountAmount}</span>
      </div>
    );
  }

  // TOTAL

  const totalPrice = cart.reduce(
    (total, item) => total + item.pPrice * item.quantity,

    0,
  );

  // APPLY COUPON

  const applyCoupon = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/coupon/apply-coupon",

        {
          code: couponCode,

          totalAmount: totalPrice,
        },
      );

      if (response.data.success) {
        setDiscount(response.data.discountAmount);

        setFinalTotal(response.data.finalAmount);

        setAppliedCoupon(response.data.coupon);

        toast.success("Coupon applied");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  
  return (
    <div
      className="
        bg-black
        min-h-screen
        text-white
        px-4
        md:px-8
        lg:px-16
        py-16
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-12
          "
        >
          <h1
            className="
              text-5xl
              font-black
            "
          >
            Shopping Cart
          </h1>

          <p className="text-zinc-500">{cart.length} Items</p>
        </div>

        {cart.length === 0 ? (
          <div
            className="
              text-zinc-500
              text-xl
            "
          >
            Your cart is empty
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-10
            "
          >
            {/* CART ITEMS */}

            <div
              className="
                lg:col-span-2
                space-y-6
              "
            >
              {cart.map((item) => (
                <div
                  key={item._id + item.selectedSize}
                  className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-3xl
                    p-5
                    flex
                    flex-col
                    md:flex-row
                    gap-5
                  "
                >
                  {/* IMAGE */}

                  <img
                    src={`http://localhost:8000/uploads/products/${item.pImages?.[0]}`}
                    alt={item.pName}
                    className="
                      w-full
                      md:w-32
                      h-72
                      md:h-32
                      object-cover
                      rounded-2xl
                    "
                  />

                  {/* INFO */}

                  <div className="flex-1">
                    <h2
                      className="
                        text-2xl
                        font-semibold
                      "
                    >
                      {item.pName}
                    </h2>

                    <p
                      className="
                        text-zinc-400
                        mt-2
                      "
                    >
                      Size : {item.selectedSize}
                    </p>

                    <p
                      className="
                        text-zinc-400
                        mt-2
                      "
                    >
                      ₹ {item.pPrice}
                    </p>

                    {/* QUANTITY */}

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        mt-5
                      "
                    >
                      <button
                        onClick={() =>
                          decreaseQuantity(item._id, item.selectedSize)
                        }
                        className="
                          bg-zinc-800
                          w-10
                          h-10
                          rounded-xl
                          text-xl
                        "
                      >
                        -
                      </button>

                      <span
                        className="
                          text-lg
                          font-semibold
                        "
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item._id, item.selectedSize)
                        }
                        className="
                          bg-zinc-800
                          w-10
                          h-10
                          rounded-xl
                          text-xl
                        "
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}

                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize)}
                    className="
                      bg-red-500/20
                      text-red-400
                      px-4
                      py-2
                      rounded-xl
                      h-fit
                    "
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY */}

            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-3xl
                p-8
                h-fit
                sticky
                top-28
              "
            >
              <h2
                className="
                  text-3xl
                  font-black
                  mb-8
                "
              >
                Summary
              </h2>

              {/* COUPON */}

              <div className="mb-8">
                <p
                  className="
                    text-zinc-400
                    mb-3
                  "
                >
                  Coupon Code
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="SAVE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="
                      flex-1
                      bg-black
                      border
                      border-zinc-700
                      rounded-2xl
                      px-4
                      py-3
                      outline-none
                    "
                  />

                  <button
                    onClick={applyCoupon}
                    className="
                      bg-white
                      text-black
                      px-5
                      rounded-2xl
                      font-semibold
                    "
                  >
                    Apply
                  </button>
                </div>

                {/* APPLIED */}

                {appliedCoupon && (
                  <div
                    className="
                      mt-4
                      bg-green-500/10
                      border
                      border-green-500/20
                      text-green-400
                      p-4
                      rounded-2xl
                    "
                  >
                    Coupon Applied : {appliedCoupon.code} (
                    {appliedCoupon.discountPercent}% OFF)
                  </div>
                )}
              </div>

              {/* PRICING */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-lg
                  mb-5
                "
              >
                <span>Total Items</span>

                <span>{cart.length}</span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-lg
                  mb-5
                "
              >
                <span>Subtotal</span>

                <span>₹ {finalAmount || totalPrice}</span>
              </div>

              {/* DISCOUNT */}

              {discount > 0 && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-lg
                    text-green-400
                    mb-5
                  "
                >
                  <span>Discount</span>

                  <span>- ₹ {discount}</span>
                </div>
              )}

              {/* FINAL */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-3xl
                  font-black
                  border-t
                  border-zinc-800
                  pt-6
                  mb-10
                "
              >
                <span>Total</span>

                <span>₹ {finalTotal || totalPrice}</span>
              </div>

              {/* CHECKOUT */}

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      discount,
                      finalTotal: finalTotal || totalPrice,
                      coupon: appliedCoupon,
                    },
                  })
                }
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
