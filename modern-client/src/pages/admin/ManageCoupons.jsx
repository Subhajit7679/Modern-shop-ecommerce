
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  TicketPercent,
  Plus,
  Tag,
  CalendarDays,
  IndianRupee,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Copy,
  Percent,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import Sidebar from "./Sidebar";

const INITIAL_FORM = {
  code: "",
  discountPercent: "",
  minAmount: "",
  expiryDate: "",
};

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

const getExpiryStatus = (date, isActive) => {
  const expiry = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (!isActive) {
    return {
      label: "Inactive",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: XCircle,
    };
  }

  if (Number.isNaN(expiry.getTime())) {
    return {
      label: "Unknown expiry",
      color: "text-zinc-400",
      bg: "bg-white/[0.05]",
      border: "border-white/10",
      icon: AlertCircle,
    };
  }

  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return {
      label: "Expired",
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: XCircle,
    };
  }

  if (expiry.getTime() === today.getTime()) {
    return {
      label: "Expires today",
      color: "text-amber-300",
      bg: "bg-amber-300/10",
      border: "border-amber-300/20",
      icon: Clock3,
    };
  }

  return {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: CheckCircle2,
  };
};

function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [copiedCode, setCopiedCode] = useState("");

  const [formData, setFormData] = useState(INITIAL_FORM);

  const [formErrors, setFormErrors] = useState({});

  // FETCH COUPONS
  const fetchCoupons = async (showLoader = true) => {
    try {
      if (showLoader) setFetching(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/coupon/all-coupons`
      );

      if (response.data.success) {
        setCoupons(response.data.coupons || []);
      } else {
        toast.error(response.data.message || "Unable to load coupons");
      }
    } catch (error) {
      console.error("Fetch coupons error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load coupons"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase().replace(/\s/g, "") : value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // VALIDATE FORM
  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    }

    const discount = Number(formData.discountPercent);

    if (
      formData.discountPercent === "" ||
      !Number.isFinite(discount) ||
      discount < 1 ||
      discount > 100
    ) {
      errors.discountPercent = "Enter a discount between 1 and 100";
    }

    const minAmount = Number(formData.minAmount);

    if (
      formData.minAmount === "" ||
      !Number.isFinite(minAmount) ||
      minAmount < 0
    ) {
      errors.minAmount = "Enter a valid minimum amount";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else {
      const selectedDate = new Date(`${formData.expiryDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.expiryDate = "Expiry date cannot be in the past";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // CREATE COUPON
  const createCoupon = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/coupon/create-coupon`,
        formData
      );

      if (response.data.success) {
        toast.success("Coupon created successfully");

        setFormData(INITIAL_FORM);
        setFormErrors({});

        await fetchCoupons(false);
      } else {
        toast.error(response.data.message || "Unable to create coupon");
      }
    } catch (error) {
      console.error("Create coupon error:", error);

      toast.error(
        error.response?.data?.message || "Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  // COPY COUPON CODE
  const copyCouponCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Coupon code copied");
    } catch (error) {
      console.error("Copy coupon error:", error);
      toast.error("Unable to copy coupon code");
    }
  };

  // FILTER COUPONS
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const expiryStatus = getExpiryStatus(
        coupon.expiryDate,
        coupon.isActive
      );

      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && expiryStatus.label === "Active") ||
        (filter === "Inactive" && expiryStatus.label === "Inactive") ||
        (filter === "Expired" && expiryStatus.label === "Expired");

      return matchesSearch && matchesFilter;
    });
  }, [coupons, searchTerm, filter]);

  // STATISTICS
  const stats = useMemo(() => {
    const active = coupons.filter(
      (coupon) =>
        getExpiryStatus(coupon.expiryDate, coupon.isActive).label === "Active"
    ).length;

    const expired = coupons.filter(
      (coupon) =>
        getExpiryStatus(coupon.expiryDate, coupon.isActive).label === "Expired"
    ).length;

    const inactive = coupons.filter(
      (coupon) => !coupon.isActive
    ).length;

    return {
      total: coupons.length,
      active,
      expired,
      inactive,
    };
  }, [coupons]);

  const statCards = [
    {
      label: "Total Coupons",
      value: stats.total,
      icon: TicketPercent,
      description: "All created coupons",
    },
    {
      label: "Active Coupons",
      value: stats.active,
      icon: CheckCircle2,
      description: "Currently valid coupons",
    },
    {
      label: "Expired Coupons",
      value: stats.expired,
      icon: Clock3,
      description: "Past expiry date",
    },
    {
      label: "Inactive Coupons",
      value: stats.inactive,
      icon: XCircle,
      description: "Disabled coupons",
    },
  ];

  const inputClass =
    "w-full border border-white/10 bg-[#171715] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c7b99d]/60";

  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[1.5px] text-zinc-400";

  return (
    <div className="min-h-screen bg-[#171715] text-white">
      <Sidebar />

      <main className="min-h-screen px-4 py-7 sm:px-7 lg:ml-[250px] lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1500px]">

          {/* HEADER */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c7b99d]" />
              <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#c7b99d]">
                Store Administration
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Manage <span className="text-[#c7b99d]">Coupons.</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                  Create exclusive offers, manage discount codes, and reward
                  your customers.
                </p>
              </div>

              <button
                onClick={() => fetchCoupons(false)}
                disabled={fetching}
                className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-zinc-300 transition hover:border-[#c7b99d]/40 hover:text-[#c7b99d] disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={fetching ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
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

          {/* CREATE COUPON */}
          <section className="mb-10 border border-white/[0.08] bg-[#20201d]">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:p-7">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#c7b99d]">
                  <Sparkles size={15} />
                  <span className="text-[9px] font-semibold uppercase tracking-[2px]">
                    New Promotion
                  </span>
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Create Coupon
                </h2>

                <p className="mt-2 text-xs text-zinc-500">
                  Configure a new discount offer for your customers.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                <TicketPercent size={23} />
              </div>
            </div>

            <form onSubmit={createCoupon} className="p-5 sm:p-7">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                {/* CODE */}
                <div>
                  <label className={labelClass}>Coupon Code</label>

                  <div className="relative">
                    <Tag
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                    />

                    <input
                      type="text"
                      name="code"
                      placeholder="SAVE10"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      maxLength={30}
                      className={`${inputClass} pl-11 uppercase`}
                    />
                  </div>

                  {formErrors.code && (
                    <p className="mt-2 text-[10px] text-red-400">
                      {formErrors.code}
                    </p>
                  )}
                </div>

                {/* DISCOUNT */}
                <div>
                  <label className={labelClass}>Discount Percentage</label>

                  <div className="relative">
                    <Percent
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                    />

                    <input
                      type="number"
                      name="discountPercent"
                      placeholder="10"
                      min="1"
                      max="100"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11 pr-12`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                      %
                    </span>
                  </div>

                  {formErrors.discountPercent && (
                    <p className="mt-2 text-[10px] text-red-400">
                      {formErrors.discountPercent}
                    </p>
                  )}
                </div>

                {/* MINIMUM AMOUNT */}
                <div>
                  <label className={labelClass}>Minimum Order Amount</label>

                  <div className="relative">
                    <IndianRupee
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                    />

                    <input
                      type="number"
                      name="minAmount"
                      placeholder="999"
                      min="0"
                      value={formData.minAmount}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  {formErrors.minAmount && (
                    <p className="mt-2 text-[10px] text-red-400">
                      {formErrors.minAmount}
                    </p>
                  )}
                </div>

                {/* EXPIRY DATE */}
                <div>
                  <label className={labelClass}>Expiry Date</label>

                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                    />

                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toLocaleDateString("en-CA")}
                      required
                      className={`${inputClass} pl-11 [color-scheme:dark]`}
                    />
                  </div>

                  {formErrors.expiryDate && (
                    <p className="mt-2 text-[10px] text-red-400">
                      {formErrors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              {/* COUPON PREVIEW */}
              <div className="mt-7 flex flex-col justify-between gap-5 border border-[#c7b99d]/15 bg-[#171715] p-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                    <TicketPercent size={20} />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                      Coupon Preview
                    </p>

                    <h3 className="mt-1 text-lg font-bold tracking-wider text-[#c7b99d]">
                      {formData.code || "YOURCODE"}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-xs text-zinc-400">
                  <div>
                    <p className="text-[9px] uppercase tracking-[1px] text-zinc-600">
                      Discount
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {formData.discountPercent || "0"}% OFF
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[1px] text-zinc-600">
                      Minimum Spend
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {formatCurrency(formData.minAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
                <p className="max-w-md text-[10px] leading-5 text-zinc-600">
                  Review your discount percentage, minimum order value, and
                  expiry date before creating the coupon.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-3 bg-[#c7b99d] px-7 py-4 text-xs font-bold uppercase tracking-[1.5px] text-[#171715] transition hover:bg-[#ded2bb] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Coupon
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ALL COUPONS */}
          <section>
            <div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#c7b99d]">
                  <TicketPercent size={15} />
                  <span className="text-[9px] font-semibold uppercase tracking-[2px]">
                    Promotion Library
                  </span>
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  All Coupons
                </h2>

                <p className="mt-2 text-xs text-zinc-500">
                  Manage and monitor your existing discount codes.
                </p>
              </div>

              <div className="relative w-full xl:max-w-[300px]">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search coupon code..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* FILTERS */}
            <div className="mb-5 flex flex-wrap gap-2">
              {["All", "Active", "Inactive", "Expired"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[1.5px] transition ${
                    filter === item
                      ? "border-[#c7b99d] bg-[#c7b99d] text-[#171715]"
                      : "border-white/10 bg-[#20201d] text-zinc-500 hover:border-[#c7b99d]/40 hover:text-[#c7b99d]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* LOADING */}
            {fetching && (
              <div className="grid gap-4 lg:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse border border-white/[0.07] bg-[#20201d]"
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!fetching && filteredCoupons.length === 0 && (
              <div className="flex flex-col items-center border border-white/[0.07] bg-[#20201d] px-6 py-16 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                  <TicketPercent size={27} />
                </div>

                <h3 className="text-xl font-semibold">
                  {coupons.length === 0
                    ? "No coupons created yet"
                    : "No matching coupons"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  {coupons.length === 0
                    ? "Create your first discount coupon using the form above."
                    : "Try another coupon code or change the selected filter."}
                </p>
              </div>
            )}

            {/* COUPON CARDS */}
            {!fetching && filteredCoupons.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredCoupons.map((coupon, index) => {
                  const status = getExpiryStatus(
                    coupon.expiryDate,
                    coupon.isActive
                  );

                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={coupon._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.2) }}
                      className="group relative overflow-hidden border border-white/[0.08] bg-[#20201d] transition duration-300 hover:border-[#c7b99d]/30"
                    >
                      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#c7b99d]/[0.04] blur-3xl transition group-hover:bg-[#c7b99d]/[0.10]" />

                      <div className="relative flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                        {/* LEFT */}
                        <div className="min-w-0">
                          <div className="mb-4 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]">
                              <Tag size={15} />
                            </span>

                            <span className="text-[9px] uppercase tracking-[2px] text-zinc-600">
                              Discount Code
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="break-all text-2xl font-bold tracking-[2px] text-[#c7b99d]">
                              {coupon.code}
                            </h3>

                            <button
                              type="button"
                              onClick={() => copyCouponCode(coupon.code)}
                              title="Copy coupon code"
                              className="flex h-8 w-8 items-center justify-center border border-white/10 text-zinc-500 transition hover:border-[#c7b99d]/40 hover:text-[#c7b99d]"
                            >
                              {copiedCode === coupon.code ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                            <div>
                              <p className="text-[9px] uppercase tracking-[1.5px] text-zinc-600">
                                Discount
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white">
                                {coupon.discountPercent}% OFF
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-[1.5px] text-zinc-600">
                                Minimum Spend
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white">
                                {formatCurrency(coupon.minAmount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex shrink-0 flex-row items-end justify-between gap-5 border-t border-white/[0.07] pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="mb-2 text-[9px] uppercase tracking-[1.5px] text-zinc-600">
                              Expires On
                            </p>

                            <p className="flex items-center gap-2 text-xs font-semibold text-zinc-300 sm:justify-end">
                              <CalendarDays
                                size={13}
                                className="text-[#c7b99d]"
                              />
                              {formatDate(coupon.expiryDate)}
                            </p>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 border px-3 py-2 text-[9px] font-semibold uppercase tracking-[1px] ${status.color} ${status.bg} ${status.border}`}
                          >
                            <StatusIcon size={12} />
                            {status.label}
                          </div>
                        </div>
                      </div>

                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c7b99d]/20 to-transparent" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

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

export default ManageCoupons;
