
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  Save,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

function Profile() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getStoredUserId = () => {
    try {
      const localUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return localUser?.user?._id || null;
    } catch {
      return null;
    }
  };

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = getStoredUserId();

        if (!userId) {
          toast.error("Please log in to view your profile");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/single-user`,
          {
            uId: userId,
          }
        );

        if (response.data.success) {
          const userData = response.data.user;

          setUser(userData);
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPhoneNumber(userData.phoneNumber || "");
        } else {
          toast.error(
            response.data.message || "Unable to load profile"
          );
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const userId = getStoredUserId();

    if (!userId) {
      toast.error("Please log in again");
      return;
    }

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/edit-user`,
        {
          uId: userId,
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        setUser((prev) => ({
          ...prev,
          ...updatedUser,
        }));

        setName(updatedUser.name || name.trim());
        setEmail(updatedUser.email || email.trim());
        setPhoneNumber(updatedUser.phoneNumber || phoneNumber.trim());

        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const accountType =
    user?.userRole === 1 ? "Administrator" : "Customer";

  const inputClass =
    "w-full bg-[#111110] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-[#c7b99d]/70 focus:ring-1 focus:ring-[#c7b99d]/20";

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#171715] flex flex-col items-center justify-center text-white">
        <LoaderCircle
          size={34}
          className="animate-spin text-[#c7b99d] mb-5"
        />
        <p className="text-xs uppercase tracking-[4px] text-zinc-500">
          Loading your account
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#171715] flex flex-col items-center justify-center px-6 text-center text-white">
        <UserRound size={42} className="text-[#c7b99d] mb-5" />
        <h1 className="text-3xl font-semibold mb-3">
          Profile unavailable
        </h1>
        <p className="text-zinc-500">
          Please log in again to access your account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171715] text-white overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 right-[-100px] w-[500px] h-[500px] bg-[#c7b99d]/[0.06] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-[-150px] w-[400px] h-[400px] bg-[#a18e6d]/[0.05] blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20">

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-px bg-[#c7b99d]" />
            <p className="text-[#c7b99d] text-[10px] sm:text-xs uppercase tracking-[5px] font-medium">
              Your Account
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-3px] leading-none">
                My <span className="text-[#c7b99d]">Profile.</span>
              </h1>

              <p className="mt-5 text-zinc-500 text-sm sm:text-base max-w-lg leading-relaxed">
                Manage your personal details and keep your account
                information up to date.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-[2px]">
              <ShieldCheck size={16} className="text-[#c7b99d]" />
              Personal Account
            </div>
          </div>
        </motion.div>

        {/* PROFILE HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative border border-white/10 bg-[#20201d] overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#c7b99d]/[0.06] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative p-7 sm:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-7">
              {/* AVATAR */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                <div className="w-full h-full rounded-full border border-[#c7b99d]/50 bg-[#111110] flex items-center justify-center overflow-hidden">
                  <span className="text-4xl sm:text-5xl font-semibold text-[#c7b99d]">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#c7b99d] border-[4px] border-[#20201d]" />
              </div>

              {/* USER DETAILS */}
              <div className="flex-1 min-w-0">
                <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px] mb-3">
                  Welcome Back
                </p>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight break-words">
                  {user.name}
                </h2>

                <p className="text-zinc-400 mt-3 text-sm sm:text-base break-all">
                  {user.email}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <span className="inline-flex items-center gap-2 border border-[#c7b99d]/20 bg-[#c7b99d]/[0.08] text-[#c7b99d] px-4 py-2 text-[10px] uppercase tracking-[2px]">
                    <Sparkles size={13} />
                    {accountType}
                  </span>

                  <span className="inline-flex items-center gap-2 text-zinc-500 text-xs">
                    <CalendarDays size={14} />
                    Joined {joinedDate}
                  </span>
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-end gap-2 text-right">
                <span className="text-[10px] uppercase tracking-[3px] text-zinc-600">
                  Member Since
                </span>
                <span className="text-2xl font-light text-[#c7b99d]">
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ACCOUNT OVERVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 mb-12"
        >
          {/* ACCOUNT TYPE */}
          <div className="bg-[#1c1c19] p-7 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500">
                Account Type
              </p>
              <UserRound size={18} className="text-[#c7b99d]" />
            </div>

            <h3 className="text-3xl font-semibold tracking-tight">
              {accountType}
            </h3>
            <p className="text-xs text-zinc-600 mt-3">
              Your account category
            </p>
          </div>

          {/* SAVED ADDRESSES */}
          <div className="bg-[#1c1c19] p-7 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500">
                Saved Addresses
              </p>
              <MapPin size={18} className="text-[#c7b99d]" />
            </div>

            <h3 className="text-3xl font-semibold tracking-tight">
              {user.addresses?.length || 0}
            </h3>
            <p className="text-xs text-zinc-600 mt-3">
              Delivery locations saved
            </p>
          </div>

          {/* EMAIL STATUS */}
          <div className="bg-[#1c1c19] p-7 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] uppercase tracking-[3px] text-zinc-500">
                Email Status
              </p>
              <ShieldCheck size={18} className="text-[#c7b99d]" />
            </div>

            <h3 className="text-3xl font-semibold tracking-tight">
              {user.verified ? "Verified" : "Pending"}
            </h3>
            <p className="text-xs text-zinc-600 mt-3">
              Email verification status
            </p>
          </div>
        </motion.div>

        {/* PROFILE FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-[0.75fr_1.5fr] gap-10 lg:gap-16"
        >
          {/* LEFT CONTENT */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#c7b99d]" />
              <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
                Personal Information
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Your details,
              <br />
              your identity.
            </h2>

            <p className="text-zinc-500 text-sm leading-7 mt-5 max-w-sm">
              Keep your contact information accurate so we can provide
              a smoother shopping and delivery experience.
            </p>

            <div className="mt-10 border-t border-white/10 pt-7">
              <div className="flex items-center gap-3 text-zinc-500 text-xs">
                <ShieldCheck size={17} className="text-[#c7b99d]" />
                Your account information
              </div>
              <p className="text-zinc-600 text-xs leading-6 mt-3">
                Only update details that belong to you. Make sure your
                contact information is correct before saving.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleUpdateProfile}
            className="border border-white/10 bg-[#20201d] p-6 sm:p-9 lg:p-10"
          >
            <div className="flex items-center justify-between gap-4 mb-9">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold">
                  Edit Profile
                </h3>
                <p className="text-xs text-zinc-600 mt-2">
                  Update your personal details below.
                </p>
              </div>

              <div className="w-11 h-11 border border-[#c7b99d]/20 bg-[#c7b99d]/[0.06] flex items-center justify-center">
                <UserRound size={19} className="text-[#c7b99d]" />
              </div>
            </div>

            <div className="space-y-7">
              {/* NAME */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="flex items-center gap-2 text-xs text-zinc-400 mb-3"
                >
                  <UserRound size={14} className="text-[#c7b99d]" />
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="flex items-center gap-2 text-xs text-zinc-400 mb-3"
                >
                  <Mail size={14} className="text-[#c7b99d]" />
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={inputClass}
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="profile-phone"
                  className="flex items-center gap-2 text-xs text-zinc-400 mb-3"
                >
                  <Phone size={14} className="text-[#c7b99d]" />
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="mt-10 pt-7 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#c7b99d] text-[#171715] px-8 py-4 text-xs font-bold uppercase tracking-[2px] transition-all duration-300 hover:bg-[#ded2bb] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-600 mt-5 leading-relaxed">
                Your updated information will be saved to your account.
              </p>
            </div>
          </form>
        </motion.div>

        {/* BOTTOM SIGNATURE */}
        <div className="mt-20 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[3px] text-zinc-600">
            Modern Shop / Account
          </p>

          <p className="text-[10px] uppercase tracking-[2px] text-zinc-700">
            Designed for everyday essentials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
