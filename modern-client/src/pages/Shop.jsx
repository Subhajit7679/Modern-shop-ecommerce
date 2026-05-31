import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";

import { WishlistContext } from "../context/WishlistContext";

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sort, setSort] = useState("newest");

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];
    updated = updated.filter((product) =>
      product.pName.toLowerCase().includes(search.toLowerCase()),
    );
    if (category !== "All") {
      updated = updated.filter(
        (product) => product.pCategory?.cName === category,
      );
    }
    updated = updated.filter((product) => product.pPrice <= maxPrice);
    if (sort === "low") updated.sort((a, b) => a.pPrice - b.pPrice);
    if (sort === "high") updated.sort((a, b) => b.pPrice - a.pPrice);
    if (sort === "az") updated.sort((a, b) => a.pName.localeCompare(b.pName));
    setFilteredProducts(updated);
  }, [search, category, maxPrice, sort, products]);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.pCategory?.cName)),
  ];

  return (
    <div className="bg-black min-h-screen text-white px-6 md:px-16 pt-4 pb-16">
      {/* HEADER - moved OUTSIDE the flex row so it spans full width */}
      <div className="mb-3">
        <h1 className="text-5xl font-black mb-2">Shop Products</h1>
        <p className="text-zinc-500 text-lg">
          Discover premium fashion collections
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* SIDEBAR */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div
            className="
          bg-zinc-900/70
          backdrop-blur-2xl
          border
          border-zinc-800
          rounded-[32px]
          p-5
          space-y-4
          shadow-2xl
        "
          >
            {/* SEARCH */}
            <div>
              <p className="text-xs uppercase tracking-[4px] text-zinc-500 mb-2">
                Search
              </p>
              <input
                type="text"
                placeholder="Search premium products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full bg-black border border-zinc-800
                rounded-2xl px-4 py-2.5 outline-none text-white text-sm
              "
              />
            </div>

            {/* CATEGORY */}
            <div>
              <p className="text-xs uppercase tracking-[4px] text-zinc-500 mb-2">
                Category
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                w-full bg-black border border-zinc-800
                rounded-2xl px-4 py-2.5 outline-none text-white text-sm
              "
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}
            <div>
              <p className="text-xs uppercase tracking-[4px] text-zinc-500 mb-2">
                Sort By
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                w-full bg-black border border-zinc-800
                rounded-2xl px-4 py-2.5 outline-none text-white text-sm
              "
              >
                <option value="newest">Newest</option>
                <option value="low">Price Low To High</option>
                <option value="high">Price High To Low</option>
                <option value="az">A-Z</option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-xs uppercase tracking-[4px] text-zinc-500">
                  Price
                </p>
                <span className="font-bold text-sm">₹ {maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setMaxPrice(100000);
                  setSort("newest");
                }}
                className="
                flex-1 border border-zinc-700 py-2.5
                rounded-2xl hover:bg-zinc-800 transition text-sm
              "
              >
                Clear
              </button>
              <button
                className="
                flex-1 bg-white text-black py-2.5
                rounded-2xl font-semibold hover:scale-[1.03] transition text-sm
              "
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          {/* ✅ Removed -mt-1, just a simple top bar */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-zinc-500 text-sm">
              {filteredProducts.length} Products Found
            </p>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.pSizes?.every(
                (size) => size.quantity <= 0,
              );

              return (
                <div
                  key={product._id}
                  className="
                  relative
                   group
                  bg-gradient-to-b
                  from-zinc-900
                 to-black
                 border
                 border-zinc-800
                  rounded-[32px]
                 overflow-hidden
                hover:border-white/20
                   hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]
                       transition-all
                      duration-500
                 "
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:8000/uploads/products/${product.pImages?.[0]}`}
                        alt={product.pName}
                        className="  w-full h-72 object-cover group-hover:scale-110 transition-all duration-700  "
                      />

                      {/* OUT OF STOCK */}
                      {isOutOfStock && (
                        <div
                          className=" absolute top-4 left-4 bg-red-500 text-white text-xs
                         px-4
                         py-2
                         rounded-full
                         font-semibold
                         "
                        >
                          Out Of Stock
                        </div>
                      )}

                      {/* WISHLIST */}
                      <button
                        onClick={() =>
                          isInWishlist(product._id)
                            ? removeFromWishlist(product._id)
                            : addToWishlist(product)
                        }
                        className="  absolute top-4 right-4 w-11 h-11 rounded-full
                      bg-black/60
                        backdrop-blur-xl
                        border
                         border-zinc-700
                         flex
                         items-center
                          justify-center
                           hover:bg-white
                           hover:text-black
                              transition-all
                           duration-300
                            "
                      >
                        ♥
                      </button>
                    </div>
                  </Link>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold">{product.pName}</h2>
                    <p className="text-zinc-400 mt-2">₹ {product.pPrice}</p>

                    {/* VIEW PRODUCT */}
                    <Link to={`/product/${product._id}`}>
                      <button
                        className="
                        mt-5
                       bg-white
                       text-black
                          px-5
                        py-3
                       rounded-xl
                       font-semibold
                          w-full
                         hover:scale-[1.02]
                         transition
                           "
                      >
                        View Product
                      </button>
                    </Link>

                    {/* WISHLIST */}
                    <button
                      onClick={() =>
                        isInWishlist(product._id)
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product)
                      }
                      className="
                      mt-4 border border-zinc-700 w-full
                       py-3 rounded-xl hover:bg-zinc-800 transition
                      "
                    >
                      {isInWishlist(product._id)
                        ? "Remove Wishlist"
                        : "Add Wishlist"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
