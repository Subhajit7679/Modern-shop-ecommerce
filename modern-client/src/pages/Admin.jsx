
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Package,
  UploadCloud,
  ImagePlus,
  X,
  Plus,
  ArrowRight,
  Tag,
  IndianRupee,
  AlignLeft,
  Layers,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import { getCategories } from "../services/categoryService";
import { addProduct } from "../services/productService";

function Admin() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
    pCategory: "",
    pImages: [],
  });

  const [previews, setPreviews] = useState([]);

  // FETCH CATEGORIES
  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        if (active) {
          setCategories(data?.categories || []);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
        if (active) toast.error("Unable to load categories");
      } finally {
        if (active) setLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  // CLEAN UP IMAGE PREVIEWS
  useEffect(() => {
    const urls = formData.pImages.map((image) =>
      URL.createObjectURL(image)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.pImages]);

  // HANDLE INPUTS
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pImages") {
      const selectedFiles = Array.from(files || []);

      if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
        toast.error("Please select valid image files");
        e.target.value = "";
        return;
      }

      if (formData.pImages.length + selectedFiles.length > 5) {
        toast.error("You can upload a maximum of 5 images");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        pImages: [...prev.pImages, ...selectedFiles],
      }));

      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // REMOVE SELECTED IMAGE
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      pImages: prev.pImages.filter((_, i) => i !== index),
    }));
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      pName: "",
      pDescription: "",
      pPrice: "",
      pCategory: "",
      pImages: [],
    });
  };

  // SUBMIT PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pName.trim()) {
      return toast.error("Please enter product name");
    }

    if (!formData.pDescription.trim()) {
      return toast.error("Please enter product description");
    }

    if (!formData.pPrice || Number(formData.pPrice) <= 0) {
      return toast.error("Please enter a valid price");
    }

    if (!formData.pCategory) {
      return toast.error("Please select a category");
    }

    if (formData.pImages.length === 0) {
      return toast.error("Please upload at least one image");
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("pName", formData.pName.trim());
      data.append("pDescription", formData.pDescription.trim());
      data.append("pPrice", formData.pPrice);
      data.append("pCategory", formData.pCategory);

      formData.pImages.forEach((img) => {
        data.append("pImages", img);
      });

      const response = await addProduct(data);

      if (response?.success === false) {
        throw new Error(response.message || "Product upload failed");
      }

      toast.success("Product added successfully");
      resetForm();
    } catch (error) {
      console.error("Product upload error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Product upload failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-[#171715] border border-white/10 px-5 py-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-[#c7b99d]/60";

  const labelClass =
    "block text-[10px] uppercase tracking-[2px] text-zinc-400 mb-3";

  return (
    <div className="min-h-screen bg-[#171715] text-white relative overflow-hidden">
      {/* BACKGROUND LIGHT */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-180px] right-[-150px] w-[450px] h-[450px] rounded-full bg-[#c7b99d]/[0.04] blur-[150px]" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-[#a18e6d]/[0.04] blur-[150px]" />
      </div>

      <div className="relative max-w-[1250px] mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-px bg-[#c7b99d]" />
            <p className="text-[#c7b99d] text-[10px] uppercase tracking-[4px]">
              Store Administration
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-2px]">
                Admin <span className="text-[#c7b99d]">Dashboard.</span>
              </h1>

              <p className="text-zinc-500 text-sm mt-4 max-w-lg leading-7">
                Manage your store inventory and introduce new pieces
                to the Modern Shop collection.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-white/10 bg-[#20201d] px-5 py-4">
              <Package size={19} className="text-[#c7b99d]" />
              <div>
                <p className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                  Product Management
                </p>
                <p className="text-sm font-medium mt-1">
                  Add New Product
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FORM LAYOUT */}
        <div className="grid lg:grid-cols-[1fr_330px] gap-8 items-start">

          {/* MAIN FORM */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#20201d] border border-white/[0.08]"
          >
            {/* FORM HEADER */}
            <div className="px-6 sm:px-9 py-7 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-[#c7b99d] uppercase tracking-[3px] mb-2">
                  Inventory / New Entry
                </p>
                <h2 className="text-2xl font-semibold">
                  Add Product
                </h2>
              </div>

              <div className="w-11 h-11 border border-[#c7b99d]/20 bg-[#c7b99d]/[0.06] flex items-center justify-center">
                <Plus size={21} className="text-[#c7b99d]" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-9 space-y-8">

              {/* PRODUCT NAME */}
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <Tag size={13} className="text-[#c7b99d]" />
                    Product Name
                  </span>
                </label>

                <input
                  type="text"
                  name="pName"
                  placeholder="Enter product name"
                  value={formData.pName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              {/* PRICE AND CATEGORY */}
              <div className="grid sm:grid-cols-2 gap-6">

                <div>
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <IndianRupee size={13} className="text-[#c7b99d]" />
                      Product Price
                    </span>
                  </label>

                  <input
                    type="number"
                    name="pPrice"
                    placeholder="Enter price in INR"
                    min="1"
                    value={formData.pPrice}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <Layers size={13} className="text-[#c7b99d]" />
                      Product Category
                    </span>
                  </label>

                  <select
                    name="pCategory"
                    value={formData.pCategory}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                    required
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.cName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <AlignLeft size={13} className="text-[#c7b99d]" />
                    Product Description
                  </span>
                </label>

                <textarea
                  rows={6}
                  name="pDescription"
                  placeholder="Describe the product, its features, material and details..."
                  value={formData.pDescription}
                  onChange={handleChange}
                  className={`${inputClass} resize-y leading-7`}
                  required
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <ImagePlus size={14} className="text-[#c7b99d]" />
                      Product Images
                    </span>
                  </label>

                  <span className="text-[10px] text-zinc-500">
                    {formData.pImages.length} / 5 selected
                  </span>
                </div>

                <label className="group flex flex-col items-center justify-center text-center border border-dashed border-white/20 bg-[#171715] px-5 py-10 cursor-pointer hover:border-[#c7b99d]/60 transition">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#c7b99d]/[0.08] border border-[#c7b99d]/20 mb-5 group-hover:bg-[#c7b99d]/[0.14] transition">
                    <UploadCloud
                      size={25}
                      className="text-[#c7b99d]"
                    />
                  </div>

                  <p className="text-sm font-medium text-zinc-200">
                    Click to upload product images
                  </p>

                  <p className="text-xs text-zinc-600 mt-2">
                    JPG, PNG or WEBP · Maximum 5 images
                  </p>

                  <input
                    type="file"
                    name="pImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                {/* IMAGE PREVIEWS */}
                {previews.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[9px] uppercase tracking-[2px] text-zinc-500 mb-4">
                      Selected Images
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {previews.map((preview, index) => (
                        <div
                          key={`${preview}-${index}`}
                          className="relative group aspect-square bg-[#171715] border border-white/10 overflow-hidden"
                        >
                          <img
                            src={preview}
                            alt={`Product preview ${index + 1}`}
                            className="w-full h-full object-contain p-1"
                          />

                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-[#c7b99d] text-[#171715] text-[8px] uppercase tracking-[1px] text-center py-1 font-bold">
                              Main Image
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute top-1 right-1 w-7 h-7 bg-black/80 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#c7b99d] text-[#171715] px-7 py-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[2px] hover:bg-[#ded2bb] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Uploading Product...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Product
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-8 py-5 border border-white/10 text-zinc-400 text-xs uppercase tracking-[2px] hover:border-[#c7b99d]/50 hover:text-white transition disabled:opacity-50"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </motion.div>

          {/* SIDE INFORMATION */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            {/* GUIDELINES */}
            <div className="border border-white/10 bg-[#20201d] p-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2
                  size={18}
                  className="text-[#c7b99d]"
                />
                <h3 className="text-sm font-semibold">
                  Upload Guidelines
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  "Use clear, high-quality product images.",
                  "Choose a descriptive product name.",
                  "Write accurate product information.",
                  "Double-check the category and price.",
                ].map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-[#c7b99d] text-xs">
                      0{index + 1}
                    </span>
                    <p className="text-xs text-zinc-500 leading-6">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCT SUMMARY */}
            <div className="border border-white/10 bg-[#20201d] p-6">
              <p className="text-[9px] uppercase tracking-[3px] text-[#c7b99d] mb-5">
                Product Overview
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[1px] mb-2">
                    Product Name
                  </p>
                  <p className="text-sm text-zinc-300 break-words">
                    {formData.pName || "Not added yet"}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[1px] mb-2">
                    Selling Price
                  </p>
                  <p className="text-xl text-[#c7b99d] font-semibold">
                    {formData.pPrice
                      ? `₹${Number(formData.pPrice).toLocaleString("en-IN")}`
                      : "₹0"}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[1px] mb-2">
                    Category
                  </p>
                  <p className="text-sm text-zinc-300">
                    {categories.find(
                      (category) => category._id === formData.pCategory
                    )?.cName || "Not selected"}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-[1px] mb-2">
                    Images Selected
                  </p>
                  <p className="text-sm text-zinc-300">
                    {formData.pImages.length} images
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#c7b99d]/15 bg-[#c7b99d]/[0.04] p-5">
              <p className="text-[10px] uppercase tracking-[2px] text-[#c7b99d] mb-2">
                Modern Shop
              </p>
              <p className="text-xs text-zinc-500 leading-6">
                Every product is part of your store's identity.
                Keep your catalogue consistent and well presented.
              </p>
            </div>
          </motion.aside>
        </div>

        {/* FOOTER */}
        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-[9px] uppercase tracking-[3px] text-zinc-600">
            Modern Shop / Administration
          </p>
          <p className="text-[9px] uppercase tracking-[2px] text-zinc-700">
            Style. Quality. Simplicity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
