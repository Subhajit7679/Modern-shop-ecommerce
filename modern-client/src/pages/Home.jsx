import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getAllProducts } from "../services/productService";

import { WishlistContext } from "../context/WishlistContext";

import fashionVideo from "../assets/videos/fashion.mp4";
import bgVideo from "../assets/videos/videoplayback.mp4";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

function Home() {
  const [products, setProducts] = useState([]);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();

      setProducts(data.products || []);
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 -right-98 w-[160%] h-full object-contain bg-black scale-125"
        >
          <source src={fashionVideo} type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative max-w-3xl overflow-hidden rounded-none"
          >
            {/* BACKGROUND VIDEO */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CONTENT WRAPPER */}
            <div className="relative z-10 pt-24">
              <p className="uppercase tracking-[8px] text-zinc-300 mb-6 text-sm">
                Premium Streetwear Collection
              </p>

              <h1 className="text-5xl md:text-8xl font-black leading-tight">
                Redefine
                <br />
                Modern Fashion
              </h1>

              <p className="mt-8 text-zinc-300 text-lg max-w-xl leading-relaxed">
                Discover luxury streetwear, futuristic designs, and premium
                fashion pieces crafted for the next generation.
              </p>

              <div className="flex gap-5 mt-10 flex-wrap">
                <Link
                  to="/shop"
                  className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
                >
                  Shop Collection
                </Link>

                <button className="border border-white/30 px-8 py-4 rounded-full hover:bg-white/10 transition">
                  Explore More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-24 px-6 md:px-20">
        <div className="flex items-center justify-between mb-16 flex-wrap gap-5">
          <div>
            <p className="uppercase tracking-[6px] text-zinc-500 mb-4">
              Trending Collection
            </p>

            <h2 className="text-5xl font-bold">Latest Products</h2>
          </div>

          <Link
            to="/shop"
            className="border border-zinc-700 px-6 py-3 rounded-full hover:bg-zinc-900 transition"
          >
            View All
          </Link>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => {
              document.getElementById("products-scroll").scrollBy({
                left: -400,
                behavior: "smooth",
              });
            }}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            ←
          </button>

          <button
            onClick={() => {
              document.getElementById("products-scroll").scrollBy({
                left: 400,
                behavior: "smooth",
              });
            }}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            →
          </button>
        </div>

        <div
          id="products-scroll"
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
        >
          {products.slice(0, 8).map((product) => {
            return (
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
                key={product._id}
                className="
        min-w-[290px]
        max-w-[290px]
        bg-gradient-to-b
        from-zinc-900
        to-black
        border
        border-zinc-800
        rounded-[32px]
        overflow-hidden
        group
        hover:border-white/20
        hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]
        transition-all
        duration-500
      "
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${product.pImages?.[0]}`}
                    alt={product.pName}
                    className="
            w-full
            h-[230px]
            object-cover
            group-hover:scale-105
            transition-all
            duration-700
          "
                  />
                </Link>

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {product.pName}
                  </h3>

                  <p className="text-zinc-500 mb-4 text-sm line-clamp-2">
                    {product.pDescription}
                  </p>

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-bold text-white">
                      ₹ {product.pPrice}
                    </span>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="
    block
    text-center
    bg-white
    text-black
    px-5
    py-3
    rounded-2xl
    font-semibold
    w-full
    hover:bg-zinc-200
    transition-all
    duration-300
  "
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() =>
                      isInWishlist(product._id)
                        ? removeFromWishlist(product._id)
                        : addToWishlist(product)
                    }
                    className="
            mt-3
            border
            border-zinc-700
            w-full
            py-3
            rounded-2xl
            hover:bg-zinc-800
            hover:border-zinc-500
            transition-all
            duration-300
          "
                  >
                    {isInWishlist(product._id)
                      ? "Remove Wishlist"
                      : "Add Wishlist"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURE SECTION */}
      {/* PREMIUM AUTO SCROLL FEATURE SECTION */}

      <section className="py-28 border-t border-zinc-900 overflow-hidden">
        <div className="text-center mb-16 px-6">
          <p className="uppercase tracking-[8px] text-zinc-500 text-sm mb-5">
            Premium Experience
          </p>

          <h2 className="text-5xl md:text-7xl font-black">Why ModernShop</h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-8 marquee px-6">
            {[
              {
                title: "Luxury Quality",
                desc: "Premium fabrics and handcrafted futuristic streetwear.",
                icon: "✦",
              },

              {
                title: "Fast Delivery",
                desc: "Lightning fast delivery experience across India.",
                icon: "⚡",
              },

              {
                title: "Premium Design",
                desc: "Luxury UI inspired by premium fashion brands.",
                icon: "◈",
              },

              {
                title: "Exclusive Drops",
                desc: "Limited collections released every month.",
                icon: "✺",
              },

              {
                title: "Modern Streetwear",
                desc: "Minimal futuristic fashion for modern lifestyle.",
                icon: "⬢",
              },

              {
                title: "Secure Payments",
                desc: "100% secure and smooth checkout system.",
                icon: "✔",
              },

              {
                title: "Luxury Packaging",
                desc: "Premium unboxing experience for every order.",
                icon: "✧",
              },
            ].map((item, index) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={index}
                className="
            min-w-[300px]
            bg-gradient-to-br
            from-zinc-900
            to-black
            border
            border-zinc-800
            rounded-[34px]
            p-8
            group
            relative
            overflow-hidden
            backdrop-blur-xl
            hover:border-white/20
            transition-all
            duration-500
          "
              >
                {/* GLOW EFFECT */}
                <div
                  className="
            absolute
            w-40
            h-40
            bg-white/5
            rounded-full
            blur-3xl
            -top-10
            -right-10
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
          "
                ></div>

                {/* ICON */}
                <div
                  className="
            w-16
            h-16
            rounded-2xl
            bg-white/5
            border
            border-zinc-800
            flex
            items-center
            justify-center
            text-2xl
            mb-8
            group-hover:bg-white
            group-hover:text-black
            transition-all
            duration-500
          "
                >
                  {item.icon}
                </div>

                {/* TITLE */}
                <h3 className="text-3xl font-bold mb-5 text-white">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-zinc-400 leading-8 text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 px-6 md:px-20 border-t border-zinc-900">
        <div className="bg-zinc-900 rounded-[40px] p-10 md:p-20 border border-zinc-800 text-center">
          <p className="uppercase tracking-[6px] text-zinc-500 mb-4">
            Stay Updated
          </p>

          <h2 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl mx-auto">
            Join The Future Of Fashion.
          </h2>

          <p className="text-zinc-400 mt-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Get exclusive drops, early access collections, and premium
            streetwear updates.
          </p>

          <div className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto mt-10">
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/its__subho__jit?igsh=MW9tejQ1MWZoMGFsYw=="
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 px-8 py-5 rounded-2xl backdrop-blur-xl hover:border-pink-500 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl">
                  <FaInstagram />
                </div>

                <div className="text-left">
                  <p className="text-white font-semibold">Instagram</p>

                  <p className="text-zinc-500 text-sm">
                    Follow our fashion drops
                  </p>
                </div>
              </a>

              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/share/1Dkneo7CdU/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 px-8 py-5 rounded-2xl backdrop-blur-xl hover:border-blue-500 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                  <FaFacebookF />
                </div>

                <div className="text-left">
                  <p className="text-white font-semibold">Facebook</p>

                  <p className="text-zinc-500 text-sm">Join our community</p>
                </div>
              </a>

              {/* YOUTUBE */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 px-8 py-5 rounded-2xl backdrop-blur-xl hover:border-red-500 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                  <FaYoutube />
                </div>

                <div className="text-left">
                  <p className="text-white font-semibold">YouTube</p>

                  <p className="text-zinc-500 text-sm">Watch premium content</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
