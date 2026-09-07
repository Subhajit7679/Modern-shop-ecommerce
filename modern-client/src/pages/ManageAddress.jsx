import { useEffect, useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressData, setAddressData] = useState({
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
  });
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // GET USER ADDRESSES
  // =========================

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/single-user`,
          {
            uId: localUser.user._id,
          },
        );

        if (response.data.success) {
          setAddresses(response.data.user.addresses || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddresses();
  }, []);

  // =========================
  // ADD / EDIT ADDRESS
  // =========================

  const handleSaveAddress = async () => {
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
    (field) => !addressData[field.key]?.trim()
  );

  if (emptyField) {
    toast.error(`Please fill in ${emptyField.label}`);
    return;
  }

  try {
      const localUser = JSON.parse(localStorage.getItem("user"));

      let response;

      // EDIT

      if (editingAddressId) {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/edit-address`,
          {
            uId: localUser.user._id,

            addressId: editingAddressId,

            address: addressData,
          },
        );
      }

      // ADD
      else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/add-address`,
          {
            uId: localUser.user._id,

            address: addressData,
          },
        );
      }

      if (response.data.success) {
        toast.success(editingAddressId ? "Address updated" : "Address added");
        if (location.state?.fromCheckout) {
          navigate("/checkout");
          return;
        }

        setAddresses(response.data.user?.addresses || response.data.addresses);

        setShowAddressForm(false);

        setEditingAddressId(null);

        setAddressData({
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
        });
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const handleDeleteAddress = async (addressId) => {
    try {
      const confirmDelete = window.confirm("Delete this address?");

      if (!confirmDelete) return;

      const localUser = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/delete-address`,
        {
          uId: localUser.user._id,

          addressId,
        },
      );

      if (response.data.success) {
        toast.success("Address deleted");

        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  // =========================
  // EDIT ADDRESS
  // =========================

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

  // =========================
  // SET DEFAULT ADDRESS
  // =========================

  const handleSetDefault = async (addressId) => {
    try {
      const updatedAddresses = addresses.map((address) => ({
        ...address,

        isDefault: address._id === addressId,
      }));

      setAddresses(updatedAddresses);

      toast.success("Default address updated");
    } catch (error) {
      console.log(error);

      toast.error("Failed to update");
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        md:px-8
        py-10
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
            mb-10
          "
        >
          <div>
            <p
              className="
                uppercase
                tracking-[6px]
                text-zinc-500
                text-sm
                mb-3
              "
            >
              Delivery
            </p>

            <h1
              className="
                text-5xl
                md:text-6xl
                font-black
              "
            >
              Manage Address
            </h1>
          </div>

          <button
            onClick={() => {
              setEditingAddressId(null);

              setAddressData({
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
              });

              setShowAddressForm(true);
            }}
            className="
              bg-white
              text-black
              px-7
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition
              w-fit
            "
          >
            + Add Address
          </button>
        </div>

        {/* EMPTY */}

        {addresses.length === 0 && (
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-[32px]
              p-20
              text-center
            "
          >
            <div className="text-8xl mb-6">📍</div>

            <h2
              className="
                text-4xl
                font-black
                mb-4
              "
            >
              No Saved Address
            </h2>

            <p
              className="
                text-zinc-500
                text-lg
              "
            >
              Add your delivery address
            </p>
          </div>
        )}

        {/* ADDRESS GRID */}

        {addresses.length > 0 && (
          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            {addresses.map((address, index) => (
              <div
                key={index}
                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-[32px]
                    p-6
                    relative
                  "
              >
                {/* DEFAULT */}

                {address.isDefault && (
                  <div
                    className="
                    absolute
                    top-5
                   right-35
                   bg-green-500/20
                   text-green-400
                    px-4
                    py-2
                   rounded-full
                   text-xs
                   font-bold
                   "
                  >
                    DEFAULT
                  </div>
                )}

                {/* TOP */}

                <div
                  className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    "
                >
                  <span
                    className="
                        bg-white
                        text-black
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-bold
                      "
                  >
                    {address.addressType}
                  </span>

                  <div
                    className="
                        flex
                        items-center
                        gap-3
                      "
                  >
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="
                          w-11
                          h-11
                          rounded-xl
                          bg-zinc-800
                          flex
                          items-center
                          justify-center
                          hover:bg-zinc-700
                          transition
                        "
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="
                          w-11
                          h-11
                          rounded-xl
                          bg-red-500/20
                          text-red-400
                          flex
                          items-center
                          justify-center
                          hover:bg-red-500/30
                          transition
                        "
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* BODY */}

                <h2
                  className="
                      text-3xl
                      font-black
                      mb-3
                    "
                >
                  {address.fullName}
                </h2>

                <p
                  className="
                      text-zinc-400
                      mb-5
                    "
                >
                  {address.phone}
                </p>

                <div
                  className="
                      text-zinc-300
                      leading-8
                    "
                >
                  <p>{address.house}</p>

                  <p>{address.area}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>{address.pincode}</p>

                  {address.landmark && (
                    <p className="mt-4">Landmark : {address.landmark}</p>
                  )}
                </div>

                {/* DEFAULT BUTTON */}

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="
                        mt-8
                        w-full
                        border
                        border-zinc-700
                        py-4
                        rounded-2xl
                        hover:bg-zinc-800
                        transition
                        font-semibold
                      "
                  >
                    Set As Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADDRESS MODAL */}

        {showAddressForm && (
          <div
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-sm
              z-50
              flex
              items-center
              justify-center
              p-4
            "
          >
            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-[32px]
                w-full
                max-w-3xl
                p-6
                relative
              "
            >
              {/* CLOSE */}

              <button
                onClick={() => setShowAddressForm(false)}
                className="
                  absolute
                  top-5
                  right-5
                  text-zinc-400
                  text-2xl
                "
              >
                ×
              </button>

              <h2
                className="
                  text-3xl
                  font-black
                  mb-8
                "
              >
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h2>

              {/* FORM */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressData.fullName}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      fullName: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="Phone"
                  value={addressData.phone}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      phone: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="Pincode"
                  value={addressData.pincode}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      pincode: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="State"
                  value={addressData.state}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      state: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="City"
                  value={addressData.city}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      city: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="House / Flat"
                  value={addressData.house}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      house: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="Area"
                  value={addressData.area}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      area: e.target.value,
                    })
                  }
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
                  type="text"
                  placeholder="Landmark"
                  value={addressData.landmark}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      landmark: e.target.value,
                    })
                  }
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

              {/* TYPE */}

              <div
                className="
                  flex
                  gap-4
                  mt-6
                "
              >
                {["Home", "Office", "Other"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setAddressData({
                        ...addressData,
                        addressType: type,
                      })
                    }
                    className={`
                      px-5
                      py-3
                      rounded-2xl
                      border
                      transition

                      ${
                        addressData.addressType === type
                          ? "bg-white text-black border-white"
                          : "border-zinc-700 text-white"
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* BUTTON */}

              <button
                onClick={handleSaveAddress}
                className="
                  mt-8
                  w-full
                  bg-white
                  text-black
                  py-4
                  rounded-2xl
                  font-bold
                "
              >
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAddress;
