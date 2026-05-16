import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import Sidebar from "./Sidebar";

import { getSingleProduct } from "../../services/productService";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getSingleProduct(id);

      if (response.product) {
        setFormData({
          pName: response.product.pName,
          pDescription: response.product.pDescription,
          pPrice: response.product.pPrice,
        });
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.success("Update API Coming Next Step");

    navigate("/admin/manage-products");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8">
        <h1 className="text-5xl font-black mb-10">Edit Product</h1>

        <div
          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-8
          max-w-4xl
        "
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="pName"
              placeholder="Product Name"
              value={formData.pName}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
              "
            />

            <input
              type="number"
              name="pPrice"
              placeholder="Price"
              value={formData.pPrice}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
              "
            />

            <textarea
              rows="5"
              name="pDescription"
              placeholder="Description"
              value={formData.pDescription}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-zinc-700
                rounded-2xl
                px-5
                py-4
              "
            />

            <button
              type="submit"
              className="
                bg-white
                text-black
                px-8
                py-4
                rounded-2xl
                font-semibold
                hover:scale-105
                transition
              "
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
