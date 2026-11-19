
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

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

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "Cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "Shipped":
      return "border-sky-500/30 bg-sky-500/10 text-sky-400";

    default:
      return "border-[#c7b99d]/30 bg-[#c7b99d]/10 text-[#d5c5a5]";
  }
};

const getPaymentStyle = (status) => {
  if (status === "Paid") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }

  return "border-amber-500/30 bg-amber-500/10 text-amber-400";
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = localUser?.user?._id;

      if (!userId) {
        setOrders([]);
        setError("Please log in to view your orders.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/order-by-user`,
        {
          uId: userId,
        }
      );

      setOrders(response.data?.Order || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(
        err.response?.data?.message ||
          "We couldn't load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const totalProducts = orders.reduce(
    (total, order) =>
      total +
      (order.allProduct || []).reduce(
        (quantity, item) => quantity + Number(item.quantity || 0),
        0
      ),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#111110] text-[#f5f3ee]">

      {/* HERO */}

      <section className="relative border-b border-white/[0.07] bg-[#171715] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full bg-[#c7b99d]/[0.07] blur-[130px]" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-96 rounded-full bg-[#a18e6d]/[0.05] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#c7b99d]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#c7b99d] sm:text-xs">
                Your Shopping Journey
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                  My
                  <span className="ml-3 font-serif font-normal italic text-[#c7b99d]">
                    Orders.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                  Every order, every detail, all in one place. Keep track of
                  your purchases and follow your delivery journey.
                </p>
              </div>

              <Link
                to="/shop"
                className="group inline-flex w-fit items-center gap-3 border-b border-[#c7b99d]/50 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d8cbb1] transition hover:border-[#e4d6b9] hover:text-white"
              >
                Continue Shopping
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>

          {/* ORDER STATS */}

          {!loading && !error && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3"
            >
              <div className="bg-[#171715] px-6 py-6 sm:px-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  Total Orders
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {String(totalOrders).padStart(2, "0")}
                </p>
              </div>

              <div className="bg-[#171715] px-6 py-6 sm:px-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  Products Purchased
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {String(totalProducts).padStart(2, "0")}
                </p>
              </div>

              <div className="bg-[#171715] px-6 py-6 sm:px-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  Delivered Orders
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-[#c7b99d]">
                  {String(deliveredOrders).padStart(2, "0")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADING */}

          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a18e6d]">
                Account Overview
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Order History
              </h2>
            </div>

            {!loading && !error && orders.length > 0 && (
              <p className="text-xs tracking-wide text-zinc-500">
                {totalOrders} {totalOrders === 1 ? "ORDER" : "ORDERS"} FOUND
              </p>
            )}
          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[320px] flex-col items-center justify-center border border-white/[0.08] bg-[#171715]">
              <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#c7b99d]/20 border-t-[#c7b99d]" />

              <p className="text-sm text-zinc-400">
                Loading your order history...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="flex min-h-[320px] flex-col items-center justify-center border border-red-500/20 bg-[#171715] px-6 text-center">
              <AlertCircle size={38} className="mb-5 text-red-400" />

              <h3 className="text-xl font-bold text-white">
                Something went wrong
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOrders}
                className="mt-7 inline-flex items-center gap-2 bg-[#c7b99d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden border border-white/[0.08] bg-[#171715] px-6 py-16 text-center"
            >
              <div className="pointer-events-none absolute -bottom-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c7b99d]/[0.07] blur-[90px]" />

              <div className="relative mb-7 flex h-20 w-20 items-center justify-center border border-[#c7b99d]/30 bg-[#c7b99d]/[0.06]">
                <ShoppingBag size={34} strokeWidth={1.2} className="text-[#c7b99d]" />
              </div>

              <p className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a18e6d]">
                A New Chapter Awaits
              </p>

              <h3 className="relative mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                No Orders Yet
              </h3>

              <p className="relative mt-4 max-w-md text-sm leading-7 text-zinc-400">
                Your order history is waiting to begin. Discover something
                you love and make your first purchase.
              </p>

              <Link
                to="/shop"
                className="relative mt-8 inline-flex items-center gap-3 bg-[#c7b99d] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#171715] transition hover:bg-[#e0d2b7]"
              >
                Explore Collection
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          )}

          {/* ORDERS LIST */}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-8">
              {orders.map((order, orderIndex) => (
                <motion.article
                  key={order._id || order.orderId || orderIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(orderIndex * 0.08, 0.4),
                  }}
                  className="overflow-hidden border border-white/[0.09] bg-[#171715] transition-colors duration-300 hover:border-[#c7b99d]/30"
                >
                  {/* ORDER HEADER */}

                  <div className="border-b border-white/[0.08] px-5 py-6 sm:px-8 sm:py-7">
                    <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-center">

                      {/* ORDER ID */}

                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                          Order Reference
                        </p>

                        <h3 className="break-all text-lg font-bold tracking-wide text-white sm:text-xl">
                          {order.orderId || "Order ID unavailable"}
                        </h3>

                        {order.estimatedDelivery && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-[#c7b99d]">
                            <CalendarDays size={15} />

                            <span>
                              Estimated delivery:{" "}
                              {formatDate(order.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* PAYMENT AND STATUS */}

                      <div className="grid grid-cols-2 gap-5 sm:gap-8">
                        <div>
                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Payment
                          </p>

                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                            <CreditCard size={15} className="text-[#c7b99d]" />
                            {order.paymentMethod || "N/A"}
                          </div>

                          <span
                            className={`inline-flex border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${getPaymentStyle(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>

                        <div>
                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Order Status
                          </p>

                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                            {order.status === "Delivered" ? (
                              <CheckCircle2 size={15} className="text-emerald-400" />
                            ) : (
                              <Truck size={15} className="text-[#c7b99d]" />
                            )}

                            {order.status || "Processing"}
                          </div>

                          <span
                            className={`inline-flex border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status || "Processing"}
                          </span>
                        </div>
                      </div>

                      {/* DETAILS BUTTON */}

                      <button
                        type="button"
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="group inline-flex items-center justify-center gap-3 border border-[#c7b99d]/50 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#d6c7a8] transition hover:bg-[#c7b99d] hover:text-[#171715]"
                      >
                        View Details
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* PRODUCTS */}

                  <div className="space-y-4 px-5 py-6 sm:px-8 sm:py-7">
                    <div className="mb-5 flex items-center gap-3">
                      <Package size={16} className="text-[#c7b99d]" />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                        Items in this order
                      </p>

                      <span className="h-px flex-1 bg-white/[0.07]" />
                    </div>

                    {order.allProduct?.map((item, index) => {
                      const product = item.id;
                      const image = product?.pImages?.[0];

                      return (
                        <div
                          key={`${product?._id || index}-${item.selectedSize || "default"}`}
                          className="group flex flex-col gap-5 border border-white/[0.07] bg-[#111110] p-4 transition hover:border-[#c7b99d]/25 sm:flex-row sm:items-center sm:p-5"
                        >
                          {/* PRODUCT IMAGE */}

                          <div className="h-28 w-full shrink-0 overflow-hidden bg-[#22221f] sm:h-28 sm:w-28">
                            <img
                              src={getProductImageUrl(image)}
                              alt={product?.pName || "Product"}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/600x600?text=No+Image";
                              }}
                            />
                          </div>

                          {/* PRODUCT INFO */}

                          <div className="min-w-0 flex-1">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a18e6d]">
                              {product?.pCategory?.cName || "Collection"}
                            </p>

                            <h4 className="text-lg font-bold text-white sm:text-xl">
                              {product?.pName || "Product"}
                            </h4>

                            {product?.pDescription && (
                              <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-6 text-zinc-500">
                                {product.pDescription}
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                                Quantity: {item.quantity || 1}
                              </span>

                              <span className="border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                                Size: {item.selectedSize || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* PRODUCT PRICE */}

                          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4 sm:min-w-[130px] sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                              Unit Price
                            </p>

                            <p className="text-xl font-bold tracking-tight text-[#d8c9aa] sm:mt-3 sm:text-2xl">
                              {formatPrice(product?.pPrice)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {(!order.allProduct || order.allProduct.length === 0) && (
                      <p className="py-6 text-center text-sm text-zinc-500">
                        Product details are unavailable for this order.
                      </p>
                    )}
                  </div>

                  {/* ORDER FOOTER */}

                  <div className="border-t border-white/[0.08] bg-[#141412] px-5 py-6 sm:px-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Total Units
                          </p>

                          <p className="mt-2 text-lg font-semibold text-white">
                            {(order.allProduct || []).reduce(
                              (total, item) =>
                                total + Number(item.quantity || 0),
                              0
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Payment Method
                          </p>

                          <p className="mt-2 text-lg font-semibold text-white">
                            {order.paymentMethod || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                            Payment Status
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-300">
                            {order.paymentStatus === "Paid" ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-400"
                              />
                            ) : (
                              <Clock3
                                size={14}
                                className="text-amber-400"
                              />
                            )}

                            {order.paymentStatus || "Pending"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-[#c7b99d]/20 pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 sm:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                          Order Total
                        </p>

                        <p className="mt-2 text-3xl font-black tracking-tight text-[#d8c9aa] sm:text-4xl">
                          {formatPrice(order.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM BRAND STRIP */}

      <section className="border-t border-white/[0.07] bg-[#171715] px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c7b99d]">
              Modern Shop
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Thoughtfully selected. Made for your everyday style.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 transition hover:text-[#d8c9aa]"
          >
            Discover More
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MyOrders;
