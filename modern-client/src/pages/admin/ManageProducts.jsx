
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  Boxes,
  IndianRupee,
  X,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Sidebar from "./Sidebar";
import {
  getAllProducts,
  deleteProduct,
} from "../../services/productService";

const IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const getProductImage = (image) => {
  if (!image) return "https://placehold.co/500x500?text=No+Image";
  return image.startsWith("http") ? image : `${IMAGE_BASE}${image}`;
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "inactive":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    case "out of stock":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-[#c7b99d]/10 text-[#c7b99d] border-[#c7b99d]/20";
  }
};

function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Unable to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map((product) => product.pCategory?.cName)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.pName?.toLowerCase().includes(search.toLowerCase()) ||
        product.pCategory?.cName?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.pCategory?.cName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const totalStock = (product) =>
    product.pSizes?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) || 0;

  const handleDelete = async (id) => {
    const product = products.find((item) => item._id === id);

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product?.pName || "this product"}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await deleteProduct(id);

      console.log("DELETE PRODUCT RESPONSE:", response);

      if (!response || response.error || response.success === false) {
        toast.error(response?.error || "Delete Failed");
        return;
      }

      toast.success("Product Deleted Successfully");

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = products.filter(
    (product) => product.pStatus?.toLowerCase() === "active"
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.pStatus?.toLowerCase() === "out of stock"
  ).length;

  const inputStyle =
    "w-full bg-[#171715] border border-white/[0.09] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#c7b99d]/60";

  return (
    <div className="min-h-screen bg-[#171715] text-white">
      <Sidebar />

      <main className="min-h-screen px-5 pb-16 pt-8 md:ml-[250px] md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1450px]">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end"
          >
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-7 bg-[#c7b99d]" />
                <span className="text-[10px] font-semibold uppercase tracking-[3px] text-[#c7b99d]">
                  Modern Shop / Inventory
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Manage <span className="font-light text-[#c7b99d]">Products.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                Manage your collection, monitor inventory and keep your
                product listings up to date.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fetchProducts(true)}
                disabled={refreshing}
                className="flex items-center gap-2 border border-white/[0.1] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:border-[#c7b99d]/40 hover:text-[#c7b99d] disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/add-product")}
                className="flex items-center gap-2 bg-[#c7b99d] px-5 py-3 text-xs font-bold uppercase tracking-[1.5px] text-[#171715] transition hover:bg-[#d7cbb4]"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Total Products",
                value: products.length,
                icon: Package,
              },
              {
                label: "Active Products",
                value: activeCount,
                icon: Eye,
              },
              {
                label: "Out of Stock",
                value: outOfStockCount,
                icon: Boxes,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center justify-between border border-white/[0.08] bg-[#20201d] p-5 sm:p-6"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500">
                    {stat.label}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tabular-nums">
                    {loading ? "—" : stat.value}
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                  <stat.icon size={20} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* FILTER BAR */}
          <div className="mb-5 flex flex-col gap-4 border border-white/[0.08] bg-[#20201d] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product or category..."
                className={`${inputStyle} pl-11`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 sm:w-[220px]">
              <Filter size={16} className="shrink-0 text-[#c7b99d]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`${inputStyle} min-w-0`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="overflow-hidden border border-white/[0.08] bg-[#20201d]">

            <div className="flex flex-col justify-between gap-2 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <h2 className="text-sm font-semibold">Product Collection</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                Inventory Management
              </span>
            </div>

            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-5 py-20 text-center">
                <Package
                  size={35}
                  className="mx-auto mb-4 text-zinc-600"
                />
                <h3 className="text-base font-semibold">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {search || selectedCategory !== "All"
                    ? "Try changing your search or category filter."
                    : "Start building your collection by adding a product."}
                </p>

                {(search || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    className="mt-5 text-xs font-semibold uppercase tracking-[1px] text-[#c7b99d] hover:text-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[850px]">
                    <thead>
                      <tr className="border-b border-white/[0.07] bg-[#171715] text-left">
                        {[
                          "Product",
                          "Category",
                          "Price",
                          "Stock",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-4 text-[9px] font-semibold uppercase tracking-[2px] text-zinc-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(index * 0.025, 0.3) }}
                          className="border-b border-white/[0.06] transition hover:bg-white/[0.02]"
                        >
                          {/* PRODUCT */}
                          <td className="px-6 py-5">
                            <div className="flex min-w-[230px] items-center gap-4">
                              <img
                                src={getProductImage(product.pImages?.[0])}
                                alt={product.pName}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/200x200?text=No+Image";
                                }}
                                className="h-[65px] w-[65px] shrink-0 border border-white/[0.08] bg-[#171715] object-cover"
                              />
                              <div className="min-w-0">
                                <h3 className="max-w-[210px] truncate text-sm font-semibold text-zinc-100">
                                  {product.pName}
                                </h3>
                                <p className="mt-1 max-w-[210px] truncate text-xs text-zinc-500">
                                  {product.pDescription || "No description"}
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-wider text-zinc-600">
                                  {product.pGender || "Unisex"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}
                          <td className="px-6 py-5 text-xs text-zinc-400">
                            {product.pCategory?.cName || "Uncategorized"}
                          </td>

                          {/* PRICE */}
                          <td className="px-6 py-5">
                            <span className="flex items-center gap-1 text-sm font-semibold text-[#c7b99d]">
                              <IndianRupee size={13} />
                              {Number(product.pPrice || 0).toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* STOCK */}
                          <td className="px-6 py-5">
                            <span className="text-sm font-medium text-zinc-200">
                              {totalStock(product)}
                            </span>
                            <p className="mt-1 text-[9px] uppercase tracking-wider text-zinc-600">
                              Units
                            </p>
                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider ${getStatusStyle(product.pStatus)}`}
                            >
                              {product.pStatus || "Unknown"}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/admin/edit-product/${product._id}`)
                                }
                                className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-zinc-400 transition hover:border-[#c7b99d]/50 hover:text-[#c7b99d]"
                                title="Edit product"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(product._id)}
                                disabled={deletingId === product._id}
                                className="flex h-9 w-9 items-center justify-center border border-white/[0.1] text-zinc-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-40"
                                title="Delete product"
                              >
                                {deletingId === product._id ? (
                                  <RefreshCw size={15} className="animate-spin" />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE / TABLET PRODUCT LIST */}
                <div className="divide-y divide-white/[0.07] lg:hidden">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <img
                          src={getProductImage(product.pImages?.[0])}
                          alt={product.pName}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/200x200?text=No+Image";
                          }}
                          className="h-24 w-24 shrink-0 border border-white/[0.08] bg-[#171715] object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold">
                            {product.pName}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-500">
                            {product.pCategory?.cName || "Uncategorized"}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#c7b99d]">
                            ₹{Number(product.pPrice || 0).toLocaleString("en-IN")}
                          </p>
                          <span
                            className={`mt-2 inline-flex border px-2 py-1 text-[9px] uppercase tracking-wider ${getStatusStyle(product.pStatus)}`}
                          >
                            {product.pStatus || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-zinc-500">
                          Stock: <span className="text-zinc-200">{totalStock(product)} units</span>
                        </p>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/edit-product/${product._id}`)
                            }
                            className="flex items-center gap-2 border border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-zinc-300 hover:border-[#c7b99d]/50 hover:text-[#c7b99d]"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="flex items-center gap-2 border border-red-500/20 px-3 py-2 text-[10px] uppercase tracking-wider text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-10 border-t border-white/[0.07] pt-6 text-center">
            <p className="text-[9px] uppercase tracking-[3px] text-zinc-600">
              MODERN SHOP · ADMINISTRATION
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageProducts;
