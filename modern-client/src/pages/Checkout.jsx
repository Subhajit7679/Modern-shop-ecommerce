
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Plus,
  Check,
  ShieldCheck,
  LockKeyhole,
  Truck,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Tag,
  PackageCheck,
  Crown,
  ArrowLeft,
} from "lucide-react";

import { CartContext } from "../context/CartContext";

import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../services/orderService";

const PRODUCT_IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const GOLD = "#C7B58E";

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

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [], clearCart } = useContext(CartContext);

  const user = getStoredUser();
  const userId = user?.user?._id;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.pPrice || 0) * Number(item.quantity || 0),
    0
  );

  const discount = Number(location.state?.discount || 0);

  const discountedTotal =
    location.state?.finalTotal !== undefined &&
    location.state?.finalTotal !== null
      ? Number(location.state.finalTotal)
      : Math.max(0, subtotal - discount);

  const deliveryCharge = discountedTotal > 999 ? 0 : 99;
  const grandTotal = discountedTotal + deliveryCharge;

  const coupon = location.state?.coupon;

  // REDIRECT IF CART IS EMPTY
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cart.length, navigate]);

  // FETCH SAVED ADDRESSES
  useEffect(() => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/single-user`,
          { uId: userId }
        );

        if (response.data.success) {
          const savedAddresses =
            response.data.user?.addresses || [];

          setAddresses(savedAddresses);

          if (savedAddresses.length > 0) {
            const defaultAddress = savedAddresses.find(
              (item) => item.isDefault
            );

            setSelectedAddress(
              defaultAddress || savedAddresses[0]
            );
          }
        }
      } catch (error) {
        console.error("Address fetching error:", error);
        toast.error("Unable to load saved addresses");
      }
    };

    fetchAddresses();
  }, [userId, navigate]);

  // LOAD RAZORPAY SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(!!window.Razorpay),
          { once: true }
        );

        existingScript.addEventListener(
          "error",
          () => resolve(false),
          { once: true }
        );

        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(!!window.Razorpay);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // RAZORPAY PAYMENT
  const handleRazorpayPayment = async (orderData) => {
    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Unable to load Razorpay. Please try again.");
        setLoading(false);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Payment configuration is missing");
        setLoading(false);
        return;
      }

      const razorpayResponse = await createRazorpayOrder(grandTotal);

      if (!razorpayResponse.success) {
        toast.error("Unable to create payment");
        setLoading(false);
        return;
      }

      const razorpayOrder = razorpayResponse.order;

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Modern Shop",
        description: "Your Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyResponse.success) {
              toast.error("Payment verification failed");
              setLoading(false);
              return;
            }

            orderData.transactionId =
              response.razorpay_payment_id;

            orderData.paymentStatus = "Paid";

            const orderResponse = await createOrder(orderData);

            if (orderResponse.success) {
              clearCart();
              localStorage.removeItem("cart");

              toast.success("Payment successful. Order placed!");
              navigate("/order-success");
            } else {
              toast.error(
                orderResponse.message ||
                  "Payment received, but order creation failed. Please contact support."
              );
              setLoading(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(
              "Payment was made, but order confirmation failed. Please contact support."
            );
            setLoading(false);
          }
        },

        prefill: {
          name: selectedAddress?.fullName,
          contact: selectedAddress?.phone,
          email: user?.user?.email,
        },

        theme: {
          color: "#171715",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            toast("Payment was cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Payment could not be started");
      setLoading(false);
    }
  };

  // ADDRESS VALIDATION
  const validateAddress = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return false;
    }

    const requiredFields = [
      { key: "fullName", label: "Full Name" },
      { key: "phone", label: "Phone" },
      { key: "pincode", label: "Pincode" },
      { key: "state", label: "State" },
      { key: "city", label: "City" },
      { key: "house", label: "House / Flat" },
      { key: "area", label: "Area" },
    ];

    const emptyField = requiredFields.find(
      (field) =>
        !String(selectedAddress[field.key] || "").trim()
    );

    if (emptyField) {
      toast.error(
        `Please fill in ${emptyField.label} in your address`
      );
      return false;
    }

    return true;
  };

  // PLACE ORDER
  const handleOrder = async () => {
    if (loading) return;

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!userId) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!validateAddress()) return;

    const confirmOrder = window.confirm(
      "Are you sure you want to place this order?"
    );

    if (!confirmOrder) return;

    setLoading(true);

    const orderData = {
      allProduct: cart.map((item) => ({
        id: item._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      })),

      user: userId,
      amount: grandTotal,

      transactionId:
        paymentMethod === "COD"
          ? "COD_" + Date.now()
          : "",

      orderId: "ORD-" + Date.now(),

      shippingAddress: selectedAddress,
      paymentMethod,

      paymentStatus: "Pending",

      estimatedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    };

    if (paymentMethod === "RAZORPAY") {
      await handleRazorpayPayment(orderData);
      return;
    }

    try {
      const response = await createOrder(orderData);

      if (response.success) {
        clearCart();
        localStorage.removeItem("cart");

        toast.success("Order placed successfully!");
        navigate("/order-success");
      } else {
        toast.error(response.message || "Order failed");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Unable to place your order");
    } finally {
      setLoading(false);
    }
  };

  const openManageAddress = () => {
    navigate("/manage-address", {
      state: {
        fromCheckout: true,
      },
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#111110] text-[#F2F0EA]">

      {/* LUXURY HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#171715]">

        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#C7B58E]/[0.08] blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-52 left-1/4 h-[400px] w-[400px] rounded-full bg-[#9C8257]/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px] px-5 pb-16 pt-10 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">

          <Link
            to="/cart"
            className="mb-14 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45 transition hover:text-[#C7B58E]"
          >
            <ArrowLeft size={14} />
            Back to Shopping Bag
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 flex items-center gap-3">
              <Crown size={15} className="text-[#C7B58E]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#C7B58E]">
                The Final Touch
              </span>
            </div>

            <div className="flex flex-col justify-between gap-9 md:flex-row md:items-end">

              <div>
                <h1 className="text-[clamp(3.7rem,9vw,8.5rem)] font-semibold leading-[0.85] tracking-[-0.075em]">
                  Check
                  <span className="ml-3 font-serif font-normal italic text-[#C7B58E] sm:ml-5">
                    Out.
                  </span>
                </h1>

                <p className="mt-8 max-w-md text-sm leading-7 text-white/45 sm:text-base">
                  Your selected pieces are almost yours.
                  Complete your details and let us take care
                  of the rest.
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div className="flex h-12 w-12 items-center justify-center border border-[#C7B58E]/30 bg-[#C7B58E]/[0.07]">
                  <LockKeyhole
                    size={19}
                    strokeWidth={1.3}
                    className="text-[#C7B58E]"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide">
                    Secure Checkout
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.17em] text-white/35">
                    Private. Protected. Seamless.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-[1500px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">

        {/* CHECKOUT PROGRESS */}
        <div className="mb-14 flex flex-wrap items-center gap-4 sm:gap-7">

          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C7B58E]/40 bg-[#C7B58E] text-[#171715]">
              <Check size={14} />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Bag
            </span>
          </div>

          <span className="h-px w-8 bg-[#C7B58E]/35 sm:w-16" />

          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C7B58E] text-[#C7B58E]">
              <span className="text-[10px]">02</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C7B58E]">
              Checkout
            </span>
          </div>

          <span className="h-px w-8 bg-white/10 sm:w-16" />

          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/35">
              <span className="text-[10px]">03</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Confirmation
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3">

          {/* LEFT CONTENT */}
          <div className="space-y-14 lg:col-span-2">

            {/* DELIVERY ADDRESS */}
            <section>

              <div className="mb-7 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C7B58E]">
                    01 / Your Destination
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    Delivery Address
                  </h2>

                  <p className="mt-2 text-xs text-white/40">
                    Choose where your order should arrive.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openManageAddress}
                  className="flex w-fit items-center gap-2 border border-[#C7B58E]/35 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#C7B58E] transition duration-300 hover:border-[#C7B58E] hover:bg-[#C7B58E] hover:text-[#171715]"
                >
                  <Plus size={14} />
                  Manage Address
                </button>

              </div>

              {addresses.length === 0 ? (

                <div className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-[#191917] px-6 py-16 text-center">

                  <div className="mb-6 flex h-16 w-16 items-center justify-center border border-[#C7B58E]/25 bg-[#C7B58E]/[0.06]">
                    <MapPin
                      size={25}
                      strokeWidth={1.2}
                      className="text-[#C7B58E]"
                    />
                  </div>

                  <h3 className="text-xl font-semibold">
                    No Saved Address
                  </h3>

                  <p className="mt-3 max-w-sm text-xs leading-6 text-white/40">
                    Add a delivery address to continue with
                    your purchase.
                  </p>

                  <button
                    type="button"
                    onClick={openManageAddress}
                    className="mt-7 bg-[#C7B58E] px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#171715] transition hover:bg-[#E0D2B4]"
                  >
                    Add Delivery Address
                  </button>

                </div>

              ) : (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {addresses.map((address, index) => {
                    const isSelected =
                      selectedAddress?._id
                        ? selectedAddress._id === address._id
                        : selectedAddress === address;

                    return (
                      <button
                        type="button"
                        key={address._id || index}
                        onClick={() => setSelectedAddress(address)}
                        aria-pressed={isSelected}
                        className={`group relative w-full border p-6 text-left transition duration-300 ${
                          isSelected
                            ? "border-[#C7B58E]/70 bg-[#25231E]"
                            : "border-white/10 bg-[#191917] hover:border-[#C7B58E]/40"
                        }`}
                      >

                        <div className="mb-6 flex items-center justify-between gap-3">

                          <span className={`px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] ${
                            isSelected
                              ? "bg-[#C7B58E] text-[#171715]"
                              : "bg-white/[0.06] text-white/50"
                          }`}>
                            {address.addressType || "Address"}
                          </span>

                          <div className="flex items-center gap-3">

                            {address.isDefault && (
                              <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#C7B58E]">
                                Default
                              </span>
                            )}

                            <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                              isSelected
                                ? "border-[#C7B58E] bg-[#C7B58E] text-[#171715]"
                                : "border-white/25 text-transparent"
                            }`}>
                              <Check size={12} />
                            </span>

                          </div>
                        </div>

                        <h3 className="text-lg font-semibold tracking-tight text-white">
                          {address.fullName}
                        </h3>

                        <p className="mt-2 text-xs tracking-wide text-[#C7B58E]">
                          {address.phone}
                        </p>

                        <div className="mt-5 space-y-1 text-xs leading-5 text-white/45">
                          <p>{address.house}</p>
                          <p>{address.area}</p>
                          <p>
                            {address.city}, {address.state}
                          </p>
                          <p>{address.pincode}</p>
                        </div>

                        {isSelected && (
                          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[8px] font-semibold uppercase tracking-[0.17em] text-[#C7B58E]">
                            <Check size={13} />
                            Selected Delivery Address
                          </div>
                        )}

                      </button>
                    );
                  })}

                </div>
              )}

            </section>

            {/* PAYMENT METHOD */}
            <section>

              <div className="mb-7 border-b border-white/10 pb-7">

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C7B58E]">
                  02 / The Payment
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Payment Method
                </h2>

                <p className="mt-2 text-xs text-white/40">
                  Choose your preferred way to complete the order.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  aria-pressed={paymentMethod === "COD"}
                  className={`group flex items-center gap-4 border p-5 text-left transition duration-300 ${
                    paymentMethod === "COD"
                      ? "border-[#C7B58E]/70 bg-[#25231E]"
                      : "border-white/10 bg-[#191917] hover:border-[#C7B58E]/40"
                  }`}
                >

                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center transition ${
                    paymentMethod === "COD"
                      ? "bg-[#C7B58E] text-[#171715]"
                      : "bg-white/[0.06] text-[#C7B58E]"
                  }`}>
                    <Truck size={21} strokeWidth={1.3} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      Cash on Delivery
                    </p>
                    <p className="mt-1 text-[10px] text-white/40">
                      Pay when your order arrives
                    </p>
                  </div>

                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    paymentMethod === "COD"
                      ? "border-[#C7B58E] bg-[#C7B58E] text-[#171715]"
                      : "border-white/25"
                  }`}>
                    {paymentMethod === "COD" && <Check size={12} />}
                  </span>

                </button>

                {/* RAZORPAY */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  aria-pressed={paymentMethod === "RAZORPAY"}
                  className={`group flex items-center gap-4 border p-5 text-left transition duration-300 ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#C7B58E]/70 bg-[#25231E]"
                      : "border-white/10 bg-[#191917] hover:border-[#C7B58E]/40"
                  }`}
                >

                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center transition ${
                    paymentMethod === "RAZORPAY"
                      ? "bg-[#C7B58E] text-[#171715]"
                      : "bg-white/[0.06] text-[#C7B58E]"
                  }`}>
                    <CreditCard size={21} strokeWidth={1.3} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      Online Payment
                    </p>
                    <p className="mt-1 text-[10px] text-white/40">
                      Secure payment via Razorpay
                    </p>
                  </div>

                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#C7B58E] bg-[#C7B58E] text-[#171715]"
                      : "border-white/25"
                  }`}>
                    {paymentMethod === "RAZORPAY" && <Check size={12} />}
                  </span>

                </button>

              </div>

              <div className="mt-5 flex items-center gap-4 border border-white/[0.07] bg-[#191917] px-5 py-4">

                <ShieldCheck
                  size={18}
                  className="shrink-0 text-[#C7B58E]"
                  strokeWidth={1.4}
                />

                <p className="text-[10px] leading-5 text-white/45">
                  {paymentMethod === "COD"
                    ? "Pay for your purchase when it is delivered safely to your address."
                    : "You will be redirected to Razorpay's secure payment window to complete your payment."}
                </p>

              </div>

            </section>

          </div>

          {/* RIGHT: LUXURY ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-28">

            <div className="relative overflow-hidden border border-[#C7B58E]/25 bg-[#1B1A17] p-6 sm:p-8">

              {/* GOLD AMBIENT DETAIL */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#C7B58E]/[0.07] blur-[90px]" />

              <div className="relative">

                {/* SUMMARY HEADER */}
                <div className="mb-8 border-b border-white/10 pb-7">

                  <div className="mb-4 flex items-center gap-2">
                    <Crown size={14} className="text-[#C7B58E]" />
                    <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C7B58E]">
                      Reserved For You
                    </p>
                  </div>

                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                    Order Summary
                  </h2>

                  <p className="mt-2 text-[10px] text-white/35">
                    A final look at your selected pieces.
                  </p>

                </div>

                {/* PRODUCTS */}
                <div className="mb-8 space-y-5">

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                      Your Selection
                    </p>

                    <span className="text-[9px] uppercase tracking-wider text-[#C7B58E]">
                      {cart.length} {cart.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item._id + item.selectedSize}
                      className="flex gap-4"
                    >

                      <div className="relative h-24 w-[76px] shrink-0 overflow-hidden border border-white/10 bg-[#292722]">
                        <img
                          src={getProductImageUrl(item.pImages?.[0])}
                          alt={item.pName}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x600?text=No+Image";
                          }}
                          className="h-full w-full object-cover transition duration-700 hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1 py-1">

                        <p className="line-clamp-2 text-xs font-semibold leading-5 text-white">
                          {item.pName}
                        </p>

                        <p className="mt-2 text-[9px] uppercase tracking-[0.13em] text-white/35">
                          Size: {item.selectedSize}
                        </p>

                        <p className="mt-1 text-[9px] text-white/35">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="shrink-0 pt-1 text-xs font-semibold text-[#C7B58E]">
                        {formatPrice(
                          Number(item.pPrice || 0) *
                            Number(item.quantity || 0)
                        )}
                      </p>

                    </div>
                  ))}

                </div>

                {/* COUPON */}
                {coupon && (
                  <div className="mb-7 flex items-center justify-between border border-[#C7B58E]/25 bg-[#C7B58E]/[0.07] p-4">

                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-[#C7B58E]" />

                      <div>
                        <p className="text-xs font-semibold text-[#E4D6B8]">
                          {coupon.code}
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.13em] text-white/40">
                          Applied Successfully
                        </p>
                      </div>
                    </div>

                    <Check size={16} className="text-[#C7B58E]" />

                  </div>
                )}

                {/* DELIVERY */}
                <div className="mb-7 flex items-center gap-4 border-y border-white/10 py-6">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#C7B58E]/20 bg-[#C7B58E]/[0.06]">
                    <PackageCheck
                      size={19}
                      strokeWidth={1.3}
                      className="text-[#C7B58E]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Estimated Delivery
                    </p>

                    <p className="mt-1 text-[9px] text-white/40">
                      5–7 business days
                    </p>
                  </div>

                </div>

                {/* PRICE BREAKDOWN */}
                <div className="space-y-4">

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/45">
                      Subtotal
                    </span>

                    <span className="font-medium text-white/80">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">
                        Discount
                      </span>

                      <span className="font-medium text-[#C7B58E]">
                        - {formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/45">
                      Delivery
                    </span>

                    <span className="font-medium text-white/80">
                      {deliveryCharge === 0
                        ? "FREE"
                        : formatPrice(deliveryCharge)}
                    </span>
                  </div>

                </div>

                {/* TOTAL */}
                <div className="mt-7 border-t border-[#C7B58E]/30 pt-6">

                  <div className="flex items-end justify-between gap-3">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        Total Payable
                      </p>

                      <p className="mt-2 text-[9px] text-white/30">
                        Including delivery charges
                      </p>
                    </div>

                    <p className="text-3xl font-semibold tracking-[-0.05em] text-[#D8C59F]">
                      {formatPrice(grandTotal)}
                    </p>

                  </div>

                </div>

                {/* PLACE ORDER */}
                <button
                  type="button"
                  onClick={handleOrder}
                  disabled={
                    loading ||
                    addresses.length === 0 ||
                    !selectedAddress ||
                    cart.length === 0
                  }
                  className="group mt-8 flex w-full items-center justify-center gap-3 bg-[#C7B58E] py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#171715] transition duration-300 hover:bg-[#E0D2B4] disabled:cursor-not-allowed disabled:bg-[#514D43] disabled:text-white/35"
                >

                  {loading
                    ? "Processing Your Order..."
                    : paymentMethod === "COD"
                    ? "Place Order"
                    : "Pay & Place Order"}

                  {!loading && (
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}

                </button>

                {/* SECURITY */}
                <div className="mt-6 flex items-center justify-center gap-2 text-center">

                  <LockKeyhole
                    size={12}
                    className="text-[#C7B58E]"
                  />

                  <p className="text-[8px] uppercase tracking-[0.16em] text-white/35">
                    Safe & Secure Checkout
                  </p>

                </div>

              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/40 transition hover:text-[#C7B58E]"
            >
              <ShoppingBag size={13} />
              Return to Shopping Bag
            </Link>

          </aside>

        </div>
      </main>

      {/* BOTTOM BRAND DETAIL */}
      <section className="border-t border-white/[0.07] bg-[#171715] px-5 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-3">
            <Crown size={15} className="text-[#C7B58E]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/65">
              MODERN SHOP
            </span>
          </div>

          <p className="text-center text-[8px] uppercase tracking-[0.17em] text-white/25">
            Considered Style. Exceptional Details.
          </p>

          <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-white/35">
            <ShieldCheck size={13} className="text-[#C7B58E]" />
            Secure Shopping Experience
          </div>

        </div>
      </section>

    </div>
  );
}

export default Checkout;
