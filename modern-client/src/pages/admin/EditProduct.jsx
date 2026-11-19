
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  ImagePlus,
  Upload,
  X,
  IndianRupee,
  Tag,
  Layers3,
  Boxes,
  CheckCircle2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Sidebar from "./Sidebar";
import { getSingleProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const IMAGE_BASE =
  "https://modern-shop-backend-hfi9.onrender.com/uploads/products/";

const getImageUrl = (image) => {
  if (!image) return "https://placehold.co/500x500?text=No+Image";
  return image.startsWith("http") ? image : `${IMAGE_BASE}${image}`;
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
    pCategory: "",
    pSizes: [],
    pStatus: "Active",
    pOffer: "No",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse] = await Promise.all([
          getSingleProduct(id),
          getCategories(),
        ]);

        setCategories(categoryResponse.categories || []);

        if (!productResponse?.product) {
          toast.error("Product not found");
          navigate("/admin/manage-products");
          return;
        }

        const currentProduct = productResponse.product;

        setProduct(currentProduct);
        setExistingImages(currentProduct.pImages || []);

        setFormData({
          pName: currentProduct.pName || "",
          pDescription: currentProduct.pDescription || "",
          pPrice: currentProduct.pPrice || "",
          pCategory: currentProduct.pCategory?._id || "",
          pSizes: currentProduct.pSizes || [],
          pStatus: currentProduct.pStatus || "Active",
          pOffer: currentProduct.pOffer || "No",
        });
      } catch (error) {
        console.error("Fetch product error:", error);
        toast.error("Unable to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Clean up temporary image preview URLs
  useEffect(() => {
    const urls = newImages.map((image) => URL.createObjectURL(image));

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pImages") {
      const selectedFiles = Array.from(files || []);
      const remaining = Math.max(
        0,
        5 - existingImages.length - newImages.length
      );

      if (selectedFiles.length > remaining) {
        toast.error("You can keep a maximum of 5 images");
      }

      setNewImages((prev) => [
        ...prev,
        ...selectedFiles.slice(0, remaining),
      ]);

      e.target.value = "";
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

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
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

    if (existingImages.length + newImages.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    if (
      formData.pSizes.length &&
      !formData.pSizes.some((item) => Number(item.quantity) > 0)
    ) {
      toast.error("Add stock for at least one size");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("pId", id);
      data.append("pName", formData.pName.trim());
      data.append("pDescription", formData.pDescription);
      data.append("pPrice", formData.pPrice);
      data.append("pCategory", formData.pCategory);
      data.append("pStatus", formData.pStatus);
      data.append("pOffer", formData.pOffer || "No");
      data.append("pSizes", JSON.stringify(formData.pSizes));

      // Images that should remain on the product
      data.append("existingImages", JSON.stringify(existingImages));

      // Newly uploaded images
      newImages.forEach((image) => {
        data.append("pImages", image);
      });

      const response = await updateProduct(data);

      console.log("UPDATE PRODUCT RESPONSE:", response);

      if (!response || response.error || response.success === false) {
        toast.error(response?.error || "Product Update Failed");
        return;
      }

      toast.success("Product Updated Successfully");
      navigate("/admin/manage-products");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(
        error.response?.data?.message || "Product Update Failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const inputStyle =
    "w-full bg-[#171715] border border-white/[0.09] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-[#c7b99d]/60 focus:bg-[#1d1d1a]";

  const labelStyle =
    "mb-2.5 block text-[10px] font-semibold uppercase tracking-[2px] text-zinc-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171715] text-white">
        <Sidebar />
        <main className="flex min-h-screen items-center justify-center md:ml-[250px]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#c7b99d]/20 border-t-[#c7b99d]" />
            <p className="text-xs uppercase tracking-[2px] text-zinc-500">
              Loading product...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) return null;

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
              <button
                type="button"
                onClick={() => navigate("/admin/manage-products")}
                className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500 transition hover:text-[#c7b99d]"
              >
                <ArrowLeft size={14} />
                Back to products
              </button>

              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-7 bg-[#c7b99d]" />
                <span className="text-[10px] font-semibold uppercase tracking-[3px] text-[#c7b99d]">
                  Modern Shop / Inventory
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Edit <span className="font-light text-[#c7b99d]">Product.</span>
              </h1>

              <p className="mt-3 text-sm text-zinc-500">
                Update product information, imagery and inventory.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-white/[0.08] bg-[#20201d] px-4 py-3">
              <Package size={18} className="text-[#c7b99d]" />
              <div>
                <p className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                  Editing listing
                </p>
                <p className="mt-1 max-w-[180px] truncate text-xs font-medium text-white">
                  {formData.pName}
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_350px]">

              {/* LEFT COLUMN */}
              <div className="space-y-7">

                {/* PRODUCT INFORMATION */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        Update your product details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelStyle}>Product Name</label>
                      <input
                        type="text"
                        name="pName"
                        value={formData.pName}
                        onChange={handleChange}
                        placeholder="Product name"
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
                          min="1"
                          name="pPrice"
                          value={formData.pPrice}
                          onChange={handleChange}
                          placeholder="Enter selling price"
                          className={`${inputStyle} pl-10`}
                          required
                        />
                      </div>
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
                        {categories.map((category) => (
                          <option
                            key={category._id}
                            value={category._id}
                          >
                            {category.cName || category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelStyle}>Product Description</label>
                      <textarea
                        rows="6"
                        name="pDescription"
                        value={formData.pDescription}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        className={`${inputStyle} resize-y leading-7`}
                      />
                    </div>
                  </div>
                </motion.section>

                {/* SIZE STOCK */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="border border-white/[0.08] bg-[#20201d] p-5 sm:p-8"
                >
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                      <Layers3 size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">
                        Size & Inventory
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Manage stock for each size
                      </p>
                    </div>
                  </div>

                  {formData.pSizes.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[90px_1fr] gap-4 px-1">
                        <span className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                          Size
                        </span>
                        <span className="text-[9px] uppercase tracking-[2px] text-zinc-500">
                          Available quantity
                        </span>
                      </div>

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
                            value={item.quantity}
                            onChange={(e) =>
                              updateStock(index, e.target.value)
                            }
                            className={inputStyle}
                            placeholder="Stock quantity"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
                      No size information available for this product.
                    </p>
                  )}
                </motion.section>

                {/* PRODUCT IMAGES */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="border border-white/[0.08] bg-[#20201d] p-5 sm:p-8"
                >
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[#c7b99d]/10 text-[#c7b99d]">
                      <ImagePlus size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">
                        Product Photography
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Manage existing and new images
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500">
                    Existing Images ({existingImages.length})
                  </p>

                  {existingImages.length > 0 ? (
                    <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {existingImages.map((img, index) => (
                        <div key={`${img}-${index}`} className="group relative">
                          <img
                            src={getImageUrl(img)}
                            alt={`Existing product ${index + 1}`}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/500x500?text=Image+Unavailable";
                            }}
                            className="aspect-square w-full border border-white/[0.1] bg-[#171715] object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/80 text-white transition hover:bg-red-600"
                            title="Remove existing image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-7 border border-dashed border-white/10 p-7 text-center text-xs text-zinc-500">
                      No existing images retained
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500">
                      Add New Images
                    </p>
                    <span className="text-[10px] text-zinc-500">
                      {existingImages.length + newImages.length}/5 images
                    </span>
                  </div>

                  <label
                    className={`group flex min-h-[150px] flex-col items-center justify-center border border-dashed border-white/[0.15] bg-[#171715] px-5 py-7 text-center transition hover:border-[#c7b99d]/50 ${
                      existingImages.length + newImages.length >= 5
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer"
                    }`}
                  >
                    <Upload
                      size={22}
                      className="mb-3 text-[#c7b99d]"
                    />
                    <p className="text-sm text-zinc-300">
                      Click to upload new images
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      JPG, PNG or WEBP · Maximum 5 images in total
                    </p>

                    <input
                      type="file"
                      name="pImages"
                      accept="image/*"
                      multiple
                      disabled={
                        existingImages.length + newImages.length >= 5
                      }
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                  {newImages.length > 0 && (
                    <div className="mt-6">
                      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500">
                        Newly Selected Images
                      </p>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {newImages.map((image, index) => (
                          <div
                            key={`${image.name}-${index}`}
                            className="group relative"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`New preview ${index + 1}`}
                              className="aspect-square w-full border border-[#c7b99d]/30 bg-[#171715] object-cover"
                            />

                            <span className="absolute bottom-2 left-2 bg-[#c7b99d] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#171715]">
                              New
                            </span>

                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/80 text-white transition hover:bg-red-600"
                              title="Remove new image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.section>
              </div>

              {/* RIGHT COLUMN */}
              <aside className="space-y-6">

                {/* STATUS */}
                <motion.section
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-white/[0.08] bg-[#20201d] p-6"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#c7b99d]" />
                    <h2 className="text-sm font-semibold">
                      Product Status
                    </h2>
                  </div>

                  <label className={labelStyle}>Visibility</label>
                  <select
                    name="pStatus"
                    value={formData.pStatus}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out Of Stock">Out Of Stock</option>
                  </select>

                  <p className="mt-3 text-xs leading-6 text-zinc-500">
                    Choose how this product should appear in your store.
                  </p>
                </motion.section>

                {/* SUMMARY */}
                <motion.section
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                  className="border border-white/[0.08] bg-[#20201d] p-6"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <Boxes size={18} className="text-[#c7b99d]" />
                    <h2 className="text-sm font-semibold">
                      Listing Summary
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">Product</span>
                      <span className="max-w-[170px] truncate text-right text-xs text-zinc-200">
                        {formData.pName || "Not added"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">Price</span>
                      <span className="text-sm font-semibold text-[#c7b99d]">
                        {formData.pPrice
                          ? `₹${Number(formData.pPrice).toLocaleString("en-IN")}`
                          : "—"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">Sizes</span>
                      <span className="text-xs text-zinc-200">
                        {formData.pSizes.length} options
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-white/[0.07] pb-4">
                      <span className="text-xs text-zinc-500">Total stock</span>
                      <span className="text-sm font-semibold text-white">
                        {formData.pSizes.reduce(
                          (total, item) =>
                            total + Number(item.quantity || 0),
                          0
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-zinc-500">Images</span>
                      <span className="text-xs text-zinc-200">
                        {existingImages.length + newImages.length}/5
                      </span>
                    </div>
                  </div>
                </motion.section>

                {/* UPDATE ACTION */}
                <motion.section
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14 }}
                  className="border border-[#c7b99d]/20 bg-[#c7b99d]/[0.04] p-6"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <Save size={18} className="text-[#c7b99d]" />
                    <h2 className="text-sm font-semibold">
                      Save Changes
                    </h2>
                  </div>

                  <p className="mb-6 text-xs leading-6 text-zinc-400">
                    Your changes will be applied to this product after a
                    successful update.
                  </p>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex w-full items-center justify-center gap-3 bg-[#c7b99d] px-5 py-4 text-xs font-bold uppercase tracking-[2px] text-[#171715] transition hover:bg-[#d7cbb4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171715]/30 border-t-[#171715]" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Update Product
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/manage-products")}
                    disabled={uploading}
                    className="mt-3 w-full border border-white/[0.1] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-400 transition hover:border-white/30 hover:text-white"
                  >
                    Cancel
                  </button>
                </motion.section>
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

export default EditProduct;
