import { Link, useNavigate, useLocation } from "react-router-dom";

import { useContext, useEffect, useState, useRef } from "react";

import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

import { CartContext } from "../context/CartContext";

import { WishlistContext } from "../context/WishlistContext";

import toast from "react-hot-toast";

import { debounce } from "lodash";

import axios from "axios";

function Navbar() {
  const { cart } = useContext(CartContext);

  const { wishlist } = useContext(WishlistContext);

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  // REFS
  const profileRef = useRef();

  const searchRef = useRef();

  // SEARCH
  const fetchSearchResults = debounce(async (value) => {
    try {
      if (!value.trim()) {
        setSearchResults([]);

        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/search?q=${value}`,
      );

      setSearchResults(response.data.products);
    } catch (error) {
      console.log(error);
    }
  }, 300);

  // USER UPDATE
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    setUser(loggedUser);
  }, [location]);

  // OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      // PROFILE
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      // SEARCH
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // LOGOUT
  const logoutHandler = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("cart");

    localStorage.removeItem("wishlist");

    setUser(null);

    toast.success("Logout Successful");

    window.location.href = "/";
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        backdrop-blur-xl
        bg-black/70
        border-b
        border-zinc-900
      "
    >
      <nav
        className="
          max-w-7xl
          mx-auto
          px-6
          md:px-16
          py-5
          flex
          items-center
          justify-between
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="
            text-3xl
            font-bold
            tracking-tight
            text-white
          "
        >
          Modern
          <span className="text-zinc-500">Shop</span>
        </Link>

        {/* DESKTOP MENU */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-10
            text-sm
            uppercase
            tracking-wider
            text-zinc-400
          "
        >
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>

          <Link to="/shop" className="hover:text-white transition">
            Shop
          </Link>

          <Link to="/cart" className="hover:text-white transition">
            Cart ({cart.length})
          </Link>

          <Link to="/wishlist" className="hover:text-white transition">
            Wishlist ({wishlist.length})
          </Link>

          {/* ADMIN ONLY */}
          {user?.user?.role === 1 && (
            <Link to="/admin" className="hover:text-white transition">
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-4
            relative
          "
        >
          {/* SEARCH */}
          <div
            ref={searchRef}
            className="
              relative
              flex
              items-center
            "
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                fetchSearchResults(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (search.trim()) {
                    navigate(`/search?q=${search}`);

                    setSearchResults([]);
                  }
                }
              }}
              className="
                bg-zinc-900
                border
                border-zinc-700
                text-white
                px-4
                py-2
                rounded-l-full
                outline-none
                w-56
              "
            />

            <button
              onClick={() => {
                navigate(`/search?q=${search}`);

                setSearchResults([]);
              }}
              className="
                bg-white
                text-black
                px-4
                py-2
                rounded-r-full
                font-medium
                hover:bg-zinc-200
                transition
              "
            >
              Search
            </button>

            {/* SEARCH RESULTS */}
            {searchResults.length > 0 && (
              <div
                className="
                  absolute
                  top-14
                  left-0
                  w-[350px]
                  bg-zinc-900
                  border
                  border-zinc-700
                  rounded-xl
                  overflow-hidden
                  z-50
                  shadow-lg
                "
              >
                {searchResults.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/products/${item._id}`);

                      setSearchResults([]);
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      p-3
                      hover:bg-zinc-800
                      cursor-pointer
                      transition
                    "
                  >
                    <img
                      src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${item.pImages[0]}`}
                      alt={item.pName}
                      className="
                        w-14
                        h-14
                        object-cover
                        rounded-lg
                      "
                    />

                    <div>
                      <h3 className="text-white font-semibold">{item.pName}</h3>

                      <p className="text-zinc-400 text-sm">₹{item.pPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  flex
                  items-center
                  gap-2
                  text-white
                  bg-zinc-900
                  px-4
                  py-2
                  rounded-full
                  border
                  border-zinc-700
                  hover:bg-zinc-800
                  transition
                "
              >
                <FaUserCircle className="text-2xl" />

                <span className="text-sm font-medium">{user?.user?.name}</span>
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-4
                    w-64
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                  "
                >
                  <div className="p-5 border-b border-zinc-800">
                    <h3 className="text-white font-bold text-lg">
                      {user?.user?.name}
                    </h3>

                    <p className="text-zinc-400 text-sm mt-1">
                      {user?.user?.email}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="
                        block
                        px-5
                        py-4
                        hover:bg-zinc-800
                        text-white
                        transition
                      "
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="
                        px-5
                        py-4
                        hover:bg-zinc-800
                        text-white
                        transition
                      "
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="
                        px-5
                        py-4
                        hover:bg-zinc-800
                        text-white
                        transition
                      "
                    >
                      Wishlist
                    </Link>

                    <Link
                      to="/manage-address"
                      onClick={() => setProfileOpen(false)}
                      className="
                        block
                        px-5
                        py-4
                        hover:bg-zinc-800
                        text-white
                        transition
                      "
                    >
                      Manage Address
                    </Link>

                    <button
                      onClick={logoutHandler}
                      className="
                        px-5
                        py-4
                        text-left
                        hover:bg-red-500
                        text-white
                        transition
                      "
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="
                bg-white
                text-black
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
                hover:scale-105
                transition
              "
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            md:hidden
            text-white
            text-2xl
          "
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="
            md:hidden
            bg-black
            border-t
            border-zinc-800
            px-6
            py-6
            flex
            flex-col
            gap-6
            text-zinc-300
            uppercase
            tracking-wider
            text-sm
          "
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart ({cart.length})
          </Link>

          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist ({wishlist.length})
          </Link>

          {/* ADMIN ONLY MOBILE */}
          {user?.user?.role === 1 && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>

              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>

              <button
                onClick={logoutHandler}
                className="
                  bg-red-500
                  text-white
                  px-5
                  py-3
                  rounded-xl
                "
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="
                bg-white
                text-black
                px-5
                py-3
                rounded-xl
                text-center
                font-semibold
              "
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
