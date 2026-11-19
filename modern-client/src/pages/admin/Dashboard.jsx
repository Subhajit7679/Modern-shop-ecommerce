
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Sidebar from "./Sidebar";
import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // FETCH DASHBOARD DATA
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getDashboardData();

      setDashboard(response);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(true);
      toast.error("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: dashboard?.totalProducts ?? 0,
      icon: Package,
      description: "Products in your store",
    },
    {
      title: "Total Orders",
      value: dashboard?.totalOrders ?? 0,
      icon: ShoppingBag,
      description: "Orders received",
    },
    {
      title: "Delivered",
      value: dashboard?.deliveredOrders ?? 0,
      icon: CheckCircle2,
      description: "Successfully delivered",
    },
    {
      title: "Shipped",
      value: dashboard?.shippedOrders ?? 0,
      icon: Truck,
      description: "Orders on the way",
    },
    {
      title: "Processing",
      value: dashboard?.processingOrders ?? 0,
      icon: Clock,
      description: "Orders being prepared",
    },
    {
      title: "Cancelled",
      value: dashboard?.cancelledOrders ?? 0,
      icon: XCircle,
      description: "Cancelled orders",
    },
  ];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

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
    const normalized = status?.toLowerCase();

    if (normalized === "delivered") {
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    }

    if (normalized === "shipped") {
      return "text-sky-400 bg-sky-400/10 border-sky-400/20";
    }

    if (normalized === "processing") {
      return "text-[#c7b99d] bg-[#c7b99d]/10 border-[#c7b99d]/20";
    }

    if (normalized === "cancelled") {
      return "text-red-400 bg-red-400/10 border-red-400/20";
    }

    return "text-zinc-400 bg-white/5 border-white/10";
  };

  return (
    <div className="min-h-screen bg-[#171715] text-white">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen md:ml-[250px] px-5 sm:px-8 lg:px-10 py-10 md:py-12">

        {/* BACKGROUND ACCENT */}
        <div className="fixed top-[-180px] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#c7b99d]/[0.035] blur-[150px] pointer-events-none" />

        <div className="relative max-w-[1600px] mx-auto">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-px bg-[#c7b99d]" />

              <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                Store Administration
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-2px]">
                  Dashboard<span className="text-[#c7b99d]">.</span>
                </h1>

                <p className="text-sm text-zinc-500 mt-4 leading-7">
                  Welcome to Modern Shop. Here's an overview of your store.
                </p>
              </div>

              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="self-start lg:self-auto flex items-center gap-3 border border-white/10 px-5 py-3 text-xs uppercase tracking-[2px] text-zinc-400 hover:text-[#c7b99d] hover:border-[#c7b99d]/40 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Data
              </button>
            </div>
          </motion.div>

          {/* LOADING STATE */}
          {loading && !dashboard && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="h-40 bg-[#20201d] border border-white/5 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {error && !dashboard && !loading && (
            <div className="border border-white/10 bg-[#20201d] p-10 text-center">
              <Package
                size={32}
                className="text-[#c7b99d] mx-auto mb-5"
              />

              <h2 className="text-xl font-semibold">
                Dashboard unavailable
              </h2>

              <p className="text-sm text-zinc-500 mt-3 mb-7">
                We couldn't retrieve your store information.
              </p>

              <button
                onClick={fetchDashboard}
                className="bg-[#c7b99d] text-[#171715] px-7 py-3 text-xs font-bold uppercase tracking-[2px]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* DASHBOARD CONTENT */}
          {dashboard && (
            <>
              {/* STATS */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <LayoutDashboard
                    size={16}
                    className="text-[#c7b99d]"
                  />

                  <h2 className="text-xs uppercase tracking-[3px] text-zinc-400">
                    Store Overview
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="group relative bg-[#20201d] border border-white/[0.07] p-6 sm:p-7 hover:border-[#c7b99d]/30 transition duration-300 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-28 h-28 bg-[#c7b99d]/[0.025] blur-2xl group-hover:bg-[#c7b99d]/[0.07] transition" />

                        <div className="relative flex items-start justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[2px] text-zinc-500">
                              {stat.title}
                            </p>

                            <h3 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-5 tabular-nums">
                              {Number(stat.value).toLocaleString("en-IN")}
                            </h3>

                            <p className="text-[11px] text-zinc-600 mt-3">
                              {stat.description}
                            </p>
                          </div>

                          <div className="w-11 h-11 flex items-center justify-center border border-[#c7b99d]/15 bg-[#c7b99d]/[0.06]">
                            <Icon
                              size={19}
                              className="text-[#c7b99d]"
                            />
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c7b99d] group-hover:w-full transition-all duration-500" />
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* REVENUE */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 bg-[#20201d] border border-white/[0.07] p-7 sm:p-9 relative overflow-hidden"
              >
                <div className="absolute right-[-40px] top-[-80px] w-64 h-64 rounded-full border border-[#c7b99d]/[0.06]" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <IndianRupee
                        size={17}
                        className="text-[#c7b99d]"
                      />

                      <p className="text-[10px] uppercase tracking-[3px] text-zinc-500">
                        Total Store Revenue
                      </p>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#c7b99d]">
                      {formatCurrency(dashboard.totalRevenue)}
                    </h2>

                    <p className="text-xs text-zinc-600 mt-4">
                      Revenue value reported by your dashboard API
                    </p>
                  </div>

                  <div className="w-16 h-16 border border-[#c7b99d]/20 bg-[#c7b99d]/[0.06] flex items-center justify-center">
                    <IndianRupee
                      size={29}
                      className="text-[#c7b99d]"
                    />
                  </div>
                </div>
              </motion.section>

              {/* QUICK ACTIONS */}
              <section className="mt-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-[#c7b99d]" />

                  <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                    Quick Actions
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

                  <Link
                    to="/admin/add-product"
                    className="group bg-[#c7b99d] text-[#171715] p-6 flex items-center justify-between hover:bg-[#ded2bb] transition"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[2px] opacity-60">
                        Inventory
                      </p>

                      <h3 className="text-lg font-bold mt-2">
                        Add Product
                      </h3>
                    </div>

                    <ArrowUpRight
                      size={21}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>

                  <Link
                    to="/admin/manage-products"
                    className="group bg-[#20201d] border border-white/10 p-6 flex items-center justify-between hover:border-[#c7b99d]/40 transition"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[2px] text-zinc-600">
                        Catalogue
                      </p>

                      <h3 className="text-lg font-semibold mt-2">
                        Manage Products
                      </h3>
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-[#c7b99d] transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    to="/admin/manage-coupons"
                    className="group bg-[#20201d] border border-white/10 p-6 flex items-center justify-between hover:border-[#c7b99d]/40 transition"
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[2px] text-zinc-600">
                        Promotions
                      </p>

                      <h3 className="text-lg font-semibold mt-2">
                        Manage Coupons
                      </h3>
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-[#c7b99d] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </section>

              {/* RECENT ORDERS */}
              <section className="mt-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-px bg-[#c7b99d]" />

                      <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                        Latest Activity
                      </p>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                      Recent Orders<span className="text-[#c7b99d]">.</span>
                    </h2>
                  </div>

                  <Link
                    to="/admin/manage-orders"
                    className="flex items-center gap-3 text-xs uppercase tracking-[2px] text-zinc-400 hover:text-[#c7b99d] transition"
                  >
                    View All Orders
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="border border-white/10 bg-[#20201d] overflow-hidden">

                  {dashboard.recentOrders?.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                      {dashboard.recentOrders.map((order, index) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-white/[0.02] transition"
                        >
                          {/* CUSTOMER */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 shrink-0 bg-[#c7b99d]/[0.08] border border-[#c7b99d]/15 text-[#c7b99d] flex items-center justify-center text-sm font-semibold">
                              {order.user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-zinc-200 truncate">
                                {order.user?.name || "Customer"}
                              </h3>

                              <p className="text-xs text-zinc-600 mt-1 truncate">
                                {order.user?.email || "Email unavailable"}
                              </p>
                            </div>
                          </div>

                          {/* ORDER DETAILS */}
                          <div className="flex flex-wrap items-center gap-5 sm:gap-8 sm:justify-end">
                            <div>
                              <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 mb-2">
                                Order Amount
                              </p>

                              <p className="text-base font-semibold text-[#c7b99d]">
                                {formatCurrency(order.amount)}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 mb-2">
                                Status
                              </p>

                              <span
                                className={`inline-flex items-center border px-3 py-1.5 text-[9px] uppercase tracking-[1px] ${getStatusStyle(order.status)}`}
                              >
                                {order.status || "Unknown"}
                              </span>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 mb-2">
                                Date
                              </p>

                              <p className="text-xs text-zinc-400 flex items-center gap-2">
                                <CalendarDays size={13} />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <ShoppingBag
                        size={28}
                        className="text-[#c7b99d] mx-auto mb-4"
                      />

                      <h3 className="text-sm font-medium text-zinc-300">
                        No recent orders
                      </h3>

                      <p className="text-xs text-zinc-600 mt-2">
                        New customer orders will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* FOOTER */}
              <div className="mt-16 pt-7 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[3px] text-zinc-600">
                  Modern Shop / Administration
                </p>

                <p className="text-[9px] uppercase tracking-[2px] text-zinc-700">
                  Style. Quality. Simplicity.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
