
import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  PackageSearch,
  Check,
} from "lucide-react";

import { getAllProducts } from "../services/productService";
import { WishlistContext } from "../context/WishlistContext";

const IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com";

const getProductImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/600x750?text=Modern+Shop";
  }

  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/")) {
    return `${IMAGE_BASE}${image}`;
  }

  return `${IMAGE_BASE}/uploads/products/${image}`;
};

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN");

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  // FETCH PRODUCTS
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getAllProducts();

        if (active) {
          setProducts(data?.products || []);
        }
      } catch (err) {
        console.error("Unable to load products:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  // CATEGORIES
  const categories = useMemo(() => {
    const names = products
      .map((product) => product.pCategory?.cName)
      .filter(Boolean);

    return ["All", ...new Set(names)];
  }, [products]);

  // FILTER AND SORT
  const filteredProducts = useMemo(() => {
    let result = [...products];

    result = result.filter((product) =>
      (product.pName || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );

    if (category !== "All") {
      result = result.filter(
        (product) => product.pCategory?.cName === category
      );
    }

    result = result.filter(
      (product) => Number(product.pPrice || 0) <= maxPrice
    );

    if (sort === "low") {
      result.sort((a, b) => Number(a.pPrice) - Number(b.pPrice));
    }

    if (sort === "high") {
      result.sort((a, b) => Number(b.pPrice) - Number(a.pPrice));
    }

    if (sort === "az") {
      result.sort((a, b) =>
        (a.pName || "").localeCompare(b.pName || "")
      );
    }

    return result;
  }, [products, search, category, maxPrice, sort]);

  // ACTIVE FILTER CHECK
  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    maxPrice !== 100000 ||
    sort !== "newest";

  // RESET FILTERS
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(100000);
    setSort("newest");
  };

  // STOCK CHECK
  const isOutOfStock = (product) =>
    Array.isArray(product.pSizes) &&
    product.pSizes.length > 0 &&
    product.pSizes.every(
      (size) => Number(size.quantity) <= 0
    );

  // WISHLIST
  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // RETRY FETCH
  const retryFetch = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await getAllProducts();
      setProducts(data?.products || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f3ee] text-[#171715]">

      {/* ==========================================
          PREMIUM COLLECTION HERO
      ========================================== */}
      <section className="relative overflow-hidden bg-[#171715] text-white">

        {/* BACKGROUND LIGHTING */}
        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#c7b99d]/10 blur-[150px]" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#c7b99d]/[0.06] blur-[120px]" />

        {/* BACKGROUND TEXT */}
        <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-serif text-[23vw] font-bold leading-none tracking-tighter text-white/[0.025]">
          MODERN
        </div>

        <div className="relative mx-auto max-w-[1500px] px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">

          {/* BREADCRUMB */}
          <div className="mb-12 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            <Link to="/" className="transition hover:text-[#c7b99d]">
              Home
            </Link>

            <span>/</span>

            <span className="text-[#c7b99d]">Shop</span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-7 flex items-center gap-3">
                <span className="h-px w-10 bg-[#c7b99d]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7b99d]">
                  The Modern Collection
                </p>
              </div>

              <h1 className="text-[clamp(3.5rem,8vw,7.2rem)] font-semibold leading-[0.93] tracking-[-0.07em]">
                Discover
                <br />

                <span className="font-serif font-normal italic text-[#c7b99d]">
                  your style.
                </span>
              </h1>

              <p className="mt-8 max-w-lg text-sm leading-8 text-zinc-400 sm:text-base">
                Contemporary fashion, distinctive details and
                everyday essentials. Find the pieces that
                express who you are.
              </p>

              <a
                href="#collection"
                className="group mt-9 inline-flex items-center gap-5 bg-[#c7b99d] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#171715] transition duration-300 hover:bg-white"
              >
                Explore collection

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </motion.div>

            {/* RIGHT BRAND DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="border-t border-white/15 pt-7 lg:ml-auto lg:w-full lg:max-w-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c7b99d]">
                Made for your expression
              </p>

              <p className="mt-5 font-serif text-3xl italic leading-snug text-white sm:text-4xl">
                Wear what feels right.
              </p>

              <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-2xl font-semibold">
                    {loading ? "—" : products.length}
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    Available pieces
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold">01</p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    Your collection
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* BOTTOM DECORATION */}
          <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500">
              MODERN SHOP · ESTABLISH YOUR STYLE
            </span>

            <span className="text-[9px] uppercase tracking-[0.25em] text-[#c7b99d]">
              EXPLORE MORE ↓
            </span>
          </div>

        </div>
      </section>

      {/* ==========================================
          COLLECTION SECTION
      ========================================== */}
      <section
        id="collection"
        className="px-5 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1500px]">

          {/* COLLECTION TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-col justify-between gap-6 border-b border-[#171715]/15 pb-8 md:flex-row md:items-end"
          >
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#a18e6d]" />

                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#a18e6d]">
                  Carefully selected
                </p>
              </div>

              <h2 className="text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                The collection<span className="font-serif italic text-[#a18e6d]">.</span>
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                Find your next favourite piece.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="font-semibold text-[#171715]">
                {filteredProducts.length}
              </span>

              Products available
            </div>
          </motion.div>

          {/* CATEGORY NAVIGATION */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 border px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition duration-300 sm:px-6 ${
                  category === cat
                    ? "border-[#171715] bg-[#171715] text-[#f5f3ee]"
                    : "border-[#171715]/15 bg-transparent text-zinc-600 hover:border-[#a18e6d] hover:text-[#171715]"
                }`}
              >
                {cat}
              </button>
            ))}

          </div>

          {/* FILTER TOOLBAR */}
          <div className="mb-8 border-y border-[#171715]/15 py-5">

            <div className="flex flex-wrap items-center justify-between gap-4">

              {/* LEFT CONTROLS */}
              <div className="flex flex-wrap items-center gap-3">

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                    showFilters
                      ? "bg-[#171715] text-white"
                      : "border border-[#171715]/20 hover:border-[#a18e6d]"
                  }`}
                >
                  <SlidersHorizontal size={15} />

                  Filters

                  {showFilters ? (
                    <X size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>

                {/* SEARCH */}
                <div className="flex min-w-[190px] items-center gap-2 border-b border-[#171715]/25 px-2 py-2 focus-within:border-[#a18e6d] sm:min-w-[240px]">
                  <Search size={15} className="shrink-0 text-zinc-500" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search collection..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-zinc-400"
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

              </div>

              {/* SORT */}
              <div className="flex items-center gap-3">

                <span className="hidden text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500 sm:block">
                  Sort by
                </span>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none border border-[#171715]/20 bg-transparent py-3 pl-4 pr-10 text-[10px] font-semibold outline-none transition hover:border-[#a18e6d]"
                  >
                    <option value="newest">Newest arrivals</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="az">Name: A to Z</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>

              </div>
            </div>

            {/* EXPANDABLE FILTER PANEL */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 grid gap-8 border-t border-[#171715]/10 pt-6 sm:grid-cols-2"
              >

                {/* CATEGORY */}
                <div>
                  <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#a18e6d]">
                    Select category
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`border px-4 py-2 text-[10px] transition ${
                          category === cat
                            ? "border-[#171715] bg-[#171715] text-white"
                            : "border-[#171715]/15 hover:border-[#a18e6d]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICE */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a18e6d]">
                      Maximum price
                    </p>

                    <span className="text-sm font-bold">
                      ₹{formatPrice(maxPrice)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[#a18e6d]"
                    aria-label="Maximum product price"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
                    <span>₹100</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* RESET */}
                <div className="sm:col-span-2">
                  <button
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#a18e6d] transition hover:text-[#171715] disabled:opacity-40"
                  >
                    <RotateCcw size={13} />
                    Reset all filters
                  </button>
                </div>

              </motion.div>
            )}

          </div>

          {/* ACTIVE FILTER INFO */}
          {hasActiveFilters && (
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
                <span>Active selection:</span>

                {search && (
                  <span className="bg-[#e7e4dc] px-3 py-2 text-[#171715]">
                    {search}
                  </span>
                )}

                {category !== "All" && (
                  <span className="bg-[#e7e4dc] px-3 py-2 text-[#171715]">
                    {category}
                  </span>
                )}

                {maxPrice !== 100000 && (
                  <span className="bg-[#e7e4dc] px-3 py-2 text-[#171715]">
                    Up to ₹{formatPrice(maxPrice)}
                  </span>
                )}

              </div>

              <button
                onClick={clearFilters}
                className="text-[9px] font-bold uppercase tracking-wider text-[#a18e6d] hover:text-[#171715]"
              >
                Clear all
              </button>

            </div>
          )}

          {/* ==========================================
              PRODUCT GRID
          ========================================== */}

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">

              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#e5e2da]" />
                  <div className="mt-4 h-3 w-3/4 bg-[#e5e2da]" />
                  <div className="mt-3 h-3 w-1/3 bg-[#e5e2da]" />
                </div>
              ))}

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="py-28 text-center">

              <PackageSearch
                size={38}
                strokeWidth={1.2}
                className="mx-auto text-[#a18e6d]"
              />

              <h3 className="mt-6 text-2xl font-semibold">
                Unable to load collection.
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                Please check your connection and try again.
              </p>

              <button
                onClick={retryFetch}
                className="mt-8 bg-[#171715] px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-[#c7b99d] hover:text-black"
              >
                Try again
              </button>

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#171715]/15">
                <PackageSearch
                  size={32}
                  strokeWidth={1.2}
                  className="text-[#a18e6d]"
                />
              </div>

              <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                Nothing here yet.
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-500">
                No products match your current selection.
                Try exploring another category or adjusting your filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-8 inline-flex items-center gap-3 bg-[#171715] px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-[#c7b99d] hover:text-black"
              >
                Explore all products
                <ArrowRight size={15} />
              </button>

            </div>
          )}

          {/* PRODUCTS */}
          {!loading && !error && filteredProducts.length > 0 && (

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-7 xl:gap-y-12">

              {filteredProducts.map((product, index) => {
                const wishlisted = isInWishlist(product._id);

                const outOfStock = isOutOfStock(product);

                return (
                  <motion.article
                    key={product._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.04, 0.25),
                    }}
                    className="group min-w-0"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#dedbd2]">

                      <Link
                        to={`/product/${product._id}`}
                        className="block h-full w-full"
                      >
                        <img
                          src={getProductImageUrl(product.pImages?.[0])}
                          alt={product.pName || "Modern Shop product"}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/600x750?text=Image+Unavailable";
                          }}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </Link>

                      {/* COLLECTION LABEL */}
                      <div className="absolute left-2 top-2 bg-[#f5f3ee] px-3 py-2 text-[8px] font-bold uppercase tracking-[0.15em] text-[#171715] sm:left-4 sm:top-4 sm:px-4">
                        Modern Edit
                      </div>

                      {/* OUT OF STOCK */}
                      {outOfStock && (
                        <span className="absolute bottom-3 left-3 bg-[#171715] px-3 py-2 text-[8px] font-bold uppercase tracking-wider text-white sm:bottom-4 sm:left-4">
                          Out of stock
                        </span>
                      )}

                      {/* WISHLIST */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all duration-300 sm:right-4 sm:top-4 sm:h-11 sm:w-11 ${
                          wishlisted
                            ? "bg-[#c7b99d] text-[#171715]"
                            : "bg-[#f5f3ee]/95 text-[#171715] hover:bg-[#c7b99d]"
                        }`}
                      >
                        <Heart
                          size={18}
                          strokeWidth={1.6}
                          fill={wishlisted ? "currentColor" : "none"}
                        />
                      </button>

                      {/* QUICK VIEW */}
                      <Link
                        to={`/product/${product._id}`}
                        className="absolute bottom-0 left-0 right-0 hidden translate-y-full bg-[#171715] py-4 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 hover:bg-[#c7b99d] hover:text-black group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                      >
                        Explore product
                        <ArrowUpRight size={14} className="ml-2 inline" />
                      </Link>

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="pt-4 sm:pt-5">

                      <div className="mb-2 flex items-center justify-between gap-2">

                        <p className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-[#a18e6d] sm:text-[9px]">
                          {product.pCategory?.cName || "Collection"}
                        </p>

                        {wishlisted && (
                          <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider text-[#a18e6d]">
                            Saved
                          </span>
                        )}

                      </div>

                      <div className="flex items-start justify-between gap-2">

                        <Link
                          to={`/product/${product._id}`}
                          className="min-w-0"
                        >
                          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-[#171715] transition-colors hover:text-[#a18e6d] sm:text-base">
                            {product.pName}
                          </h3>
                        </Link>

                        <span className="shrink-0 text-sm font-bold text-[#171715] sm:text-base">
                          ₹{formatPrice(product.pPrice)}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 min-h-[32px] text-[10px] leading-5 text-zinc-500 sm:text-xs">
                        {product.pDescription}
                      </p>

                      {/* PRODUCT LINK */}
                      <Link
                        to={`/product/${product._id}`}
                        className="mt-4 flex items-center justify-between border-b border-[#171715]/20 pb-3 text-[9px] font-bold uppercase tracking-[0.17em] text-[#171715] transition-colors hover:border-[#a18e6d] hover:text-[#a18e6d] sm:mt-5 sm:text-[10px]"
                      >
                        View details

                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>

                    </div>

                  </motion.article>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          BRAND STATEMENT
      ========================================== */}
      <section className="relative isolate overflow-hidden bg-[#171715] px-6 py-24 text-white sm:px-12 sm:py-32 lg:px-20">

        {/* BACKGROUND LIGHTING */}
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[#c7b99d]/10 blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-[#c7b99d]/10 blur-[140px]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap font-serif text-[22vw] font-bold tracking-tighter text-white/[0.025]">
            STYLE
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-[1000px] text-center"
        >

          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#c7b99d]/60" />

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7b99d]">
              More than just fashion
            </p>

            <span className="h-px w-8 bg-[#c7b99d]/60" />
          </div>

          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1.05] tracking-[-0.06em]">
            Your style.
            <br />

            <span className="font-serif font-normal italic text-[#c7b99d]">
              Your identity.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-md text-sm leading-8 text-zinc-400">
            Choose pieces that feel like you. Express your
            individuality and make every look your own.
          </p>

          <Link
            to="/"
            className="group mt-10 inline-flex items-center gap-4 border border-[#c7b99d]/50 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c7b99d] transition duration-300 hover:bg-[#c7b99d] hover:text-black"
          >
            Back to home

            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>

          <div className="mx-auto mt-16 flex max-w-xs items-center gap-5">
            <span className="h-px flex-1 bg-white/10" />

            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              MODERN SHOP
            </span>

            <span className="h-px flex-1 bg-white/10" />
          </div>

        </motion.div>
      </section>

    </main>
  );
}

export default Shop;
