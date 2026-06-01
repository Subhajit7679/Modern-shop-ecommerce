import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

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
  });

  // =========================
  // GET USER
  // =========================

  useEffect(() => {
    const getUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));

        const response = await axios.post(
          "http://localhost:8000/api/user/single-user",
          {
            uId: localUser.user._id,
          },
        );

        if (response.data.success) {
          setUser(response.data.user);

          setName(response.data.user.name);

          setEmail(response.data.user.email);

          setPhoneNumber(response.data.user.phoneNumber || "");

          setAddresses(response.data.user.addresses || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        "http://localhost:8000/api/user/edit-user",

        {
          uId: localUser.user._id,

          name,
          email,
          phoneNumber,
        },
      );

      if (response.data.success) {
        toast.success("Profile Updated");

        setUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Update failed");
    }
  };

  // =========================
  // ADD / EDIT ADDRESS
  // =========================

  const handleAddAddress = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));

      let response;

      // EDIT ADDRESS

      if (editingAddressId) {
        response = await axios.post(
          "http://localhost:8000/api/user/edit-address",

          {
            uId: localUser.user._id,

            addressId: editingAddressId,

            address: addressData,
          },
        );
      }

      // ADD ADDRESS
      else {
        response = await axios.post(
          "http://localhost:8000/api/user/add-address",

          {
            uId: localUser.user._id,

            address: addressData,
          },
        );
      }

      if (response.data.success) {
        toast.success(editingAddressId ? "Address updated" : "Address added");

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
        "http://localhost:8000/api/user/delete-address",

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
    });

    setEditingAddressId(address._id);

    setShowAddressForm(true);
  };

  // =========================
  // LOADING
  // =========================

  if (!user) {
    return <div className="text-white p-10">Loading...</div>;
  }

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
        {/* PAGE HEADER */}

        <div className="mb-10">
          <p
            className="
              uppercase
              tracking-[6px]
              text-zinc-500
              text-sm
              mb-3
            "
          >
            Account
          </p>

          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
            "
          >
            My Profile
          </h1>
        </div>

        {/* PROFILE CARD */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[28px]
            p-6
            md:p-10
            mb-20
          "
        >
          {/* TOP */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-8
              mb-10
            "
          >
            <img
              src="https://i.pravatar.cc/200"
              alt="user"
              className="
                w-28
                h-28
                rounded-full
                object-cover
                border-4
                border-zinc-700
              "
            />

            <div>
              <h2
                className="
                  text-4xl
                  font-black
                  mb-2
                "
              >
                {user.name}
              </h2>

              <p
                className="
                  text-zinc-400
                  text-lg
                  mb-2
                "
              >
                {user.email}
              </p>

              <p className="text-zinc-500">
                Joined {new Date(user.createdAt).toDateString()}
              </p>
            </div>
          </div>

          {/* FORM */}

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            {/* NAME */}

            <div>
              <label
                className="
                  block
                  mb-3
                  text-zinc-400
                "
              >
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-3.5
                  outline-none
                  focus:border-white
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                className="
                  block
                  mb-3
                  text-zinc-400
                "
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-3.5
                  outline-none
                  focus:border-white
                "
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                className="
                  block
                  mb-3
                  text-zinc-400
                "
              >
                Phone Number
              </label>

              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-3.5
                  outline-none
                  focus:border-white
                "
              />
            </div>
          </div>

          {/* BUTTON */}

          <button
            onClick={handleUpdateProfile}
            className="
              mt-8
              bg-white
              text-black
              px-10
              py-3.5
              rounded-2xl
              font-bold
              hover:scale-[1.03]
              transition
            "
          >
            Save Changes
          </button>
        </div>

        {/* ADDRESS HEADER */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
            mb-8
          "
        >
          <div>
            <p
              className="
                uppercase
                tracking-[5px]
                text-zinc-500
                text-sm
                mb-2
              "
            >
              Delivery
            </p>

            <h2
              className="
                text-4xl
                font-black
              "
            >
              Saved Addresses
            </h2>
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
              });

              setShowAddressForm(true);
            }}
            className="
              bg-white
              text-black
              px-6
              py-3.5
              rounded-2xl
              font-semibold
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
              rounded-[28px]
              p-20
              text-center
            "
          >
            <div className="text-8xl mb-6">📍</div>

            <h3
              className="
                text-4xl
                font-black
                mb-3
              "
            >
              No Saved Address
            </h3>

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
                    rounded-[28px]
                    p-6
                  "
              >
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

                <h3
                  className="
                      text-2xl
                      font-black
                      mb-3
                    "
                >
                  {address.fullName}
                </h3>

                <p
                  className="
                      text-zinc-300
                      mb-5
                    "
                >
                  {address.phone}
                </p>

                <div
                  className="
                      text-zinc-400
                      leading-8
                    "
                >
                  <p>{address.house}</p>

                  <p>{address.area}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>{address.pincode}</p>

                  <p className="mt-4">Landmark: {address.landmark}</p>
                </div>
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
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
                    py-3.5
                    outline-none
                  "
                />
              </div>

              {/* BUTTON */}

              <button
                onClick={handleAddAddress}
                className="
                  mt-6
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

export default Profile;
