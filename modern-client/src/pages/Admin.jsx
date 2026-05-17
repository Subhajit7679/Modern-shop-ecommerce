import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { getCategories } from "../services/categoryService";

import { addProduct } from "../services/productService";

function Admin() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
    pCategory: "",
    pImages: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();

      setCategories(data.categories || []);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // MULTIPLE IMAGES
    if (name === "pImages") {
      setFormData({
        ...formData,
        pImages: [...files],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("pName", formData.pName);

      data.append("pDescription", formData.pDescription);

      data.append("pPrice", formData.pPrice);

      data.append("pCategory", formData.pCategory);

      // MULTIPLE IMAGES
      formData.pImages.forEach((img) => {
        data.append("pImages", img);
      });

      const response = await addProduct(data);

      console.log(response);

      toast.success("Product Added");

      // RESET FORM
      setFormData({
        pName: "",
        pDescription: "",
        pPrice: "",
        pCategory: "",
        pImages: [],
      });
    } catch (error) {
      console.log(error);

      toast.error("Product upload failed");
    }
  };

  return (
    <div className="text-white px-8 py-10 min-h-screen bg-black">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl">
        <h2 className="text-3xl font-semibold mb-8">Add Product</h2>

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

          {/* CATEGORY */}
          <select
            name="pCategory"
            value={formData.pCategory}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          >
            <option value="">Select Category</option>

            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.cName}
              </option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <textarea
            rows="5"
            name="pDescription"
            placeholder="Product Description"
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
          <div className="flex gap-4 flex-wrap">
            {formData.pImages.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-28 h-28 object-cover rounded-2xl border border-zinc-700"
              />
            ))}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;
