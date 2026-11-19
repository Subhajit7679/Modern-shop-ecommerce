
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

const PRODUCT_IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const getProductImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/600x600?text=No+Image";
  }

  return image.startsWith("http")
    ? image
    : `${PRODUCT_IMAGE_BASE}${image}`;
};

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN")}`;

function Wishlist() {
  const { wishlist = [], removeFromWishlist } =
    useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  const [selectedSizes, setSelectedSizes] = useState({});

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];

    if (!selectedSize) {
      return alert("Please select a size before adding to cart.");
    }

    const selectedSizeData = product.pSizes?.find(
      (item) => item.size === selectedSize
    );

    if (!selectedSizeData || Number(selectedSizeData.quantity) <= 0) {
      return alert("This size is currently out of stock.");
    }

    addToCart({
      ...product,
      selectedSize,
      quantity: 1,
    });
  };

  const isOutOfStock = (product) =>
    Array.isArray(product.pSizes) &&
    product.pSizes.length > 0 &&
    product.pSizes.every((size) => Number(size.quantity) <= 0);

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#171715]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#dedbd2]">
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#c7b99d]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-[1500px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#a18e6d]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#8b806e]">
                Your personal collection
              </span>
            </div>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h1 className="text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                  Your
                  <span className="ml-3 font-serif font-normal italic text-[#a18e6d]">
                    Wishlist.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#77736b] sm:text-base">
                  A collection of pieces you've fallen for.
                  Keep your favourites close and make them yours.
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-[#d9d5ca] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <Heart
                  size={22}
                  strokeWidth={1.4}
                  className="text-[#a18e6d]"
                />

                <div>
                  <p className="text-3xl font-semibold tracking-tight">
                    {wishlist.length.toString().padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#858077]">
                    Saved pieces
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WISHLIST CONTENT */}
      <main className="mx-auto max-w-[1500px] px-5 py-12 sm:px-10 sm:py-16 lg:px-16">

        {wishlist.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[450px] flex-col items-center justify-center text-center"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#d8d1c3] bg-[#eeece5]">
              <Heart
                size={35}
                strokeWidth={1}
                className="text-[#a18e6d]"
              />
            </div>

            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a18e6d]">
              Nothing saved yet
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your collection is waiting.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#77736b]">
              Discover pieces that match your style and save
              the ones you love. They'll be waiting here for you.
            </p>

            <Link
              to="/shop"
              className="group mt-9 inline-flex items-center gap-4 bg-[#171715] px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#a18e6d]"
            >
              Explore Collection
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* SECTION HEADER */}
            <div className="mb-9 flex flex-col justify-between gap-4 border-b border-[#dedbd2] pb-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a18e6d]">
                  Saved for later
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  Your favourites
                </h2>
              </div>

              <Link
                to="/shop"
                className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#77736b] transition hover:text-[#a18e6d]"
              >
                Continue shopping
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {wishlist.map((product, index) => {
                const outOfStock = isOutOfStock(product);
                const sizes = product.pSizes || [];

                return (
                  <motion.article
                    key={product._id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.07, 0.35),
                    }}
                    className="group min-w-0"
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="relative overflow-hidden bg-[#eae7df]">

                      <Link
                        to={`/product/${product._id}`}
                        className="block"
                      >
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={getProductImageUrl(product.pImages?.[0])}
                            alt={product.pName}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/600x600?text=No+Image";
                            }}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                      </Link>

                      {/* STOCK BADGE */}
                      {outOfStock && (
                        <span className="absolute left-4 top-4 bg-[#171715] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                          Sold Out
                        </span>
                      )}

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          removeFromWishlist(product._id);

                          setSelectedSizes((prev) => {
                            const updated = { ...prev };
                            delete updated[product._id];
                            return updated;
                          });
                        }}
                        aria-label="Remove from wishlist"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-[#f5f3ee]/95 text-[#171715] transition hover:bg-[#171715] hover:text-white"
                      >
                        <Heart size={17} fill="currentColor" />
                      </button>

                      {/* VIEW PRODUCT */}
                      <Link
                        to={`/product/${product._id}`}
                        className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-[#f5f3ee]/95 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171715] opacity-0 transition duration-300 hover:bg-white group-hover:opacity-100"
                      >
                        View Product
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="pt-5">

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a18e6d]">
                            {product.pCategory?.cName || "Collection"}
                          </p>

                          <Link
                            to={`/product/${product._id}`}
                            className="line-clamp-1 text-base font-semibold tracking-tight transition hover:text-[#a18e6d]"
                          >
                            {product.pName}
                          </Link>
                        </div>

                        <p className="shrink-0 text-base font-semibold tracking-tight">
                          {formatPrice(product.pPrice)}
                        </p>
                      </div>

                      <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-[#858077]">
                        {product.pDescription || "Discover this piece from our collection."}
                      </p>

                      {/* SIZE SELECTOR */}
                      {sizes.length > 0 && (
                        <div className="mt-6 border-t border-[#dedbd2] pt-5">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77736b]">
                              Select your size
                            </p>

                            <p className="text-[9px] uppercase tracking-wider text-[#aaa398]">
                              {selectedSizes[product._id]
                                ? `Selected: ${selectedSizes[product._id]}`
                                : "Choose size"}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {sizes.map((sizeItem, sizeIndex) => {
                              const unavailable =
                                Number(sizeItem.quantity) <= 0;

                              const isSelected =
                                selectedSizes[product._id] === sizeItem.size;

                              return (
                                <button
                                  key={sizeIndex}
                                  type="button"
                                  disabled={unavailable}
                                  onClick={() =>
                                    setSelectedSizes((prev) => ({
                                      ...prev,
                                      [product._id]: sizeItem.size,
                                    }))
                                  }
                                  className={`relative flex h-10 min-w-10 items-center justify-center border px-3 text-[10px] font-semibold transition ${
                                    isSelected
                                      ? "border-[#171715] bg-[#171715] text-white"
                                      : unavailable
                                      ? "cursor-not-allowed border-[#e1ded6] text-[#c5c0b5]"
                                      : "border-[#d8d3c8] text-[#555149] hover:border-[#171715]"
                                  }`}
                                >
                                  {sizeItem.size}

                                  {unavailable && (
                                    <span className="absolute left-0 right-0 top-1/2 h-px rotate-[-35deg] bg-[#b6afa2]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-2">
                        <button
                          type="button"
                          disabled={outOfStock}
                          onClick={() => handleAddToCart(product)}
                          className={`flex flex-1 items-center justify-center gap-2 px-3 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition ${
                            outOfStock
                              ? "cursor-not-allowed bg-[#d8d5cd] text-[#89857c]"
                              : "bg-[#171715] text-white hover:bg-[#a18e6d]"
                          }`}
                        >
                          <ShoppingBag size={15} />
                          {outOfStock ? "Unavailable" : "Add to Bag"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            removeFromWishlist(product._id);

                            setSelectedSizes((prev) => {
                              const updated = { ...prev };
                              delete updated[product._id];
                              return updated;
                            });
                          }}
                          aria-label="Remove product"
                          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-[#d8d3c8] text-[#77736b] transition hover:border-[#171715] hover:bg-[#171715] hover:text-white"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* BOTTOM EDITORIAL SECTION */}
      {wishlist.length > 0 && (
        <section className="mt-12 border-t border-[#dedbd2] bg-[#eeece5]">
          <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-6 px-5 py-12 text-center sm:px-10 md:flex-row md:text-left lg:px-16">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d3c9b7]">
                <Sparkles
                  size={19}
                  className="text-[#a18e6d]"
                  strokeWidth={1.4}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Found something you love?
                </h3>
                <p className="mt-1 text-xs text-[#858077]">
                  Your next favourite piece might be waiting for you.
                </p>
              </div>
            </div>

            <Link
              to="/shop"
              className="group flex items-center gap-3 border-b border-[#a18e6d] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition hover:text-[#a18e6d]"
            >
              Discover More
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        </section>
      )}
    </div>
  );
}

export default Wishlist;
