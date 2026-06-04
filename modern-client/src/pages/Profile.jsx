
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  // =========================
  // GET USER
  // =========================

  useEffect(() => {
    const getUser = async () => {
      try {
        const localUser = JSON.parse(
          localStorage.getItem("user")
        );

        const response = await axios.post(
          "http://localhost:8000/api/user/single-user",
          {
            uId: localUser.user._id,
          }
        );

        if (response.data.success) {
          setUser(response.data.user);

          setName(response.data.user.name);

          setEmail(response.data.user.email);

          setPhoneNumber(
            response.data.user.phoneNumber || ""
          );
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
      const localUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await axios.post(
        "http://localhost:8000/api/user/edit-user",
        {
          uId: localUser.user._id,

          name,

          email,

          phoneNumber,
        }
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
  // LOADING
  // =========================

  if (!user) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
          text-2xl
          font-semibold
        "
      >
        Loading...
      </div>
    );
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
            rounded-[32px]
            p-6
            md:p-10
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
              mb-12
            "
          >
            <img
              src="https://i.pravatar.cc/200"
              alt="user"
              className="
                w-32
                h-32
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
                  mb-3
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
                Joined{" "}
                {new Date(
                  user.createdAt
                ).toDateString()}
              </p>
            </div>
          </div>

          {/* STATS */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
              mb-12
            "
          >
            <div
              className="
                bg-black
                border
                border-zinc-800
                rounded-3xl
                p-6
              "
            >
              <p className="text-zinc-500 mb-2">
                Account Type
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >
                {user.userRole === 1
                  ? "Admin"
                  : "Customer"}
              </h2>
            </div>

            <div
              className="
                bg-black
                border
                border-zinc-800
                rounded-3xl
                p-6
              "
            >
              <p className="text-zinc-500 mb-2">
                Saved Addresses
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >
                {user.addresses?.length || 0}
              </h2>
            </div>

            <div
              className="
                bg-black
                border
                border-zinc-800
                rounded-3xl
                p-6
              "
            >
              <p className="text-zinc-500 mb-2">
                Email Status
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                "
              >
                {user.verified
                  ? "Verified"
                  : "Pending"}
              </h2>
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
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-4
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
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-4
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
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-black
                  border
                  border-zinc-700
                  rounded-2xl
                  px-5
                  py-4
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
              mt-10
              bg-white
              text-black
              px-10
              py-4
              rounded-2xl
              font-bold
              hover:scale-[1.03]
              transition
            "
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;

