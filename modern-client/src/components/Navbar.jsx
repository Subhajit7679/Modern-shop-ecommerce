import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  UserRound,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import toast from "react-hot-toast";
import axios from "axios";

const IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

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

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Load logged-in user
  useEffect(() => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      setUser(loggedUser);
    } catch {
      setUser(null);
    }
  }, [location]);

  // Close menus after navigation
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setSearchResults([]);
  }, [location.pathname]);

  // Search products with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/search`,
          { params: { q: search.trim() } }
        );

        setSearchResults(response.data.products || []);
      } catch (error) {
        console.error("Product search failed:", error);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Search submit
  const handleSearch = (event) => {
    event?.preventDefault();

    if (!search.trim()) return;

    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearchResults([]);
    setMenuOpen(false);
  };

  // Logout
  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);

    toast.success("Logout Successful");
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
      isActive(path)
        ? "text-white"
        : "text-zinc-400 hover:text-white"
    }`;

  const badgeClass =
    "absolute -top-2 -right-3 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#c7b99d] px-1 text-[9px] font-bold text-black";

  const mobileLinkClass =
    "flex items-center justify-between border-b border-white/10 py-4 text-sm font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#171715]/95 text-white backdrop-blur-xl">

      {/* TOP ANNOUNCEMENT */}
      <div className="hidden bg-[#c7b99d] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-black sm:block">
        Discover your style · New collections available now
      </div>

      {/* MAIN NAVBAR */}
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10 lg:px-14">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="group flex flex-col items-center md:items-start">
          <span className="text-[25px] font-bold leading-none tracking-[-0.07em] sm:text-3xl">
            MODERN<span className="font-light text-[#c7b99d]">SHOP</span>
          </span>
          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.38em] text-zinc-500">
            Redefine Your Style
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-9 lg:flex">
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link to="/shop" className={navLinkClass("/shop")}>
            Shop
          </Link>

          <Link to="/wishlist" className={`${navLinkClass("/wishlist")} relative`}>
            Wishlist
            {wishlist.length > 0 && (
              <span className={badgeClass}>{wishlist.length}</span>
            )}
          </Link>

          {user?.user?.role === 1 && (
            <Link to="/admin" className={navLinkClass("/admin")}>
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* DESKTOP SEARCH */}
          <div ref={searchRef} className="relative hidden xl:block">
            <form
              onSubmit={handleSearch}
              className="flex h-10 w-[230px] items-center rounded-full border border-white/10 bg-white/[0.04] px-4 transition focus-within:border-[#c7b99d]/60"
            >
              <Search size={16} className="shrink-0 text-zinc-500" />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-3 text-xs text-white outline-none placeholder:text-zinc-500"
              />
            </form>

            {searchResults.length > 0 && (
              <div className="absolute right-0 top-14 z-50 max-h-[400px] w-[340px] overflow-y-auto rounded-2xl border border-white/10 bg-[#22221f] p-2 shadow-2xl">
                {searchResults.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      navigate(`/products/${item._id}`);
                      setSearchResults([]);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/[0.06]"
                  >
                    <img
                      src={`${IMAGE_BASE}${item.pImages?.[0]}`}
                      alt={item.pName}
                      className="h-14 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {item.pName}
                      </p>
                      <p className="mt-1 text-xs text-[#c7b99d]">
                        ₹{item.pPrice}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOGIN / PROFILE */}
          {user ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 transition hover:border-[#c7b99d]/60 hover:bg-white/[0.04]"
              >
                <UserRound size={17} className="text-[#c7b99d]" />
                <span className="max-w-[90px] truncate text-xs font-medium">
                  {user?.user?.name || "Account"}
                </span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#22221f] shadow-2xl">
                  <div className="border-b border-white/10 p-5">
                    <p className="font-semibold text-white">
                      {user?.user?.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {user?.user?.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <UserRound size={16} /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Package size={16} /> My Orders
                    </Link>

                    <Link
                      to="/manage-address"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <LayoutDashboard size={16} /> Manage Address
                    </Link>

                    <button
                      onClick={logoutHandler}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-[#c7b99d] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-black transition hover:bg-white md:block"
            >
              Login
            </Link>
          )}

          {/* WISHLIST ICON */}
          <Link
            to="/wishlist"
            className="relative hidden rounded-full p-2.5 text-zinc-300 transition hover:bg-white/10 hover:text-white sm:block"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className={badgeClass}>{wishlist.length}</span>
            )}
          </Link>

          {/* CART ICON */}
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className={badgeClass}>{cart.length}</span>
            )}
          </Link>
        </div>
      </nav>

      
      {/* PREMIUM MOBILE MENU */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-[60] max-h-[calc(100dvh-72px)] overflow-y-auto bg-[#171715] px-6 pb-10 pt-7 text-white shadow-2xl md:hidden">

          {/* MENU HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c7b99d]">
                Explore ModernShop
              </p>
              <p className="mt-2 text-xl font-semibold">
                Find your style.
              </p>
            </div>

            <span className="text-xs tracking-widest text-zinc-600">
              MENU / 01
            </span>
          </div>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="mb-9 flex items-center gap-3 border-b border-white/20 pb-4"
          >
            <Search size={19} className="text-[#c7b99d]" />

            <input
              type="text"
              placeholder="Search your favourite products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button type="submit" aria-label="Search">
              <ArrowRight size={18} />
            </button>
          </form>

          {/* MAIN NAVIGATION */}
          <div className="mb-10">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Navigation
            </p>

            {[
              { name: "Home", path: "/" },
              { name: "Shop Collection", path: "/shop" },
              { name: "Wishlist", path: "/wishlist", count: wishlist.length },
              { name: "Shopping Bag", path: "/cart", count: cart.length },
            ].map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-white/10 py-5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#c7b99d]">
                    0{index + 1}
                  </span>

                  <span className="text-lg font-medium tracking-tight transition group-hover:translate-x-1 group-hover:text-[#c7b99d]">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {item.count > 0 && (
                    <span className="rounded-full bg-[#c7b99d] px-2 py-1 text-[10px] font-bold text-black">
                      {item.count}
                    </span>
                  )}

                  <ArrowRight
                    size={17}
                    className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-[#c7b99d]"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* ACCOUNT */}
          <div className="mb-10">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              My Account
            </p>

            {user ? (
              <>
                <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c7b99d] text-black">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {user?.user?.name || "Welcome"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {user?.user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/10 py-4 text-sm text-zinc-300 transition hover:text-[#c7b99d]"
                >
                  My Profile
                </Link>

                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/10 py-4 text-sm text-zinc-300 transition hover:text-[#c7b99d]"
                >
                  My Orders
                </Link>

                <Link
                  to="/manage-address"
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-white/10 py-4 text-sm text-zinc-300 transition hover:text-[#c7b99d]"
                >
                  Manage Address
                </Link>

                {user?.user?.role === 1 && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-white/10 py-4 text-sm text-zinc-300 transition hover:text-[#c7b99d]"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={logoutHandler}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-red-500/30 py-4 text-xs font-bold uppercase tracking-widest text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-[#c7b99d] py-4 text-center text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* MENU FOOTER */}
          <div className="border-t border-white/10 pt-7">
            <p className="text-center text-[9px] font-medium uppercase tracking-[0.35em] text-zinc-600">
              MODERNSHOP · REDEFINE YOUR STYLE
            </p>
          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;
