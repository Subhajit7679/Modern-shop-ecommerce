
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { getAllProducts } from "../services/productService";
import { WishlistContext } from "../context/WishlistContext";
import fashionVideo from "../assets/videos/fashion.mp4";

const IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const benefits = [
  {
    icon: Sparkles,
    title: "Curated Style",
    description:
      "Thoughtfully selected pieces for a distinctive everyday wardrobe.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "A convenient shopping experience with delivery across India.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Shop with confidence through our secure checkout experience.",
  },
  {
    icon: RefreshCw,
    title: "Easy Experience",
    description:
      "Simple browsing, smooth shopping and a seamless order journey.",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(WishlistContext);

  const productsRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        if (active) {
          setProducts(data?.products || []);
          console.log("FIRST PRODUCT:", data?.products?.[0]);
          console.log("IMAGE FILENAME:", data?.products?.[0]?.pImages?.[0]);
          const firstImage = data?.products?.[0]?.pImages?.[0];

         console.log(
           "FULL IMAGE URL:",
            firstImage?.startsWith("http")
             ? firstImage
           : `${IMAGE_BASE}${firstImage || "default.png"}`
          );
        }
      } catch (error) {
        console.error("Unable to load products:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const scrollProducts = (direction) => {
    productsRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  };

  return (
    <main className="overflow-hidden bg-[#f5f3ee] text-[#171715]">

      {/* HERO SECTION */}
      <section className="relative min-h-[650px] overflow-hidden bg-[#171715] text-white lg:min-h-[720px]">

        <div className="grid min-h-[650px] lg:min-h-[720px] lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex items-center px-6 py-24 sm:px-12 lg:px-16 xl:px-24">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(199,185,157,0.12),transparent_55%)]" />

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative z-10 max-w-2xl"
            >
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-[#c7b99d]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c7b99d] sm:text-xs">
                  The Modern Collection · 2026
                </p>
              </div>

              <h1 className="text-[clamp(3.5rem,7vw,6.8rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
                Style is
                <br />
                <span className="font-serif font-normal italic text-[#c7b99d]">
                  personal.
                </span>
                <br />
                Make it
                <br />
                modern.
              </h1>

              <p className="mt-8 max-w-md text-sm leading-8 text-zinc-400 sm:text-base">
                Discover contemporary streetwear, distinctive designs
                and everyday essentials made for your own expression.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">

                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-5 rounded-full bg-[#c7b99d] px-7 py-4 text-xs font-bold uppercase tracking-wider text-black transition duration-300 hover:bg-white"
                >
                  Explore Collection
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
                >
                  Discover More
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="mt-16 flex items-center gap-10 border-t border-white/10 pt-7">

                <div>
                  <p className="text-2xl font-semibold">01</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    New Season
                  </p>
                </div>

                <div className="h-9 w-px bg-white/15" />

                <div>
                  <p className="text-2xl font-semibold">∞</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                    Your Style
                  </p>
                </div>

              </div>
            </motion.div>
          </div>

          {/* RIGHT VIDEO */}
          <div className="absolute inset-0 z-0 min-h-full overflow-hidden lg:relative lg:inset-auto lg:col-start-2 lg:min-h-full">

            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover opacity-35 lg:opacity-100"
            >
              <source src={fashionVideo} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#171715] via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-[#171715]/20" />

            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between sm:bottom-12 sm:left-12 sm:right-12">

              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">
                  Modern Shop
                </p>
                <p className="mt-2 text-xl font-medium tracking-tight">
                  Wear your identity.
                </p>
              </div>

              <span className="rounded-full border border-white/30 px-4 py-2 text-[9px] uppercase tracking-widest text-white backdrop-blur-md">
                Explore
              </span>

            </div>
          </div>
        </div>
      </section>

      
      {/* PREMIUM COLLECTION INTRO */}
      <section className="relative overflow-hidden bg-[#1b1b19] px-6 py-14 text-white sm:px-12 sm:py-28 lg:px-20 lg:py-36">

        <div className="pointer-events-none absolute -right-10 top-0 select-none font-serif text-[19vw] font-bold leading-none tracking-tighter text-white/[0.025]">
          STYLE
        </div>

        <div className="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a18e6d]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#a18e6d]">
                Designed for today
              </p>
            </div>

            <h2 className="max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.08] tracking-[-0.06em] text-white">
              Fashion that
              <br />
              speaks

              <span className="block font-serif font-normal italic text-[#a18e6d]">
                without words.
              </span>
            </h2>

          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:justify-self-end lg:max-w-md"
          >

            <span className="mb-6 block h-px w-12 bg-[#a18e6d] lg:w-16" />

            <p className="text-sm leading-8 text-zinc-400 sm:text-base sm:leading-9">
              Your wardrobe is an expression of who you are.
              Explore a collection that brings together contemporary
              style, comfort and individuality.
            </p>

            <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              YOUR STYLE · YOUR IDENTITY
            </p>

          </motion.div>

        </div>
      </section>


      {/* TRENDING PRODUCTS */}
      <section className="relative isolate overflow-hidden bg-[#111110] px-6 py-20 text-white sm:px-12 lg:px-20 lg:py-28">
      
      {/* SUBTLE GOLDEN BACKGROUND LIGHTING */}
           <div className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-[#c7b99d]/[0.07] blur-[130px]" />

            <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#c7b99d]/[0.06] blur-[130px]" />

        <div className="mx-auto max-w-[1400px]">

          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">

            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-[#a18e6d]">
                Handpicked for you
              </p>

              <h2 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Latest arrivals
              </h2>

              <p className="mt-4 text-sm text-zinc-400">
                Discover pieces worth making your own.
              </p>
            </div>

            <div className="flex items-center gap-4">

              <button
                onClick={() => scrollProducts(-1)}
                aria-label="Previous products"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition hover:border-[#a18e6d] hover:bg-[#a18e6d] hover:text-black"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => scrollProducts(1)}
                aria-label="Next products"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition hover:border-[#a18e6d] hover:bg-[#a18e6d] hover:text-black"
              >
                <ChevronRight size={20} />
              </button>

              <Link
                to="/shop"
                className="ml-2 hidden items-center gap-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-widest transition hover:text-[#a18e6d] sm:flex"
              >
                View all <ArrowUpRight size={15} />
              </Link>

            </div>
          </div>

          
          {/* PREMIUM PRODUCT CAROUSEL */}
          <div
            ref={productsRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-6 sm:gap-5"
            style={{ scrollbarWidth: "none" }}
          >
            {loading && (
              <div className="w-full py-20 text-center text-sm text-zinc-500">
                Loading latest arrivals...
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="w-full py-20 text-center text-sm text-zinc-500">
                No products available right now.
              </div>
            )}

            {products.slice(0, 8).map((product, index) => {
              const wishlisted = isInWishlist(product._id);

              return (
                <motion.article
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  className="group relative w-[82%] min-w-[82%] max-w-[320px] snap-start sm:w-[300px] sm:min-w-[300px]"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#dedbd3]">

                    <Link
                      to={`/product/${product._id}`}
                      className="block h-full w-full"
                    >
                      
                     <img
                      src={
                       product.pImages?.[0]?.startsWith("http")
                        ? product.pImages[0]
                       : `${IMAGE_BASE}${product.pImages?.[0] || "default.png"}`
                      }
                       alt={product.pName}
                       loading="lazy"
                         className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                   </Link>


                    {/* NEW LABEL */}
                    <span className="absolute left-3 top-3 bg-[#f5f3ee] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-black sm:left-4 sm:top-4">
                      New Arrival
                    </span>

                    {/* WISHLIST */}
                    <button
                      onClick={() =>
                        wishlisted
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product)
                      }
                      aria-label={
                        wishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition sm:right-4 sm:top-4 ${
                        wishlisted
                          ? "bg-[#c7b99d] text-black"
                          : "bg-white/90 text-black hover:bg-[#c7b99d]"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={wishlisted ? "currentColor" : "none"}
                      />
                    </button>

                    {/* DESKTOP QUICK VIEW LINK */}
                    <Link
                      to={`/product/${product._id}`}
                      className="absolute bottom-4 left-4 right-4 hidden translate-y-3 bg-[#f5f3ee] py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-black opacity-0 transition duration-300 hover:bg-[#c7b99d] group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                    >
                      View Product
                    </Link>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="pt-4 sm:pt-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${product._id}`}>
                          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-[#c7b99d] transition hover:text-[#a18e6d] sm:text-base">
                            {product.pName}
                          </h3>
                        </Link>

                        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-zinc-400 sm:text-xs">
                          {product.pDescription}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-[#c7b99d] sm:text-base">
                        ₹{product.pPrice}
                      </p>

                    </div>

                    {/* MOBILE PRODUCT LINK */}
                    <Link
                      to={`/product/${product._id}`}
                      className="mt-4 flex items-center justify-between border-b border-zinc-300 pb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-700 transition hover:border-black hover:text-black sm:hidden"
                    >
                      View Product
                      <ArrowUpRight size={15} />
                    </Link>

                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* VIEW ALL PRODUCTS */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 rounded-full bg-[#171715] px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-[#c7b99d] hover:text-black"
            >
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>


        </div>
      </section>

     

      
      {/* PREMIUM BRAND STATEMENT */}
      <section className="relative isolate overflow-hidden bg-[#171715] px-6 py-24 text-white sm:px-12 sm:py-32 lg:px-20 lg:py-40">

        {/* BACKGROUND LIGHTING */}
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[#c7b99d]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#c7b99d]/10 blur-[140px]" />

        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="select-none whitespace-nowrap font-serif text-[22vw] font-bold tracking-tighter text-white/[0.025]">
            MODERN
          </span>
        </div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-[1200px] text-center"
        >

          {/* EYEBROW */}
          <div className="mb-8 flex items-center justify-center gap-4 sm:mb-10">
            <span className="h-px w-8 bg-[#c7b99d]/60" />

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c7b99d] sm:text-[11px] sm:tracking-[0.45em]">
              More than just fashion
            </p>

            <span className="h-px w-8 bg-[#c7b99d]/60" />
          </div>

          {/* MAIN HEADING */}
          <h2 className="mx-auto max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[1.08] tracking-[-0.065em]">
            Wear what
            <br />
            feels right.

            <span className="mt-2 block font-serif font-normal italic text-[#c7b99d]">
              Be unapologetically you.
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-8 max-w-lg text-xs leading-7 text-zinc-400 sm:mt-10 sm:text-sm sm:leading-8">
            Your style is your signature. Discover pieces that reflect
            your individuality and make every moment your own.
          </p>

          {/* CTA */}
          <Link
            to="/shop"
            className="group mt-10 inline-flex items-center gap-5 rounded-full border border-[#c7b99d]/50 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7b99d] transition-all duration-300 hover:border-[#c7b99d] hover:bg-[#c7b99d] hover:text-black sm:mt-12 sm:px-10 sm:py-5"
          >
            Discover your style

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>

          {/* BOTTOM DECORATION */}
          <div className="mx-auto mt-16 flex max-w-md items-center justify-center gap-5 sm:mt-20">
            <span className="h-px flex-1 bg-white/10" />

            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              MODERN SHOP
            </span>

            <span className="h-px flex-1 bg-white/10" />
          </div>

        </motion.div>
      </section>


      
      {/* PREMIUM WHY MODERN SHOP */}
<section className="relative isolate overflow-hidden bg-[#171715] px-6 py-24 text-white sm:px-12 sm:py-28 lg:px-20 lg:py-36">

  {/* BACKGROUND LIGHTING */}
  <div className="pointer-events-none absolute -left-40 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-[#c7b99d]/10 blur-[120px]" />

  <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#c7b99d]/10 blur-[140px]" />

  {/* BACKGROUND DECORATION */}
  <div className="pointer-events-none absolute right-0 top-10 select-none font-serif text-[20vw] font-bold tracking-tighter text-white/[0.025]">
    QUALITY
  </div>

  <div className="relative mx-auto max-w-[1400px]">

    {/* SECTION HEADING */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end"
    >
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-[#c7b99d]" />

          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c7b99d]">
            The Modern Difference
          </p>
        </div>

        <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Shopping,
          <br />
          <span className="font-serif font-normal italic text-[#c7b99d]">
            reimagined.
          </span>
        </h2>
      </div>

      <p className="max-w-sm text-sm leading-7 text-zinc-400 md:pb-2">
        A better shopping experience, built around quality,
        convenience and confidence.
      </p>
    </motion.div>

    {/* BENEFIT CARDS */}
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">

      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;

        return (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className="group border-t border-white/15 pt-7 transition-colors duration-300 hover:border-[#c7b99d]"
          >
            <div className="mb-9 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#c7b99d]">
                0{index + 1} / 04
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#c7b99d] transition-all duration-300 group-hover:border-[#c7b99d] group-hover:bg-[#c7b99d] group-hover:text-black">
                <Icon size={21} strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-lg font-semibold tracking-tight text-white">
              {benefit.title}
            </h3>

            <p className="mt-3 max-w-xs text-sm leading-7 text-zinc-400">
              {benefit.description}
            </p>

            <div className="mt-8 h-px w-0 bg-[#c7b99d] transition-all duration-500 group-hover:w-full" />
          </motion.div>
        );
      })}

    </div>
  </div>
</section>


      
      {/* PREMIUM SOCIAL / COMMUNITY */}
      <section className="relative overflow-hidden border-t border-zinc-200 bg-[#dedbd2] px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">

        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute -right-20 top-0 select-none font-serif text-[22vw] font-bold tracking-tighter text-black/[0.025]">
          SOCIAL
        </div>

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-2 lg:gap-20">

          {/* LEFT CONTENT */}
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a18e6d]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#a18e6d]">
                Stay connected
              </p>
            </div>

            <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-0.055em] text-[#171715] sm:text-5xl lg:text-6xl">
              Follow the
              <br />
              modern movement.

              <span className="mt-2 block font-serif font-normal italic text-[#a18e6d]">
                Be part of it.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-zinc-600">
              Discover new looks, exclusive updates and the latest
              collections. Stay inspired and express your style.
            </p>

            <p className="mt-10 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-800">
              MODERN SHOP · CONNECT WITH US
            </p>
          </div>

          {/* RIGHT SOCIAL LINKS */}
          <div className="flex flex-col border-t border-zinc-300 md:border-t-0">

            <a
              href="https://www.instagram.com/its__subho__jit?igsh=MW9tejQ1MWZoMGFsYw=="
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-zinc-300 py-6 transition-colors hover:border-[#a18e6d] sm:py-8"
            >
              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#a18e6d]">
                  01 / Follow us
                </span>

                <span className="text-2xl font-semibold tracking-tight text-[#171715] transition-colors group-hover:text-[#a18e6d] sm:text-3xl">
                  Instagram
                </span>
              </div>

              <ArrowUpRight
                size={23}
                className="text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
              />
            </a>

            <a
              href="https://www.facebook.com/share/1Dkneo7CdU/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-zinc-300 py-6 transition-colors hover:border-[#a18e6d] sm:py-8"
            >
              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#a18e6d]">
                  02 / Join our community
                </span>

                <span className="text-2xl font-semibold tracking-tight text-[#171715] transition-colors group-hover:text-[#a18e6d] sm:text-3xl">
                  Facebook
                </span>
              </div>

              <ArrowUpRight
                size={23}
                className="text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
              />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-zinc-300 py-6 transition-colors hover:border-[#a18e6d] sm:py-8"
            >
              <div>
                <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.25em] text-[#a18e6d]">
                  03 / Watch more
                </span>

                <span className="text-2xl font-semibold tracking-tight text-[#171715] transition-colors group-hover:text-[#a18e6d] sm:text-3xl">
                  YouTube
                </span>
              </div>

              <ArrowUpRight
                size={23}
                className="text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
              />
            </a>

          </div>
        </div>
      </section>


    </main>
  );
}

export default Home;
