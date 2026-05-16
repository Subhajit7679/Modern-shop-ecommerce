import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const { cart } = useContext(CartContext);

  const { wishlist } = useContext(WishlistContext);

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    setUser(loggedUser);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");

    setUser(null);

    toast.success("Logout Successful");

    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-zinc-900">
      <nav className="max-w-7xl mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-3xl font-bold tracking-tight text-white">
          Modern
          <span className="text-zinc-500">Shop</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-wider text-zinc-400">
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

          <Link to="/admin" className="hover:text-white transition">
            Admin
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4 relative">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (search.trim()) {
                    navigate(`/search?q=${search}`);
                  }
                }
              }}
              className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-l-full outline-none w-56"
            />

            <button
              onClick={() => navigate(`/search?q=${search}`)}
              className="bg-white text-black px-4 py-2 rounded-r-full font-medium hover:bg-zinc-200 transition"
            >
              Search
            </button>
          </div>

          {user ? (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-white bg-zinc-900 px-4 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
              >
                <FaUserCircle className="text-2xl" />

                <span className="text-sm font-medium">{user?.user?.name}</span>
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
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
                      onClick={() => {
                        setProfileOpen(false);
                      }}
                      className="block px-5 py-4 hover:bg-zinc-800 text-white transition"
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="px-5 py-4 hover:bg-zinc-800 text-white transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      className="px-5 py-4 hover:bg-zinc-800 text-white transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      Wishlist
                    </Link>

                    <Link
                      to="/manage-address"
                      onClick={() => {
                        setProfileOpen(false);
                      }}
                      className="block px-5 py-4 hover:bg-zinc-800 text-white transition"
                    >
                      Manage Address
                    </Link>

                    <button
                      onClick={logoutHandler}
                      className="px-5 py-4 text-left hover:bg-red-500 text-white transition"
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
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-zinc-800 px-6 py-6 flex flex-col gap-6 text-zinc-300 uppercase tracking-wider text-sm">
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

          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>

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
                className="bg-red-500 text-white px-5 py-3 rounded-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-black px-5 py-3 rounded-xl text-center font-semibold"
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
