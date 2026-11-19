
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  Phone,
  Mail,
  User,
  CalendarDays,
  IndianRupee,
  ChevronDown,
  AlertCircle,
  Layers3,
} from "lucide-react";

import Sidebar from "./Sidebar";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/adminOrderService";

import toast from "react-hot-toast";

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

const ORDER_STATUSES = [
  "Not processed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return {
        color: "text-emerald-400",
        background: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        icon: CheckCircle2,
      };

    case "Shipped":
      return {
        color: "text-sky-400",
        background: "bg-sky-400/10",
        border: "border-sky-400/20",
        icon: Truck,
      };

    case "Processing":
      return {
        color: "text-amber-300",
        background: "bg-amber-300/10",
        border: "border-amber-300/20",
        icon: Package,
      };

    case "Cancelled":
      return {
        color: "text-red-400",
        background: "bg-red-400/10",
        border: "border-red-400/20",
        icon: XCircle,
      };

    default:
      return {
        color: "text-[#c7b99d]",
        background: "bg-[#c7b99d]/10",
        border: "border-[#c7b99d]/20",
        icon: Clock3,
      };
  }
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getAllOrders();

      if (data?.Orders) {
        setOrders(data.Orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Unable to load orders. Please try again.");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatus = async (oId, status) => {
    try {
      setUpdatingOrder(oId);

      const response = await updateOrderStatus(oId, status);

      if (response?.success) {
        toast.success("Order status updated");
        await fetchOrders(false);
      } else {
        toast.error(response?.message || "Unable to update order");
      }
    } catch (err) {
      console.error("Update order error:", err);
      toast.error("Something went wrong while updating the order");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        order._id?.toLowerCase().includes(search) ||
        order.orderId?.toLowerCase().includes(search) ||
        order.user?.name?.toLowerCase().includes(search) ||
        order.user?.email?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      processing: orders.filter(
        (order) => order.status === "Processing"
      ).length,
      shipped: orders.filter(
        (order) => order.status === "Shipped"
      ).length,
      delivered: orders.filter(
        (order) => order.status === "Delivered"
      ).length,
    };
  }, [orders]);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      description: "All customer orders",
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Package,
      description: "Orders being prepared",
    },
    {
      label: "Shipped",
      value: stats.shipped,
      icon: Truck,
      description: "Orders on the way",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle2,
      description: "Successfully completed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#171715] text-white">
      <Sidebar />

      <main className="min-h-screen px-4 py-7 sm:px-7 lg:ml-[250px] lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1500px]">

          {/* HEADER */}
          <div className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c7b99d]" />
                <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#c7b99d]">
                  Store Administration
                </p>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Manage <span className="text-[#c7b99d]">Orders.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                Monitor customer orders, manage fulfilment, and keep every
                delivery moving smoothly.
              </p>
            </div>

            <button
              onClick={() => fetchOrders(false)}
              disabled={refreshing || loading}
              className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-zinc-300 transition hover:border-[#c7b99d]/40 hover:text-[#c7b99d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Orders
            </button>
          </div>

          {/* STATS */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="border border-white/[0.07] bg-[#20201d] p-5 sm:p-6"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                      <Icon size={19} />
                    </div>

                    <span className="text-[9px] uppercase tracking-[2px] text-zinc-600">
                      Overview
                    </span>
                  </div>

                  <p className="text-3xl font-bold tabular-nums">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-[1.5px] text-zinc-300">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-[11px] text-zinc-600">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* FILTER BAR */}
          <div className="mb-7 border border-white/[0.07] bg-[#20201d] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Order Directory</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Search and filter your customer orders.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <div className="relative flex-1 sm:min-w-[260px]">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, email or order ID..."
                    className="w-full border border-white/10 bg-[#171715] py-3 pl-11 pr-4 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c7b99d]/50"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none border border-white/10 bg-[#171715] px-4 py-3 pr-10 text-xs text-zinc-300 outline-none transition focus:border-[#c7b99d]/50 sm:min-w-[175px]"
                  >
                    <option value="All">All Orders</option>
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
              <p className="text-[10px] uppercase tracking-[1.5px] text-zinc-500">
                Showing{" "}
                <span className="text-[#c7b99d]">
                  {filteredOrders.length}
                </span>{" "}
                of {orders.length} orders
              </p>

              {(searchTerm || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                  }}
                  className="text-[10px] uppercase tracking-[1.5px] text-[#c7b99d] transition hover:text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse border border-white/[0.07] bg-[#20201d] p-6"
                >
                  <div className="mb-6 flex justify-between gap-5">
                    <div className="space-y-3">
                      <div className="h-5 w-40 bg-white/10" />
                      <div className="h-3 w-56 bg-white/[0.06]" />
                    </div>
                    <div className="h-10 w-28 bg-white/[0.06]" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-24 bg-white/[0.05]" />
                    <div className="h-24 bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="flex flex-col items-center border border-red-400/20 bg-red-400/[0.04] px-6 py-16 text-center">
              <AlertCircle size={30} className="mb-4 text-red-400" />

              <h3 className="text-lg font-semibold">Unable to load orders</h3>

              <p className="mt-2 text-sm text-zinc-500">{error}</p>

              <button
                onClick={() => fetchOrders()}
                className="mt-6 border border-[#c7b99d]/30 px-6 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-[#c7b99d] transition hover:bg-[#c7b99d] hover:text-black"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="flex flex-col items-center border border-white/[0.07] bg-[#20201d] px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                <ShoppingBag size={27} />
              </div>

              <h3 className="text-xl font-semibold">
                {orders.length === 0
                  ? "No orders yet"
                  : "No matching orders"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                {orders.length === 0
                  ? "Customer orders will appear here when someone places an order."
                  : "Try changing your search term or selecting a different order status."}
              </p>
            </div>
          )}

          {/* ORDERS */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => {
                const statusStyle = getStatusStyle(order.status);
                const StatusIcon = statusStyle.icon;
                const products = Array.isArray(order.allProduct)
                  ? order.allProduct
                  : [];

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.2) }}
                    className="overflow-hidden border border-white/[0.08] bg-[#20201d]"
                  >
                    {/* ORDER HEADER */}
                    <div className="flex flex-col justify-between gap-6 border-b border-white/[0.07] p-5 sm:p-6 xl:flex-row xl:items-start">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="text-[9px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                            Order Reference
                          </span>

                          <span className="break-all font-mono text-xs text-zinc-400">
                            {order.orderId || order._id}
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                          {order.user?.name || "Customer"}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
                          <span className="flex items-center gap-2">
                            <Mail size={13} />
                            {order.user?.email || "Email unavailable"}
                          </span>

                          <span className="flex items-center gap-2">
                            <CalendarDays size={13} />
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center xl:items-end">
                        <div>
                          <p className="mb-1 text-[9px] uppercase tracking-[2px] text-zinc-600">
                            Order Total
                          </p>

                          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {formatCurrency(order.amount)}
                          </p>
                        </div>

                        <div className="relative w-full sm:w-auto">
                          <select
                            value={order.status || "Not processed"}
                            disabled={updatingOrder === order._id}
                            onChange={(e) =>
                              handleStatus(order._id, e.target.value)
                            }
                            className="w-full appearance-none border border-white/10 bg-[#171715] py-3 pl-4 pr-10 text-xs font-semibold text-zinc-200 outline-none transition hover:border-[#c7b99d]/40 focus:border-[#c7b99d]/60 disabled:cursor-wait disabled:opacity-50 sm:min-w-[175px]"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                          />

                          {updatingOrder === order._id && (
                            <p className="mt-2 text-[9px] uppercase tracking-[1.5px] text-[#c7b99d]">
                              Updating...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ORDER INFORMATION */}
                    <div className="grid gap-6 border-b border-white/[0.07] p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
                      <div>
                        <p className="mb-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                          <User size={13} />
                          Customer Information
                        </p>

                        <div className="space-y-3 text-xs text-zinc-400">
                          <p className="flex items-start gap-3">
                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-zinc-600"
                            />
                            <span className="leading-6">
                              {order.address || "Address unavailable"}
                            </span>
                          </p>

                          <p className="flex items-center gap-3">
                            <Phone size={14} className="text-zinc-600" />
                            {order.phone || "Phone unavailable"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-4 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                          <Layers3 size={13} />
                          Order Status
                        </p>

                        <div
                          className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-semibold ${statusStyle.color} ${statusStyle.background} ${statusStyle.border}`}
                        >
                          <StatusIcon size={14} />
                          {order.status || "Not processed"}
                        </div>

                        <p className="mt-3 text-[10px] text-zinc-600">
                          Change the status using the dropdown above.
                        </p>
                      </div>
                    </div>

                    {/* ORDERED PRODUCTS */}
                    <div className="p-5 sm:p-6">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                            Order Items
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {products.length}{" "}
                            {products.length === 1 ? "product" : "products"}
                          </p>
                        </div>

                        <Package size={19} className="text-zinc-600" />
                      </div>

                      {products.length > 0 ? (
                        <div className="grid gap-3 xl:grid-cols-2">
                          {products.map((item, itemIndex) => (
                            <div
                              key={item._id || `${order._id}-${itemIndex}`}
                              className="flex min-w-0 gap-4 border border-white/[0.06] bg-[#171715] p-3 sm:p-4"
                            >
                              <div className="h-20 w-20 shrink-0 overflow-hidden bg-[#252522] sm:h-24 sm:w-24">
                                <img
                                  src={getProductImageUrl(
                                    item.id?.pImages?.[0]
                                  )}
                                  alt={item.id?.pName || "Product"}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://placehold.co/300x300?text=No+Image";
                                  }}
                                  className="h-full w-full object-contain p-2 transition duration-500 hover:scale-105"
                                />
                              </div>

                              <div className="flex min-w-0 flex-1 flex-col justify-center">
                                <h3 className="line-clamp-2 text-sm font-semibold text-zinc-200">
                                  {item.id?.pName || "Product unavailable"}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500">
                                  <span>Qty: {item.quantity || 0}</span>
                                  <span>
                                    Size: {item.selectedSize || "N/A"}
                                  </span>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-[#c7b99d]">
                                  {formatCurrency(item.id?.pPrice)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="border border-white/[0.06] bg-[#171715] p-5 text-xs text-zinc-500">
                          Product information is unavailable for this order.
                        </p>
                      )}
                    </div>

                    {/* ORDER FOOTER */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-[#1b1b19] px-5 py-4 sm:px-6">
                      <p className="text-[9px] uppercase tracking-[1.5px] text-zinc-600">
                        Modern Shop · Order Management
                      </p>

                      <p className="text-xs text-zinc-400">
                        Total:{" "}
                        <span className="font-semibold text-[#c7b99d]">
                          {formatCurrency(order.amount)}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-12 border-t border-white/[0.07] pt-6">
            <p className="text-center text-[9px] uppercase tracking-[2px] text-zinc-700">
              Modern Shop · Admin Panel
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageOrders;
