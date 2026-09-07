import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";

import { addProduct } from "../../services/productService";

import Sidebar from "./Sidebar";

function Admin() {
  const [categories, setCategories] = useState([]);

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
      const data = await getCategories();

      setCategories(data.categories || []);
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.cGender?.includes(formData.pGender),
  );

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category._id === formData.pCategory,
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

    // MULTIPLE IMAGES
    if (name === "pImages") {
      setFormData((prev) => ({
        ...prev,
        pImages: [...prev.pImages, ...Array.from(files)],
      }));
      return;
    }

    // RESET CATEGORY WHEN GENDER CHANGES
    if (name === "pGender") {
      setFormData({
        ...formData,
        pGender: value,
        pCategory: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("pName", formData.pName);

      data.append("pDescription", formData.pDescription);

      data.append("pPrice", formData.pPrice);

      data.append("pGender", formData.pGender);

      data.append("pCategory", formData.pCategory);

      data.append("pSizes", JSON.stringify(formData.pSizes));

      // MULTIPLE IMAGES
      formData.pImages.forEach((img) => {
        data.append("pImages", img);
      });

      const response = await addProduct(data);

      console.log(response);

      toast.success("Product Added Successfully");

      // RESET FORM
      setFormData({
        pName: "",
        pDescription: "",
        pPrice: "",
        pGender: "Unisex",
        pCategory: "",

        pSizes: [],

        pImages: [],
      });
    } catch (error) {
      console.log(error);

      toast.error("Product Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[250px] p-10 pt-8">
        <h1 className="text-5xl font-black mb-10">Add Product</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PRODUCT NAME */}
            <input
              type="text"
              name="pName"
              placeholder="Product Name"
              value={formData.pName}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            />

            {/* PRICE */}
            <input
              type="number"
              name="pPrice"
              placeholder="Price"
              value={formData.pPrice}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            />

            {/* GENDER */}
            <select
              name="pGender"
              value={formData.pGender}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            >
              <option value="Unisex">Unisex</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>

            {/* CATEGORY */}
            <select
              name="pCategory"
              value={formData.pCategory}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            >
              <option value="">Select Category</option>

              {filteredCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.cName}
                </option>
              ))}
            </select>

            {/* SIZE STOCK */}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Sizes & Stock</h2>

              {formData.pSizes.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-center">
                    {item.size}
                  </div>

                  <input
                    type="number"
                    placeholder={`Stock for ${item.size}`}
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedSizes = [...formData.pSizes];

                      updatedSizes[index].quantity = Number(e.target.value);

                      setFormData({
                        ...formData,
                        pSizes: updatedSizes,
                      });
                    }}
                    className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4"
                  />
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <textarea
              rows="5"
              name="pDescription"
              placeholder="Description"
              value={formData.pDescription}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
            />

            {/* IMAGE INPUT */}
            <input
              type="file"
              name="pImages"
              multiple
              onChange={handleChange}
              className="w-full"
            />

            {/* IMAGE PREVIEW */}
            <div className="flex gap-4 flex-wrap mt-4">
              {formData.pImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview ${index + 1}`}
                    className="w-28 h-28 object-cover rounded-2xl border border-zinc-700"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        pImages: prev.pImages.filter((_, i) => i !== index),
                      }));
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold flex items-center justify-center hover:bg-red-700 transition"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
