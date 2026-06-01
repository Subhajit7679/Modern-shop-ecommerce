import { useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import Sidebar from "./Sidebar";

function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",

    discountPercent: "",

    minAmount: "",

    expiryDate: "",
  });

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // FETCH COUPONS
  // =========================

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/coupon/all-coupons",
      );

      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // =========================
  // CREATE COUPON
  // =========================

  const createCoupon = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/coupon/create-coupon",

        formData,
      );

      if (response.data.success) {
        toast.success("Coupon created");

        setFormData({
          code: "",

          discountPercent: "",

          minAmount: "",

          expiryDate: "",
        });

        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        flex
      "
    >
      <Sidebar />

      <div
        className="
          flex-1
          ml-[250px]
          p-10
        "
      >
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
            Admin Panel
          </p>

          <h1
            className="
              text-5xl
              font-black
            "
          >
            Manage Coupons
          </h1>
        </div>

        {/* CREATE FORM */}

        <form
          onSubmit={createCoupon}
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-8
            mb-12
          "
        >
          <h2
            className="
              text-3xl
              font-black
              mb-8
            "
          >
            Create Coupon
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            <input
              type="text"
              name="code"
              placeholder="SAVE10"
              value={formData.code}
              onChange={handleChange}
              className="
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
                outline-none
              "
            />

            <input
              type="number"
              name="discountPercent"
              placeholder="Discount %"
              value={formData.discountPercent}
              onChange={handleChange}
              className="
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
                outline-none
              "
            />

            <input
              type="number"
              name="minAmount"
              placeholder="Minimum Amount"
              value={formData.minAmount}
              onChange={handleChange}
              className="
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
                outline-none
              "
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
                outline-none
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              mt-8
              bg-white
              text-black
              px-8
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition
            "
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </form>

        {/* COUPON TABLE */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-8
          "
        >
          <h2
            className="
              text-3xl
              font-black
              mb-8
            "
          >
            All Coupons
          </h2>

          <div className="space-y-5">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="
                  bg-black
                  border
                  border-zinc-800
                  rounded-3xl
                  p-6
                  flex
                  items-center
                  justify-between
                "
              >
                {/* LEFT */}

                <div>
                  <h3
                    className="
                      text-2xl
                      font-black
                      mb-2
                    "
                  >
                    {coupon.code}
                  </h3>

                  <div
                    className="
                      flex
                      gap-6
                      text-zinc-400
                    "
                  >
                    <p>{coupon.discountPercent}% OFF</p>

                    <p>Min ₹{coupon.minAmount}</p>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="text-right">
                  <p
                    className="
                      text-zinc-500
                      mb-2
                    "
                  >
                    Expires
                  </p>

                  <h3
                    className="
                      font-semibold
                    "
                  >
                    {new Date(coupon.expiryDate).toDateString()}
                  </h3>

                  <div
                    className={`
                      mt-4
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold

                      ${
                        coupon.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCoupons;
