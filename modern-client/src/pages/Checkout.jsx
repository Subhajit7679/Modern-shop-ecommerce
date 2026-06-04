import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import axios from "axios";

import { CartContext } from "../context/CartContext";

import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../services/orderService";
import { useLocation } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const subtotal = cart.reduce(
    (total, item) => total + item.pPrice * item.quantity,

    0,
  );

  const discount = location.state?.discount || 0;

  const finalTotal = location.state?.finalTotal || subtotal;
  const deliveryCharge = finalTotal > 999 ? 0 : 99;
  const grandTotal = finalTotal + deliveryCharge;

  const coupon = location.state?.coupon;

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, []);

  // =========================
  // GET USER ADDRESSES
  // =========================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "${import.meta.env.VITE_API_URL}/user/single-user",

          {
            uId: user.user._id,
          },
        );

        if (response.data.success) {
          const savedAddresses = response.data.user.addresses || [];

          setAddresses(savedAddresses);

          // AUTO SELECT FIRST ADDRESS

          if (savedAddresses.length > 0) {
            const defaultAddress = savedAddresses.find(
              (item) => item.isDefault,
            );

            setSelectedAddress(defaultAddress || savedAddresses[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  // =========================
  // PLACE ORDER
  // =========================
  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script =
      document.createElement("script");

     script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

     script.onload = () =>
      resolve(true);

     script.onerror = () =>
      resolve(false);

     document.body.appendChild(
      script
     );
    });
  };


 const handleRazorpayPayment = async (orderData) => {
   try {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay SDK Failed");
      return;
    }

    const razorpayResponse =
      await createRazorpayOrder(
        grandTotal
      );

     if (
      !razorpayResponse.success
     ) {
      toast.error(
        "Unable to create payment"
      );
      return;
    }

    const razorpayOrder =
      razorpayResponse.order;

    const options = {
      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      name: "Your Ecommerce",

      description:
        "Order Payment",

      order_id:
        razorpayOrder.id,

      handler:
        async function (
          response
        ) {
          const verifyResponse =
            await verifyPayment({
              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,
            });

          if (
            !verifyResponse.success
          ) {
            toast.error(
              "Payment Verification Failed"
            );

            return;
          }

          orderData.transactionId =
            response.razorpay_payment_id;

          orderData.paymentStatus =
            "Paid";

          const orderResponse =
            await createOrder(
              orderData
            );

          if (
            orderResponse.success
          ) {
            clearCart();

            localStorage.removeItem(
              "cart"
            );
            setLoading(false);
            navigate(
              "/order-success"
            );
          } else {
            toast.error(
              "Order Failed"
            );
          }
        },

      prefill: {
        name:
          selectedAddress?.fullName,

        contact:
          selectedAddress?.phone,

        email:
          user?.user?.email,
      },

      theme: {
        color: "#000000",
      },
    };

    const paymentObject =
      new window.Razorpay(
        options
      );

     paymentObject.open();
     } catch (error) {
     console.log(error);

     toast.error(
      "Payment Failed"
     );
     }
 };



 const handleOrder = async () => {
   const confirmOrder =
    window.confirm(
      "Confirm your order?"
    );

   if (!confirmOrder) return;

   if (!selectedAddress) {
    return toast.error(
      "Please select address"
    );
   }

   setLoading(true);

  const orderData = {
    allProduct: cart.map(
      (item) => ({
        id: item._id,

        quantity:
          item.quantity,

        selectedSize:
          item.selectedSize,
      })
    ),

    user: user.user._id,

    amount: grandTotal,

    transactionId:
      paymentMethod === "COD"
        ? "COD_" +
          Date.now()
        : "",

    orderId:
      "ORD-" + Date.now(),

    shippingAddress:
      selectedAddress,

    paymentMethod,

    paymentStatus:
      paymentMethod === "COD"
        ? "Pending"
        : "Paid",

    estimatedDelivery:
      new Date(
        Date.now() +
          7 *
            24 *
            60 *
            60 *
            1000
      ),
  };

  // RAZORPAY FLOW

  if (
    paymentMethod ===
    "RAZORPAY"
  ) {
    await handleRazorpayPayment(
      orderData
    );

    setLoading(false);

    return;
  }
 };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        md:px-8
        py-10
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-12">
          <p
            className="
              uppercase
              tracking-[6px]
              text-zinc-500
              text-sm
              mb-3
            "
          >
            Secure Checkout
          </p>

          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
            "
          >
            Checkout
          </h1>
        </div>

        <div
          className="
            grid
            lg:grid-cols-3
            gap-8
          "
        >
          {/* LEFT */}

          <div
            className="
              lg:col-span-2
              space-y-6
            "
          >
            {/* ADDRESS */}

            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-[32px]
                p-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-8
                "
              >
                <h2
                  className="
                    text-3xl
                    font-black
                  "
                >
                  Select Address
                </h2>

                <button
                  onClick={() =>
                     navigate("/manage-address", {
                       state: {
                      fromCheckout: true,
                        },
                         })
                  }
                  className="
                    text-sm
                    text-zinc-400
                    hover:text-white
                  "
                >
                  Manage
                </button>
              </div>

              {/* EMPTY */}

              {addresses.length === 0 && (
                <div
                  className="
                    bg-black
                    border
                    border-zinc-800
                    rounded-3xl
                    p-10
                    text-center
                  "
                >
                  <div className="text-6xl mb-4">📍</div>

                  <h3
                    className="
                      text-2xl
                      font-black
                      mb-3
                    "
                  >
                    No Address Found
                  </h3>

                  <button
                    onClick={() =>
                     navigate("/manage-address", {
                      state: {
                      fromCheckout: true,
                      },
                       })
                    }
                    className="
                      mt-4
                      bg-white
                      text-black
                      px-6
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                  >
                    Add Address
                  </button>
                </div>
              )}

              {/* ADDRESS LIST */}

              <div className="space-y-5">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedAddress(address)}
                    className={`
                        border
                        rounded-3xl
                        p-6
                        cursor-pointer
                        transition

                        ${
                          selectedAddress?._id === address._id
                            ? "border-white bg-black"
                            : "border-zinc-800 bg-black/40"
                        }
                      `}
                  >
                    <div
                      className="
                          flex
                          items-center
                          justify-between
                          mb-4
                        "
                    >
                      <span
                        className="
                            bg-white
                            text-black
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-bold
                          "
                      >
                        {address.addressType}
                      </span>
                      {address.isDefault && (
                        <span
                          className="
                        bg-green-500/20
                        text-green-400
                           px-3
                         py-1
                             rounded-full
                            text-xs
                             font-bold
                         ml-2
                         "
                        >
                          DEFAULT
                        </span>
                      )}

                      <div
                        className={`
                            w-5
                            h-5
                            rounded-full
                            border-2

                            ${
                              selectedAddress?._id === address._id
                                ? "bg-white border-white"
                                : "border-zinc-500"
                            }
                          `}
                      />
                    </div>

                    <h3
                      className="
                          text-2xl
                          font-black
                          mb-2
                        "
                    >
                      {address.fullName}
                    </h3>

                    <p
                      className="
                          text-zinc-400
                          mb-4
                        "
                    >
                      {address.phone}
                    </p>

                    <div
                      className="
                          text-zinc-500
                          leading-7
                        "
                    >
                      <p>{address.house}</p>

                      <p>{address.area}</p>

                      <p>
                        {address.city}, {address.state}
                      </p>

                      <p>{address.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-[32px]
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
              Order Summary
            </h2>

            <div
              className="
    bg-black
    border
    border-zinc-800
    rounded-3xl
    p-5
    mb-8
  "
            >
              <h3
                className="
      text-lg
      font-bold
      mb-4
    "
              >
                Payment Method
              </h3>

              <div className="space-y-3">
                <label
                  className="
        flex
        items-center
        gap-3
        cursor-pointer
      "
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />

                  <span>Cash On Delivery</span>
                </label>

                <label
                  className="
        flex
        items-center
        gap-3
        cursor-pointer
      "
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                  />

                  <span>Razorpay</span>
                </label>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="space-y-5">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    gap-4
                  "
                >
                  <img
                    src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${item.pImages?.[0]}`}
                    alt=""
                    className="
                      w-20
                      h-20
                      object-cover
                      rounded-2xl
                    "
                  />

                  <div className="flex-1">
                    <h3
                      className="
                        font-semibold
                      "
                    >
                      {item.pName}
                    </h3>

                    <p
                      className="
                        text-zinc-500
                        text-sm
                        mt-1
                      "
                    >
                      Size : {item.selectedSize}
                    </p>

                    <p
                      className="
                        text-zinc-500
                        text-sm
                      "
                    >
                      Qty : {item.quantity}
                    </p>
                  </div>

                  <h3
                    className="
                      font-bold
                    "
                  >
                    ₹ {item.pPrice * item.quantity}
                  </h3>
                </div>
              ))}
            </div>

            <div
              className="
                bg-black
               border
               border-zinc-800
                rounded-3xl
                 p-5
                   mb-8
                "
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🚚</div>

                <div>
                  <h3
                    className="
          font-bold
          text-lg
        "
                  >
                    Estimated Delivery
                  </h3>

                  <p className="text-zinc-400">5 - 7 Business Days</p>
                </div>
              </div>
            </div>

            {/* TOTAL */}

            <div
              className="
                border-t
                border-zinc-800
                mt-8
                pt-8
              "
            >
              <div className="space-y-4">
                <div
                  className="
      flex
      items-center
      justify-between
      text-lg
    "
                >
                  <span>Subtotal</span>

                  <span>₹ {subtotal}</span>
                </div>

                {discount > 0 && (
                  <div
                    className="
        flex
        items-center
        justify-between
        text-lg
        text-green-400
      "
                  >
                    <span>Discount</span>

                    <span>- ₹ {discount}</span>
                  </div>
                )}

                {coupon && (
                  <div
                    className="
      flex
      items-center
      justify-between
      text-sm
      text-green-400
    "
                  >
                    <span>Coupon Applied</span>

                    <span>{coupon.code}</span>
                  </div>
                )}

                <div
                  className="
    flex
    items-center
    justify-between
    text-lg
  "
                >
                  <span>Delivery</span>

                  <span>
                    {deliveryCharge === 0 ? "FREE" : `₹ ${deliveryCharge}`}
                  </span>
                </div>

                <div
                  className="
      flex
      items-center
      justify-between
      text-2xl
      font-bold
      pt-4
      border-t
      border-zinc-800
    "
                >
                  <span>Total</span>

                  <span>₹ {grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading || addresses.length === 0}
                className="
                  w-full
                  bg-white
                  text-black
                  py-4
                  rounded-2xl
                  font-bold
                  hover:scale-[1.02]
                  transition
                  disabled:bg-zinc-700
                  disabled:text-zinc-400
                "
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
