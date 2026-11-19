
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  LockKeyhole,
  Crown,
  ArrowLeft,
  PackageCheck,
} from "lucide-react";

import { CartContext } from "../context/CartContext";

const PRODUCT_IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

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

function Cart() {
  const navigate = useNavigate();

  const {
    cart = [],
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.pPrice || 0) * Number(item.quantity || 0),
    0
  );

  const finalAmount =
    finalTotal !== null ? Number(finalTotal) : totalPrice;

  // RESET COUPON WHEN CART CHANGES
  useEffect(() => {
    setDiscount(0);
    setFinalTotal(null);
    setAppliedCoupon(null);
  }, [cart]);

  // APPLY COUPON
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setCouponLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupon/apply-coupon`,
        {
          code: couponCode.trim(),
          totalAmount: totalPrice,
        }
      );

      if (response.data.success) {
        setDiscount(Number(response.data.discountAmount) || 0);
        setFinalTotal(Number(response.data.finalAmount));
        setAppliedCoupon(response.data.coupon);

        toast.success("Coupon applied successfully");
      } else {
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("Coupon error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setDiscount(0);
    setFinalTotal(null);
    setAppliedCoupon(null);
    setCouponCode("");

    toast.success("Coupon removed");
  };

  // PROCEED TO CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout", {
      state: {
        discount,
        finalTotal: finalAmount,
        coupon: appliedCoupon,
      },
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#111110] text-[#F2F0EA]">

      {/* LUXURY HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#171715]">

        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#C7B58E]/[0.08] blur-[130px]" />

        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[400px] w-[400px] rounded-full bg-[#9C8257]/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px] px-5 pb-16 pt-10 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">

          <Link
            to="/shop"
            className="mb-14 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 transition hover:text-[#C7B58E]"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="mb-7 flex items-center gap-3">
              <Crown size={15} className="text-[#C7B58E]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#C7B58E]">
                Curated For You
              </span>
            </div>

            <div className="flex flex-col justify-between gap-9 md:flex-row md:items-end">

              <div>
                <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.85] tracking-[-0.075em]">
                  Shopping
                  <span className="ml-3 font-serif font-normal italic text-[#C7B58E] sm:ml-5">
                    Bag.
                  </span>
                </h1>

                <p className="mt-8 max-w-lg text-sm leading-7 text-white/45 sm:text-base">
                  The pieces you've chosen, all in one place.
                  Your next favourite look is just a step away.
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">

                <div className="flex h-12 w-12 items-center justify-center border border-[#C7B58E]/30 bg-[#C7B58E]/[0.07]">
                  <ShoppingBag
                    size={21}
                    strokeWidth={1.3}
                    className="text-[#C7B58E]"
                  />
                </div>

                <div>
                  <p className="text-3xl font-semibold tracking-tight">
                    {cart.length.toString().padStart(2, "0")}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Cart Items
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-[1500px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">

        {cart.length === 0 ? (

          /* EMPTY CART */
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[480px] flex-col items-center justify-center text-center"
          >

            <div className="mb-8 flex h-24 w-24 items-center justify-center border border-[#C7B58E]/25 bg-[#C7B58E]/[0.06]">
              <ShoppingBag
                size={35}
                strokeWidth={1}
                className="text-[#C7B58E]"
              />
            </div>

            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C7B58E]/60" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C7B58E]">
                Nothing in your bag
              </p>

              <span className="h-px w-8 bg-[#C7B58E]/60" />
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Your next look
              <span className="ml-2 font-serif font-normal italic text-[#C7B58E]">
                starts here.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/40">
              Explore our collection and discover pieces
              that feel like you.
            </p>

            <Link
              to="/shop"
              className="group mt-9 inline-flex items-center gap-4 bg-[#C7B58E] px-8 py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#171715] transition hover:bg-[#E0D2B4]"
            >
              Explore Collection

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </motion.div>

        ) : (

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3">

            {/* LEFT: CART ITEMS */}
            <div className="space-y-8 lg:col-span-2">

              {/* SECTION HEADER */}
              <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end">

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C7B58E]">
                    Your Selection
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    Shopping Details
                  </h2>

                  <p className="mt-2 text-xs text-white/35">
                    Carefully selected pieces, ready for you.
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="flex w-fit items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45 transition hover:text-[#C7B58E]"
                >
                  Continue Shopping
                  <ArrowRight size={14} />
                </Link>

              </div>

              {/* CART PRODUCT LIST */}
              <div className="space-y-7">

                {cart.map((item, index) => (

                  <motion.article
                    key={item._id + item.selectedSize}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.06, 0.3),
                    }}
                    className="group flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row"
                  >

                    {/* PRODUCT IMAGE */}
                    <Link
                      to={`/product/${item._id}`}
                      className="block w-full shrink-0 overflow-hidden border border-white/[0.06] bg-[#25231F] sm:w-40"
                    >
                      <div className="aspect-[4/5] sm:aspect-[4/5]">
                        <img
                          src={getProductImageUrl(item.pImages?.[0])}
                          alt={item.pName}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x600?text=No+Image";
                          }}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* PRODUCT INFORMATION */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">

                      <div>

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.23em] text-[#C7B58E]">
                              {item.pCategory?.cName || "Collection"}
                            </p>

                            <Link
                              to={`/product/${item._id}`}
                              className="text-lg font-semibold tracking-tight text-white transition hover:text-[#C7B58E] sm:text-xl"
                            >
                              {item.pName}
                            </Link>

                            <p className="mt-3 text-[10px] text-white/40">
                              Size:{" "}
                              <span className="font-semibold text-[#D8C59F]">
                                {item.selectedSize}
                              </span>
                            </p>

                          </div>

                          <p className="shrink-0 text-sm font-semibold text-[#D8C59F] sm:text-base">
                            {formatPrice(
                              Number(item.pPrice || 0) *
                                Number(item.quantity || 0)
                            )}
                          </p>

                        </div>

                        <p className="mt-4 text-[10px] text-white/35">
                          Unit Price: {formatPrice(item.pPrice)}
                        </p>

                      </div>

                      {/* QUANTITY AND REMOVE */}
                      <div className="flex flex-wrap items-center justify-between gap-4">

                        <div className="flex h-11 items-center border border-white/15 bg-[#191917]">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item._id, item.selectedSize)
                            }
                            aria-label="Decrease quantity"
                            className="flex h-full w-10 items-center justify-center text-white/50 transition hover:bg-[#C7B58E] hover:text-[#171715]"
                          >
                            <Minus size={13} />
                          </button>

                          <span className="min-w-10 text-center text-xs font-semibold text-white">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item._id, item.selectedSize)
                            }
                            aria-label="Increase quantity"
                            className="flex h-full w-10 items-center justify-center text-white/50 transition hover:bg-[#C7B58E] hover:text-[#171715]"
                          >
                            <Plus size={13} />
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item._id, item.selectedSize)
                          }
                          className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35 transition hover:text-red-400"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>

                      </div>

                    </div>

                  </motion.article>

                ))}

              </div>

              {/* SHOPPING PROMISE */}
              <div className="flex flex-col gap-4 border border-white/[0.07] bg-[#191917] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">
                  <PackageCheck
                    size={19}
                    className="shrink-0 text-[#C7B58E]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Made for your everyday style
                    </p>

                    <p className="mt-1 text-[9px] text-white/35">
                      Your selected pieces are waiting for you.
                    </p>
                  </div>
                </div>

                <Link
                  to="/shop"
                  className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C7B58E] transition hover:text-[#E0D2B4]"
                >
                  Discover More
                </Link>

              </div>

            </div>

            {/* RIGHT: ORDER SUMMARY */}
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
                        Your Selection
                      </p>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                      Order Summary
                    </h2>

                    <p className="mt-2 text-[10px] text-white/35">
                      A little closer to making it yours.
                    </p>

                  </div>

                  {/* COUPON */}
                  <div className="mb-8">

                    <div className="mb-4 flex items-center gap-3">
                      <Tag size={15} className="text-[#C7B58E]" />

                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70">
                        Have a Coupon?
                      </p>
                    </div>

                    {appliedCoupon ? (

                      <div className="border border-[#C7B58E]/30 bg-[#C7B58E]/[0.07] p-4">

                        <div className="flex items-center justify-between gap-3">

                          <div>
                            <p className="text-xs font-semibold text-[#E0D2B4]">
                              {appliedCoupon.code}
                            </p>

                            <p className="mt-1 text-[9px] text-white/40">
                              {appliedCoupon.discountPercent
                                ? `${appliedCoupon.discountPercent}% discount applied`
                                : "Discount applied successfully"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="text-[8px] font-semibold uppercase tracking-[0.14em] text-red-300/80 transition hover:text-red-300"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    ) : (

                      <div className="flex flex-col gap-2 sm:flex-row">

                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") applyCoupon();
                          }}
                          className="min-w-0 flex-1 border border-white/15 bg-[#111110] px-4 py-3.5 text-xs uppercase text-white outline-none transition placeholder:normal-case placeholder:text-white/25 focus:border-[#C7B58E]/60"
                        />

                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading}
                          className="bg-[#C7B58E] px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#171715] transition hover:bg-[#E0D2B4] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {couponLoading ? "Applying..." : "Apply"}
                        </button>

                      </div>

                    )}

                  </div>

                  {/* PRICE DETAILS */}
                  <div className="space-y-5 border-b border-white/10 pb-7">

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">
                        Total Items
                      </span>

                      <span className="font-semibold text-white/80">
                        {cart.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">
                        Subtotal
                      </span>

                      <span className="font-semibold text-white/80">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/45">
                          Discount
                        </span>

                        <span className="font-semibold text-[#C7B58E]">
                          - {formatPrice(discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">
                        Shipping
                      </span>

                      <span className="text-right text-[10px] font-medium text-white/65">
                        Calculated at checkout
                      </span>
                    </div>

                  </div>

                  {/* TOTAL */}
                  <div className="flex items-end justify-between gap-3 py-7">

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        Estimated Total
                      </p>

                      <p className="mt-2 text-[9px] text-white/30">
                        Before delivery charges
                      </p>
                    </div>

                    <p className="text-3xl font-semibold tracking-[-0.05em] text-[#D8C59F]">
                      {formatPrice(finalAmount)}
                    </p>

                  </div>

                  {/* CHECKOUT BUTTON */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="group flex w-full items-center justify-center gap-3 bg-[#C7B58E] py-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#171715] transition duration-300 hover:bg-[#E0D2B4]"
                  >
                    Proceed to Checkout

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                  {/* TRUST */}
                  <div className="mt-7 space-y-4">

                    <div className="flex items-center gap-3">
                      <ShieldCheck
                        size={16}
                        className="text-[#C7B58E]"
                      />

                      <p className="text-[9px] text-white/40">
                        Secure checkout experience
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <LockKeyhole
                        size={15}
                        className="text-[#C7B58E]"
                      />

                      <p className="text-[9px] text-white/40">
                        Your details are protected
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* BRAND MESSAGE */}
              <div className="mt-6 flex items-center gap-3 px-2">

                <Sparkles
                  size={16}
                  className="shrink-0 text-[#C7B58E]"
                />

                <p className="text-[9px] leading-5 text-white/35">
                  Thoughtfully selected. Ready to become yours.
                </p>

              </div>

            </aside>

          </div>

        )}

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

export default Cart;
