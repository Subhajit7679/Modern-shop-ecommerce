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
    pCategory: "",
    pImage: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();

      setCategories(data.Categories || []);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pImage") {
      setFormData({
        ...formData,
        pImage: files[0],
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

    const data = new FormData();

    data.append("pName", formData.pName);
    data.append("pDescription", formData.pDescription);
    data.append("pPrice", formData.pPrice);
    data.append("pCategory", formData.pCategory);
    data.append("pImage", formData.pImage);

    const response = await addProduct(data);

    console.log(response);

    toast.success("Product Added");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8" >
        <h1 className="text-5xl font-black mb-10">Add Product</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="pName"
              placeholder="Product Name"
              value={formData.pName}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <input
              type="number"
              name="pPrice"
              placeholder="Price"
              value={formData.pPrice}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <select
              name="pCategory"
              value={formData.pCategory}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.cName}
                </option>
              ))}
            </select>

            <textarea
              rows="5"
              name="pDescription"
              placeholder="Description"
              value={formData.pDescription}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            />

            <input
              type="file"
              name="pImage"
              onChange={handleChange}
              className="w-full"
            />

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
