
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Home,
  Building2,
  MapPinned,
  Phone,
  User,
  Check,
  Star,
  ArrowLeft,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  pincode: "",
  state: "",
  city: "",
  house: "",
  area: "",
  landmark: "",
  addressType: "Home",
  isDefault: false,
};

const inputClass =
  "w-full border border-white/[0.12] bg-[#111110] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#c7b99d]/70 focus:ring-1 focus:ring-[#c7b99d]/20";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressData, setAddressData] = useState(EMPTY_ADDRESS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isFromCheckout = location.state?.fromCheckout;

  // GET USER ID

  const getUserId = () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      return localUser?.user?._id || null;
    } catch {
      return null;
    }
  };

  // GET USER ADDRESSES

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getUserId();

      if (!userId) {
        setError("Please log in to manage your saved addresses.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/single-user`,
        {
          uId: userId,
        }
      );

      if (response.data.success) {
        setAddresses(response.data.user?.addresses || []);
      } else {
        setError(response.data.message || "Unable to load your addresses.");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while loading your addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // UPDATE FORM FIELD

  const updateField = (field, value) => {
    setAddressData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // OPEN ADD FORM

  const openAddForm = () => {
    setEditingAddressId(null);
    setAddressData({ ...EMPTY_ADDRESS });
    setShowAddressForm(true);
  };

  // CLOSE FORM

  const closeForm = () => {
    if (saving) return;

    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressData({ ...EMPTY_ADDRESS });
  };

  // ADD / EDIT ADDRESS

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    const requiredFields = [
      { key: "fullName", label: "Full Name" },
      { key: "phone", label: "Phone Number" },
      { key: "pincode", label: "Pincode" },
      { key: "state", label: "State" },
      { key: "city", label: "City" },
      { key: "house", label: "House / Flat" },
      { key: "area", label: "Area" },
    ];

    const emptyField = requiredFields.find(
      (field) => !addressData[field.key]?.trim()
    );

    if (emptyField) {
      toast.error(`Please enter ${emptyField.label}`);
      return;
    }

    if (!/^\d{10}$/.test(addressData.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(addressData.pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setSaving(true);

      const userId = getUserId();

      if (!userId) {
        toast.error("Please log in to save an address.");
        return;
      }

      let response;

      if (editingAddressId) {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/edit-address`,
          {
            uId: userId,
            addressId: editingAddressId,
            address: addressData,
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/add-address`,
          {
            uId: userId,
            address: addressData,
          }
        );
      }

      if (response.data.success) {
        toast.success(
          editingAddressId ? "Address updated successfully" : "Address added successfully"
        );

        if (isFromCheckout) {
          navigate("/checkout", { replace: true });
          return;
        }

        const updatedAddresses =
          response.data.user?.addresses || response.data.addresses;

        if (Array.isArray(updatedAddresses)) {
          setAddresses(updatedAddresses);
        } else {
          await fetchAddresses();
        }

        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressData({ ...EMPTY_ADDRESS });
      } else {
        toast.error(response.data.message || "Unable to save address.");
      }
    } catch (err) {
      console.error("Error saving address:", err);

      toast.error(
        err.response?.data?.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE ADDRESS

  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(addressId);

      const userId = getUserId();

      if (!userId) {
        toast.error("Please log in to continue.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/delete-address`,
        {
          uId: userId,
          addressId,
        }
      );

      if (response.data.success) {
        toast.success("Address deleted successfully");

        if (Array.isArray(response.data.addresses)) {
          setAddresses(response.data.addresses);
        } else {
          setAddresses((previous) =>
            previous.filter((address) => address._id !== addressId)
          );
        }
      } else {
        toast.error(response.data.message || "Unable to delete address.");
      }
    } catch (err) {
      console.error("Error deleting address:", err);

      toast.error(
        err.response?.data?.message || "Address deletion failed."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // EDIT ADDRESS

  const handleEditAddress = (address) => {
    setAddressData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      state: address.state || "",
      city: address.city || "",
      house: address.house || "",
      area: address.area || "",
      landmark: address.landmark || "",
      addressType: address.addressType || "Home",
      isDefault: address.isDefault || false,
    });

    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  // SET DEFAULT ADDRESS
  // This currently updates the page state only.

  const handleSetDefault = (addressId) => {
    setAddresses((previous) =>
      previous.map((address) => ({
        ...address,
        isDefault: address._id === addressId,
      }))
    );

    toast.success("Default address selected");
  };

  const addressTypes = [
    { value: "Home", icon: Home },
    { value: "Office", icon: Building2 },
    { value: "Other", icon: MapPinned },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#111110] text-[#f5f3ee]">

      {/* HERO */}

      <section className="relative border-b border-white/[0.07] bg-[#171715] px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-16 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full bg-[#c7b99d]/[0.07] blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          {isFromCheckout && (
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mb-9 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:text-[#d8c9aa]"
            >
              <ArrowLeft size={16} />
              Back to Checkout
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#c7b99d]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c7b99d] sm:text-xs">
                Your Delivery Details
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
                  Manage
                  <span className="ml-3 font-serif font-normal italic text-[#c7b99d]">
                    Address.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Keep your delivery information organised. Add, update, and
                  manage the addresses you use for your orders.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex w-fit items-center gap-3 bg-[#c7b99d] px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#171715] transition hover:bg-[#dfd1b6]"
              >
                <Plus size={17} />
                Add New Address
              </button>
            </div>
          </motion.div>

          {/* ADDRESS COUNT */}

          {!loading && !error && addresses.length > 0 && (
            <div className="mt-10 flex items-center gap-3 border-t border-white/[0.08] pt-6">
              <MapPin size={17} className="text-[#c7b99d]" />

              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                {addresses.length} Saved{" "}
                {addresses.length === 1 ? "Address" : "Addresses"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADER */}

          <div className="mb-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
              Your Locations
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Saved Addresses
            </h2>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center border border-white/[0.08] bg-[#171715]">
              <LoaderCircle
                size={34}
                className="animate-spin text-[#c7b99d]"
              />

              <p className="mt-5 text-sm text-zinc-400">
                Loading your saved addresses...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center border border-red-500/20 bg-[#171715] px-6 text-center">
              <AlertCircle size={36} className="text-red-400" />

              <h3 className="mt-5 text-xl font-bold text-white">
                Unable to load addresses
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchAddresses}
                className="mt-7 inline-flex items-center gap-2 bg-[#c7b99d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && addresses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden border border-white/[0.08] bg-[#171715] px-6 py-16 text-center"
            >
              <div className="pointer-events-none absolute -bottom-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c7b99d]/[0.07] blur-[90px]" />

              <div className="relative flex h-20 w-20 items-center justify-center border border-[#c7b99d]/30 bg-[#c7b99d]/[0.06]">
                <MapPin size={34} strokeWidth={1.3} className="text-[#c7b99d]" />
              </div>

              <p className="relative mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a18e6d]">
                Your Next Delivery Starts Here
              </p>

              <h3 className="relative mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                No Saved Address
              </h3>

              <p className="relative mt-4 max-w-md text-sm leading-7 text-zinc-400">
                Add your delivery address to make your next checkout smoother
                and easier.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="relative mt-8 inline-flex items-center gap-3 bg-[#c7b99d] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#171715] transition hover:bg-[#dfd1b6]"
              >
                <Plus size={16} />
                Add Your First Address
              </button>
            </motion.div>
          )}

          {/* ADDRESS GRID */}

          {!loading && !error && addresses.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {addresses.map((address, index) => {
                const AddressIcon =
                  address.addressType === "Office"
                    ? Building2
                    : address.addressType === "Other"
                      ? MapPinned
                      : Home;

                return (
                  <motion.article
                    key={address._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.08, 0.4),
                    }}
                    className="group relative overflow-hidden border border-white/[0.09] bg-[#171715] p-6 transition duration-300 hover:border-[#c7b99d]/35 sm:p-7"
                  >
                    {/* SUBTLE DECORATION */}

                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#c7b99d]/[0.035] blur-[65px] transition group-hover:bg-[#c7b99d]/[0.07]" />

                    {/* CARD HEADER */}

                    <div className="relative mb-7 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center border border-[#c7b99d]/25 bg-[#c7b99d]/[0.06]">
                          <AddressIcon
                            size={19}
                            className="text-[#c7b99d]"
                          />
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Address Type
                          </p>

                          <p className="mt-1 text-sm font-bold text-white">
                            {address.addressType || "Home"}
                          </p>
                        </div>
                      </div>

                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1.5 border border-[#c7b99d]/30 bg-[#c7b99d]/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#d8c9aa]">
                          <Star size={12} />
                          Default
                        </span>
                      )}
                    </div>

                    {/* NAME */}

                    <div className="relative">
                      <h3 className="break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
                        {address.fullName}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                        <Phone size={14} className="text-[#a18e6d]" />
                        {address.phone}
                      </div>
                    </div>

                    {/* ADDRESS DETAILS */}

                    <div className="relative mt-6 border-t border-white/[0.07] pt-5">
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={17}
                          className="mt-1 shrink-0 text-[#c7b99d]"
                        />

                        <div className="space-y-2 text-sm leading-6 text-zinc-400">
                          {address.house && <p>{address.house}</p>}

                          {address.area && <p>{address.area}</p>}

                          <p>
                            {[address.city, address.state]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                          {address.pincode && (
                            <p className="font-semibold tracking-wider text-zinc-300">
                              {address.pincode}
                            </p>
                          )}

                          {address.landmark && (
                            <p className="pt-2 text-xs text-zinc-500">
                              Landmark: {address.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="relative mt-7 flex flex-col gap-3 border-t border-white/[0.07] pt-5">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address._id)}
                          className="flex w-full items-center justify-center gap-2 border border-[#c7b99d]/30 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d8c9aa] transition hover:bg-[#c7b99d]/10"
                        >
                          <Star size={14} />
                          Set as Default
                        </button>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditAddress(address)}
                          className="flex flex-1 items-center justify-center gap-2 border border-white/[0.12] py-3 text-xs font-semibold text-zinc-300 transition hover:border-[#c7b99d]/50 hover:text-[#d8c9aa]"
                        >
                          <Edit2 size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address._id)}
                          disabled={deletingId === address._id}
                          className="flex flex-1 items-center justify-center gap-2 border border-red-500/20 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === address._id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM TRUST STRIP */}

      <section className="border-t border-white/[0.07] bg-[#171715] px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#c7b99d]" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7b99d]">
                Your Details, Your Control
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Keep your delivery information up to date.
              </p>
            </div>
          </div>

          {isFromCheckout && (
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 transition hover:text-[#d8c9aa]"
            >
              Return to Checkout →
            </button>
          )}
        </div>
      </section>

      {/* ADD / EDIT ADDRESS MODAL */}

      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeForm();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto border border-white/[0.1] bg-[#171715] shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.08] bg-[#171715]/95 px-5 py-5 backdrop-blur sm:px-8 sm:py-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a18e6d]">
                    Delivery Information
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {editingAddressId ? "Edit Address" : "New Address"}
                  </h2>

                  <p className="mt-2 text-xs text-zinc-500">
                    Enter the details for your delivery location.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  aria-label="Close address form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/[0.1] text-zinc-400 transition hover:border-[#c7b99d]/40 hover:text-white disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              {/* FORM */}

              <form onSubmit={handleSaveAddress} className="p-5 sm:p-8">
                <div className="mb-7">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c7b99d]">
                    Personal Details
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        Full Name *
                      </span>

                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                        />

                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={addressData.fullName}
                          onChange={(e) =>
                            updateField("fullName", e.target.value)
                          }
                          className={`${inputClass} pl-11`}
                          required
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        Phone Number *
                      </span>

                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit phone number"
                        value={addressData.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className={inputClass}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        Pincode *
                      </span>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={addressData.pincode}
                        onChange={(e) =>
                          updateField(
                            "pincode",
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        className={inputClass}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-7 border-t border-white/[0.08] pt-7">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c7b99d]">
                    Address Details
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        House / Flat *
                      </span>

                      <input
                        type="text"
                        placeholder="House number, flat, building"
                        value={addressData.house}
                        onChange={(e) =>
                          updateField("house", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        Area / Street *
                      </span>

                      <input
                        type="text"
                        placeholder="Area or street name"
                        value={addressData.area}
                        onChange={(e) =>
                          updateField("area", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        City *
                      </span>

                      <input
                        type="text"
                        placeholder="Enter city"
                        value={addressData.city}
                        onChange={(e) =>
                          updateField("city", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        State *
                      </span>

                      <input
                        type="text"
                        placeholder="Enter state"
                        value={addressData.state}
                        onChange={(e) =>
                          updateField("state", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-xs font-medium text-zinc-400">
                        Landmark (Optional)
                      </span>

                      <input
                        type="text"
                        placeholder="Nearby landmark"
                        value={addressData.landmark}
                        onChange={(e) =>
                          updateField("landmark", e.target.value)
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>

                {/* ADDRESS TYPE */}

                <div className="border-t border-white/[0.08] pt-7">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c7b99d]">
                    Save Address As
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {addressTypes.map((type) => {
                      const TypeIcon = type.icon;
                      const selected =
                        addressData.addressType === type.value;

                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            updateField("addressType", type.value)
                          }
                          className={`flex flex-col items-center justify-center gap-2 border px-3 py-4 transition ${
                            selected
                              ? "border-[#c7b99d] bg-[#c7b99d]/10 text-[#d8c9aa]"
                              : "border-white/[0.1] bg-[#111110] text-zinc-500 hover:border-white/25 hover:text-white"
                          }`}
                        >
                          <TypeIcon size={19} />

                          <span className="text-xs font-semibold">
                            {type.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DEFAULT CHECKBOX */}

                <label className="mt-6 flex cursor-pointer items-center gap-3 border border-white/[0.08] bg-[#111110] p-4">
                  <input
                    type="checkbox"
                    checked={addressData.isDefault}
                    onChange={(e) =>
                      updateField("isDefault", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#c7b99d]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Save as default address
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-500">
                      Mark this address as your preferred delivery location.
                    </p>
                  </div>
                </label>

                {/* FORM BUTTONS */}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="border border-white/[0.12] px-7 py-4 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-[#c7b99d] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#171715] transition hover:bg-[#dfd1b6] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default ManageAddress;
