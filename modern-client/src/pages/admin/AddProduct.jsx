
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Upload,
  X,
  ImagePlus,
  IndianRupee,
  Tag,
  Layers3,
  Shirt,
  Boxes,
  CheckCircle2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";
import { addProduct } from "../../services/productService";
import Sidebar from "./Sidebar";

function Admin() {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
    pGender: "Unisex",
    pCategory: "",
    pSizes: [],
    pImages: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load categories");
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.cGender?.includes(formData.pGender)
  );

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category._id === formData.pCategory
    );

    const categoryName = selectedCategory?.cName?.trim().toLowerCase();

    let sizeOptions = [];

    if (categoryName === "shoes") {
      sizeOptions = ["6", "7", "8", "9", "10", "11", "12"];
    } else if (categoryName === "jeans") {
      sizeOptions = ["28", "30", "32", "34", "36", "38"];
    } else if (["t-shirt", "shirt", "dress"].includes(categoryName)) {
      sizeOptions = ["S", "M", "L", "XL", "XXL"];
    } else if (categoryName) {
      sizeOptions = ["One Size"];
    }

    setFormData((prev) => ({
      ...prev,
      pSizes: sizeOptions.map((size) => ({
        size,
        quantity: 0,
      })),
    }));
  }, [formData.pCategory, categories]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pImages") {
      const selectedFiles = Array.from(files || []);
      const remaining = Math.max(0, 5 - formData.pImages.length);

      if (selectedFiles.length > remaining) {
        toast.error("You can upload a maximum of 5 images");
      }

      setFormData((prev) => ({
        ...prev,
        pImages: [...prev.pImages, ...selectedFiles.slice(0, remaining)],
      }));

      e.target.value = "";
      return;
    }

    if (name === "pGender") {
      setFormData((prev) => ({
        ...prev,
        pGender: value,
        pCategory: "",
        pSizes: [],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateStock = (index, value) => {
    const updatedSizes = [...formData.pSizes];

    updatedSizes[index] = {
      ...updatedSizes[index],
      quantity: Math.max(0, Number(value)),
    };

    setFormData((prev) => ({
      ...prev,
      pSizes: updatedSizes,
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      pImages: prev.pImages.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      pName: "",
      pDescription: "",
      pPrice: "",
      pGender: "Unisex",
      pCategory: "",
      pSizes: [],
      pImages: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!formData.pPrice || Number(formData.pPrice) <= 0) {
      toast.error("Enter a valid product price");
      return;
    }

    if (!formData.pCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.pImages.length) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (
      formData.pSizes.length &&
      !formData.pSizes.some((item) => item.quantity > 0)
    ) {
      toast.error("Add stock for at least one size");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("pName", formData.pName.trim());
      data.append("pDescription", formData.pDescription);
      data.append("pPrice", formData.pPrice);
      data.append("pGender", formData.pGender);
      data.append("pCategory", formData.pCategory);
      data.append("pSizes", JSON.stringify(formData.pSizes));

      formData.pImages.forEach((img) => {
        data.append("pImages", img);
      });

      const response = await addProduct(data);

      console.log("ADD PRODUCT RESPONSE:", response);

      if (!response || response.error || response.success === false) {
        toast.error(response?.error || "Product Upload Failed");
        return;
      }

      toast.success(response.success || "Product Added Successfully");
      resetForm();
    } catch (error) {
      console.error("Product upload error:", error);
      toast.error(
        error.response?.data?.message || "Product Upload Failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const inputStyle =
    "w-full bg-[#171715] border border-white/[0.09] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-[#c7b99d]/60 focus:bg-[#1d1d1a]";

  const labelStyle =
    "mb-2.5 block text-[10px] font-semibold uppercase tracking-[2px] text-zinc-400";

  return (
    <div className="min-h-screen bg-[#171715] text-white">
      <Sidebar />

      <main className="min-h-screen px-5 pb-16 pt-8 md:ml-[250px] md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1250px]">

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
                Add <span className="font-light text-[#c7b99d]">Product.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                Introduce a new piece to the collection. Add product details,
                manage size-wise inventory and upload product imagery.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start border border-white/[0.08] bg-[#20201d] px-4 py-3 sm:self-auto">
              <Package size={17} className="text-[#c7b99d]" />
              <div>
                <p className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                  New listing
                </p>
                <p className="mt-1 text-xs font-medium text-white">
                  Product creation
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_350px]">

              {/* LEFT COLUMN */}
              <div className="space-y-7">

                {/* BASIC INFORMATION */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="border border-white/[0.08] bg-[#20201d] p-5 sm:p-8"
                >
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">
                        Product Information
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Essential details of your product
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelStyle}>Product Name</label>
                      <input
                        type="text"
                        name="pName"
                        placeholder="e.g. Premium Cotton Oversized T-Shirt"
                        value={formData.pName}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelStyle}>Product Price (INR)</label>
                      <div className="relative">
                        <IndianRupee
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c7b99d]"
                        />
                        <input
                          type="number"
                          name="pPrice"
                          min="1"
                          placeholder="Enter selling price"
                          value={formData.pPrice}
                          onChange={handleChange}
                          className={`${inputStyle} pl-10`}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelStyle}>Collection / Gender</label>
                        <select
                          name="pGender"
                          value={formData.pGender}
                          onChange={handleChange}
                          className={inputStyle}
                        >
                          <option value="Unisex">Unisex</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelStyle}>Product Category</label>
                        <select
                          name="pCategory"
                          value={formData.pCategory}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        >
                          <option value="">Select category</option>
                          {filteredCategories.map((category) => (
                            <option
                              key={category._id}
                              value={category._id}
                            >
                              {category.cName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelStyle}>Product Description</label>
                      <textarea
                        rows="6"
                        name="pDescription"
                        placeholder="Describe the material, fit, design and other product details..."
                        value={formData.pDescription}
                        onChange={handleChange}
                        className={`${inputStyle} resize-y leading-7`}
                      />
                    </div>
                  </div>
                </motion.section>

                {/* SIZE & STOCK */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="border border-white/[0.08] bg-[#20201d] p-5 sm:p-8"
                >
                  <div className="mb-7 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                        <Layers3 size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold">
                          Size & Inventory
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500">
                          Manage available stock for each size
                        </p>
                      </div>
                    </div>
                    <Boxes size={20} className="text-zinc-600" />
                  </div>

                  {formData.pSizes.length > 0 ? (
                    <>
                      <div className="mb-4 grid grid-cols-[90px_1fr] gap-4 px-1">
                        <span className="text-[9px] font-semibold uppercase tracking-[2px] text-zinc-500">
                          Size
                        </span>
                        <span className="text-[9px] font-semibold uppercase tracking-[2px] text-zinc-500">
                          Available quantity
                        </span>
                      </div>

                      <div className="space-y-3">
                        {formData.pSizes.map((item, index) => (
                          <div
                            key={item.size}
                            className="grid grid-cols-[90px_1fr] items-center gap-4"
                          >
                            <div className="flex h-12 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/[0.06] text-sm font-semibold text-[#c7b99d]">
                              {item.size}
                            </div>

                            <input
                              type="number"
                              min="0"
                              placeholder="Enter stock quantity"
                              value={item.quantity}
                              onChange={(e) =>
                                updateStock(index, e.target.value)
                              }
                              className={inputStyle}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="border border-dashed border-white/[0.1] px-5 py-10 text-center">
                      <Shirt
                        size={25}
                        className="mx-auto mb-3 text-zinc-600"
                      />
                      <p className="text-sm text-zinc-400">
                        Select a category to configure sizes
                      </p>
                      <p className="mt-2 text-xs text-zinc-600">
                        Size options will appear automatically
                      </p>
                    </div>
                  )}
                </motion.section>

                {/* PRODUCT IMAGES */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="border border-white/[0.08] bg-[#20201d] p-5 sm:p-8"
                >
                  <div className="mb-7 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                        <ImagePlus size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold">
                          Product Photography
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500">
                          Upload high-quality product images
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] tracking-wider text-zinc-500">
                      {formData.pImages.length}/5 IMAGES
                    </span>
                  </div>

                  <label className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center border border-dashed border-white/[0.15] bg-[#171715] px-5 py-8 text-center transition-all duration-300 hover:border-[#c7b99d]/50 hover:bg-[#c7b99d]/[0.03]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d] transition-transform group-hover:-translate-y-1">
                      <Upload size={20} />
                    </div>

                    <p className="text-sm font-medium text-zinc-200">
                      Click to upload product images
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      JPG, PNG or WEBP · Maximum 5 images
                    </p>

                    <input
                      type="file"
                      name="pImages"
                      accept="image/*"
                      multiple
                      disabled={formData.pImages.length >= 5}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                  {formData.pImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {formData.pImages.map((img, index) => (
                        <div
                          key={`${img.name}-${index}`}
                          className="group relative"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Product preview ${index + 1}`}
                            className="aspect-square w-full border border-white/[0.1] bg-[#171715] object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-[#c7b99d] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#171715]">
                              Main image
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/80 text-white transition hover:bg-red-600"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.section>
              </div>

              {/* RIGHT COLUMN */}
              <aside className="space-y-6">

                {/* LISTING SUMMARY */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="border border-white/[0.08] bg-[#20201d] p-6"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <Package size={18} className="text-[#c7b99d]" />
                    <h2 className="text-sm font-semibold">
                      Listing Summary
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">
                        Product
                      </span>
                      <span className="max-w-[170px] text-right text-xs font-medium text-zinc-200">
                        {formData.pName || "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">
                        Price
                      </span>
                      <span className="text-sm font-semibold text-[#c7b99d]">
                        {formData.pPrice
                          ? `₹${Number(formData.pPrice).toLocaleString("en-IN")}`
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">
                        Collection
                      </span>
                      <span className="text-xs text-zinc-200">
                        {formData.pGender}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">
                        Sizes
                      </span>
                      <span className="text-xs text-zinc-200">
                        {formData.pSizes.length || 0} options
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-zinc-500">
                        Total stock
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {formData.pSizes.reduce(
                          (total, item) => total + Number(item.quantity || 0),
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* PUBLISH */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 }}
                  className="border border-[#c7b99d]/20 bg-[#c7b99d]/[0.04] p-6"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <CheckCircle2 size={19} className="text-[#c7b99d]" />
                    <h2 className="text-sm font-semibold">
                      Ready to publish?
                    </h2>
                  </div>

                  <p className="mb-6 text-xs leading-6 text-zinc-400">
                    Review your product details, size availability and
                    photography before adding it to your store.
                  </p>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex w-full items-center justify-center gap-3 bg-[#c7b99d] px-5 py-4 text-xs font-bold uppercase tracking-[2px] text-[#171715] transition-all duration-300 hover:bg-[#d7cbb4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171715]/30 border-t-[#171715]" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Product
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={uploading}
                    className="mt-3 w-full border border-white/[0.1] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-400 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                  >
                    Clear Form
                  </button>
                </motion.div>

                {/* NOTE */}
                <div className="border-l-2 border-[#c7b99d]/40 bg-[#20201d] px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c7b99d]">
                    Inventory note
                  </p>
                  <p className="mt-2 text-xs leading-6 text-zinc-500">
                    Stock quantities are managed separately for each size.
                    Make sure the available quantities are correct before
                    publishing.
                  </p>
                </div>
              </aside>
            </div>
          </form>

          <div className="mt-12 border-t border-white/[0.07] pt-6 text-center">
            <p className="text-[9px] uppercase tracking-[3px] text-zinc-600">
              MODERN SHOP · ADMINISTRATION
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
