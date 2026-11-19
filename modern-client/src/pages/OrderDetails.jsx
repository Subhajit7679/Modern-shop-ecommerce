
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Package,
  CalendarDays,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Download,
  XCircle,
  CheckCircle2,
  Clock3,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  FileText,
  AlertCircle,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
      return "border-[#c7b99d]/30 bg-[#c7b99d]/10 text-[#d8c9aa]";
  }
};

const trackingSteps = [
  "Not processed",
  "Processing",
  "Shipped",
  "Delivered",
];

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const currentStep = trackingSteps.indexOf(order?.status);

  // FETCH ORDER

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/single-order`,
        {
          orderId: id,
        }
      );

      if (response.data.success && response.data.order) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || "Order details could not be found.");
      }
    } catch (err) {
      console.error("Error fetching order:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load this order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // CANCEL ORDER

  const cancelOrder = async () => {
    if (!order?._id || cancelling) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/update-order`,
        {
          oId: order._id,
          status: "Cancelled",
        }
      );

      if (response.data.success) {
        setOrder((previousOrder) => ({
          ...previousOrder,
          status: "Cancelled",
        }));

        toast.success("Your order has been cancelled.");
      } else {
        toast.error(response.data.message || "Unable to cancel this order.");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);

      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  // DOWNLOAD INVOICE

  const downloadInvoice = () => {
    if (!order) return;

    try {
      const doc = new jsPDF();

      const address = order.shippingAddress || {};

      const addressText = [
        address.fullName,
        address.house,
        address.area,
        address.landmark ? `Landmark: ${address.landmark}` : null,
        [address.city, address.state].filter(Boolean).join(", "),
        address.pincode ? `PIN: ${address.pincode}` : null,
      ]
        .filter(Boolean)
        .join(", ");

      // INVOICE HEADER

      doc.setFillColor(23, 23, 21);
      doc.rect(0, 0, 210, 42, "F");

      doc.setTextColor(245, 243, 238);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("MODERN SHOP", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(199, 185, 157);
      doc.text("ORDER INVOICE", 14, 30);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Thank you for shopping with us.", 196, 24, {
        align: "right",
      });

      // ORDER INFORMATION

      let y = 55;

      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("ORDER INFORMATION", 14, y);

      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const orderInfo = [
        [`Order ID: ${order.orderId || "N/A"}`, `Date: ${formatDate(order.createdAt)}`],
        [`Status: ${order.status || "N/A"}`, `Payment: ${order.paymentMethod || "N/A"}`],
        [`Payment Status: ${order.paymentStatus || "N/A"}`, ""],
      ];

      orderInfo.forEach((line) => {
        doc.text(line[0], 14, y);
        if (line[1]) doc.text(line[1], 110, y);
        y += 8;
      });

      // SHIPPING ADDRESS

      y += 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("SHIPPING ADDRESS", 14, y);

      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const wrappedAddress = doc.splitTextToSize(
        addressText || "Address not available",
        175
      );

      doc.text(wrappedAddress, 14, y);

      y += wrappedAddress.length * 5 + 4;

      doc.text(
        `Phone: ${address.phone || "N/A"}`,
        14,
        y
      );

      // PRODUCT TABLE

      const productRows = (order.allProduct || []).map((item) => [
        item.id?.pName || "Product",
        item.selectedSize || "N/A",
        String(item.quantity || 0),
        formatPrice(item.id?.pPrice),
      ]);

      autoTable(doc, {
        startY: y + 12,
        head: [["Product", "Size", "Quantity", "Unit Price"]],
        body: productRows,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: [45, 45, 45],
        },
        headStyles: {
          fillColor: [23, 23, 21],
          textColor: [245, 243, 238],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [246, 244, 239],
        },
      });

      // TOTAL

      const finalY = doc.lastAutoTable?.finalY || y + 30;

      const totalY = finalY + 16;

      if (totalY > 265) {
        doc.addPage();
      }

      const finalTotalY = totalY > 265 ? 25 : totalY;

      doc.setDrawColor(199, 185, 157);
      doc.line(14, finalTotalY - 7, 196, finalTotalY - 7);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(30, 30, 30);

      doc.text(
        `Total Amount: ${formatPrice(order.amount)}`,
        196,
        finalTotalY,
        { align: "right" }
      );

      // FOOTER

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);

      doc.text(
        "Generated by Modern Shop",
        105,
        287,
        { align: "center" }
      );

      doc.save(`${order.orderId || "order"}-invoice.pdf`);

      toast.success("Invoice downloaded successfully.");
    } catch (err) {
      console.error("Invoice download error:", err);
      toast.error("Unable to generate invoice. Please try again.");
    }
  };

  // LOADING STATE

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#111110] text-white">
        <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#c7b99d]/20 border-t-[#c7b99d]" />

        <p className="text-sm tracking-wide text-zinc-400">
          Loading your order details...
        </p>
      </div>
    );
  }

  // ERROR STATE

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#111110] px-6 text-center text-white">
        <div className="mb-6 flex h-20 w-20 items-center justify-center border border-red-500/20 bg-red-500/10">
          <AlertCircle size={35} className="text-red-400" />
        </div>

        <h2 className="text-3xl font-black">
          Order Not Found
        </h2>

        <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
          {error || "We couldn't find the requested order."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={fetchOrder}
            className="inline-flex items-center gap-2 bg-[#c7b99d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6]"
          >
            <RefreshCw size={15} />
            Try Again
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#c7b99d] hover:text-[#d8c9aa]"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};

  return (
    <main className="min-h-screen overflow-hidden bg-[#111110] text-[#f5f3ee]">

      {/* HERO */}

      <section className="relative border-b border-white/[0.07] bg-[#171715] px-5 pb-14 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full bg-[#c7b99d]/[0.07] blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:text-[#d8c9aa]"
          >
            <ArrowLeft size={16} />
            Back to My Orders
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#c7b99d]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c7b99d] sm:text-xs">
                Your Purchase Details
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                  Order
                  <span className="ml-3 font-serif font-normal italic text-[#c7b99d]">
                    Summary.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl break-all text-sm leading-7 text-zinc-400">
                  Reference: {order.orderId || order._id}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(
                    order.status
                  )}`}
                >
                  <Package size={14} />
                  {order.status || "Processing"}
                </span>

                <button
                  type="button"
                  onClick={downloadInvoice}
                  className="inline-flex items-center gap-2 bg-[#c7b99d] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6]"
                >
                  <Download size={15} />
                  Invoice
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">

          {/* ORDER OVERVIEW */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-white/[0.08] bg-[#171715]"
          >
            <div className="border-b border-white/[0.08] px-6 py-5 sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
                Overview
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Order Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-7 px-6 py-7 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
              {/* ORDER ID */}

              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-zinc-500">
                  <FileText size={15} className="text-[#c7b99d]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Order ID
                  </p>
                </div>

                <p className="break-all text-sm font-semibold text-white">
                  {order.orderId || order._id}
                </p>
              </div>

              {/* DATE */}

              <div>
                <div className="mb-3 flex items-center gap-2 text-zinc-500">
                  <CalendarDays size={15} className="text-[#c7b99d]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Order Date
                  </p>
                </div>

                <p className="text-sm font-semibold text-white">
                  {formatDate(order.createdAt)}
                </p>

                {order.estimatedDelivery && (
                  <p className="mt-3 text-xs text-[#c7b99d]">
                    Delivery by {formatDate(order.estimatedDelivery)}
                  </p>
                )}
              </div>

              {/* PAYMENT */}

              <div>
                <div className="mb-3 flex items-center gap-2 text-zinc-500">
                  <CreditCard size={15} className="text-[#c7b99d]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Payment Method
                  </p>
                </div>

                <p className="mb-3 text-sm font-semibold text-white">
                  {order.paymentMethod || "N/A"}
                </p>

                <span
                  className={`inline-flex border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                    order.paymentStatus === "Paid"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {order.paymentStatus || "Pending"}
                </span>
              </div>

              {/* STATUS */}

              <div>
                <div className="mb-3 flex items-center gap-2 text-zinc-500">
                  <Truck size={15} className="text-[#c7b99d]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Order Status
                  </p>
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
          </motion.section>

          {/* PRODUCTS */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 border border-white/[0.08] bg-[#171715]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 sm:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
                  Your Selection
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Ordered Products
                </h2>
              </div>

              <span className="border border-[#c7b99d]/25 px-3 py-2 text-xs font-semibold text-[#d8c9aa]">
                {(order.allProduct || []).length} ITEMS
              </span>
            </div>

            <div className="space-y-4 p-5 sm:p-8">
              {order.allProduct?.map((item, index) => {
                const product = item.id;
                const image = product?.pImages?.[0];

                return (
                  <div
                    key={`${product?._id || index}-${item.selectedSize || "default"}`}
                    className="group flex flex-col gap-5 border border-white/[0.07] bg-[#111110] p-4 transition hover:border-[#c7b99d]/25 sm:flex-row sm:items-center sm:p-5"
                  >
                    {/* IMAGE */}

                    <div className="h-36 w-full shrink-0 overflow-hidden bg-[#22221f] sm:h-32 sm:w-32">
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

                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {product?.pName || "Product"}
                      </h3>

                      {product?.pDescription && (
                        <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-6 text-zinc-500">
                          {product.pDescription}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                          Quantity: {item.quantity || 0}
                        </span>

                        <span className="border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                          Size: {item.selectedSize || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* PRICE */}

                    <div className="flex items-center justify-between border-t border-white/[0.07] pt-4 sm:min-w-[145px] sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Unit Price
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#d8c9aa]">
                        {formatPrice(product?.pPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {(!order.allProduct || order.allProduct.length === 0) && (
                <p className="py-8 text-center text-sm text-zinc-500">
                  Product details are unavailable.
                </p>
              )}
            </div>
          </motion.section>

          {/* SHIPPING ADDRESS */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 border border-white/[0.08] bg-[#171715]"
          >
            <div className="border-b border-white/[0.08] px-6 py-5 sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
                Delivery Information
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Shipping Address
              </h2>
            </div>

            <div className="grid gap-8 px-6 py-7 sm:px-8 md:grid-cols-2">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#c7b99d]/25 bg-[#c7b99d]/[0.06]">
                    <MapPin size={18} className="text-[#c7b99d]" />
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Delivery Location
                  </p>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {shippingAddress.fullName || "Customer"}
                </h3>

                <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
                  {shippingAddress.house && <p>{shippingAddress.house}</p>}

                  {shippingAddress.area && <p>{shippingAddress.area}</p>}

                  {shippingAddress.landmark && (
                    <p>Landmark: {shippingAddress.landmark}</p>
                  )}

                  <p>
                    {[
                      shippingAddress.city,
                      shippingAddress.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {shippingAddress.pincode && (
                    <p>PIN: {shippingAddress.pincode}</p>
                  )}

                  {!shippingAddress.house &&
                    !shippingAddress.area &&
                    !shippingAddress.city && (
                      <p>Address details are unavailable.</p>
                    )}
                </div>
              </div>

              <div className="border-t border-white/[0.07] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#c7b99d]/25 bg-[#c7b99d]/[0.06]">
                    <Phone size={18} className="text-[#c7b99d]" />
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Contact Information
                  </p>
                </div>

                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Phone Number
                </p>

                <p className="mt-3 text-xl font-semibold text-white">
                  {shippingAddress.phone || "Not available"}
                </p>

                {order.estimatedDelivery && (
                  <div className="mt-7 flex items-start gap-3 border border-[#c7b99d]/20 bg-[#c7b99d]/[0.05] p-4">
                    <Truck
                      size={18}
                      className="mt-0.5 shrink-0 text-[#c7b99d]"
                    />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c7b99d]">
                        Estimated Delivery
                      </p>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* ORDER TRACKER */}

          {order.status !== "Cancelled" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 border border-white/[0.08] bg-[#171715] p-6 sm:p-8"
            >
              <div className="mb-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
                  Delivery Journey
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Order Progress
                </h2>

                <p className="mt-2 text-xs text-zinc-500">
                  Follow your order as it moves towards your doorstep.
                </p>
              </div>

              {/* TRACKING STEPS */}

              <div className="overflow-x-auto pb-3">
                <div className="relative grid min-w-[540px] grid-cols-4">
                  {trackingSteps.map((step, index) => {
                    const completed = currentStep >= index;
                    const active = currentStep === index;

                    return (
                      <div
                        key={step}
                        className="relative flex flex-col items-center text-center"
                      >
                        {/* CONNECTING LINE */}

                        {index < trackingSteps.length - 1 && (
                          <div className="absolute left-1/2 top-5 h-[2px] w-full bg-white/[0.1]">
                            <div
                              className={`h-full transition-all duration-500 ${
                                currentStep > index
                                  ? "w-full bg-[#c7b99d]"
                                  : "w-0"
                              }`}
                            />
                          </div>
                        )}

                        {/* STEP ICON */}

                        <div
                          className={`relative z-10 flex h-10 w-10 items-center justify-center border-2 transition ${
                            completed
                              ? "border-[#c7b99d] bg-[#c7b99d] text-[#171715]"
                              : "border-zinc-700 bg-[#111110] text-zinc-500"
                          } ${
                            active
                              ? "ring-4 ring-[#c7b99d]/10"
                              : ""
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 size={19} />
                          ) : (
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-4 text-xs font-semibold ${
                            completed ? "text-[#d8c9aa]" : "text-zinc-500"
                          }`}
                        >
                          {step}
                        </p>

                        {active && (
                          <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#c7b99d]">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* CANCELLED NOTICE */}

          {order.status === "Cancelled" && (
            <div className="mb-8 flex items-start gap-4 border border-red-500/20 bg-red-500/[0.06] p-6">
              <XCircle size={22} className="mt-0.5 shrink-0 text-red-400" />

              <div>
                <h3 className="font-bold text-red-300">
                  This order has been cancelled
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  The tracking journey is no longer active for this order.
                </p>
              </div>
            </div>
          )}

          {/* ORDER ACTIONS */}

          <div className="mb-8 flex flex-col justify-between gap-4 border border-white/[0.08] bg-[#171715] p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-sm font-semibold text-white">
                Need a copy of your purchase details?
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Download your invoice for your records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {order.status === "Not processed" && (
                <button
                  type="button"
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 border border-red-500/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <XCircle size={15} />
                  )}

                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}

              <button
                type="button"
                onClick={downloadInvoice}
                className="inline-flex items-center justify-center gap-2 bg-[#c7b99d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6]"
              >
                <Download size={15} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* TOTAL SUMMARY */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative overflow-hidden border border-[#c7b99d]/25 bg-[#171715] p-7 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#c7b99d]/[0.07] blur-[90px]" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <ShieldCheck size={19} className="text-[#c7b99d]" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c7b99d]">
                    Order Confirmation
                  </p>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Thank you for choosing us.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">
                  Your order details and purchase summary are available here
                  whenever you need them.
                </p>
              </div>

              <div className="border-t border-[#c7b99d]/20 pt-6 md:min-w-[230px] md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Total Amount
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-[#d8c9aa] sm:text-5xl">
                  {formatPrice(order.amount)}
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  {order.paymentMethod || "Payment method unavailable"} ·{" "}
                  {order.paymentStatus || "Pending"}
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>

      {/* FOOTER STRIP */}

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

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 transition hover:text-[#d8c9aa]"
          >
            Continue Shopping →
          </button>
        </div>
      </section>
    </main>
  );
}

export default OrderDetails;
