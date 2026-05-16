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
    <div className="text-white px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl">

        <h2 className="text-2xl font-semibold mb-6">
          Add Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="pName"
            placeholder="Product Name"
            value={formData.pName}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          />

          <input
            type="number"
            name="pPrice"
            placeholder="Price"
            value={formData.pPrice}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          />

          <select
            name="pCategory"
            value={formData.pCategory}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.cName}
              </option>
            ))}
          </select>

          <textarea
            rows="4"
            name="pDescription"
            placeholder="Description"
            value={formData.pDescription}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          />

          <input
            type="file"
            name="pImage"
            onChange={handleChange}
            className="w-full"
          />

          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Add Product
          </button>

        </form>
      </div>
    </div>
  );
}

export default Admin;