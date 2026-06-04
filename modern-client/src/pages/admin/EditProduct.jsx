import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import Sidebar from "./Sidebar";

import { getSingleProduct } from "../../services/productService";

import { getCategories } from "../../services/categoryService";
import { updateProduct } from "../../services/productService";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    pName: "",
    pDescription: "",
    pPrice: "",
    pCategory: "",
    pSizes: [
      { size: "S", quantity: 0 },
      { size: "M", quantity: 0 },
      { size: "L", quantity: 0 },
      { size: "XL", quantity: 0 },
    ],
    pStatus: "",
    pImages: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getSingleProduct(id);

      if (response.product) {
        setProduct(response.product);

        setFormData({
          pName: response.product.pName || "",

          pDescription: response.product.pDescription || "",

          pPrice: response.product.pPrice || "",

          pCategory: response.product.pCategory?._id || "",

          pOffer: response.product.pOffer || "",

          pStatus: response.product.pStatus || "",

          pImages: response.product.pImages || [],

          pSizes: response.product.pSizes || [
            { size: "S", quantity: 0 },
            { size: "M", quantity: 0 },
            { size: "L", quantity: 0 },
            { size: "XL", quantity: 0 },
          ],
        });
      }
    };

    const fetchCategories = async () => {
      const data = await getCategories();

      setCategories(data.categories || []);
    };

    fetchProduct();

    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pImages") {
      setFormData({
        ...formData,
        pImages: Array.from(files),
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

      data.append("pId", id);

      data.append("pName", formData.pName);

      data.append("pDescription", formData.pDescription);

      data.append("pPrice", formData.pPrice);

      data.append("pCategory", formData.pCategory);

      data.append("pStatus", formData.pStatus);

      data.append("pOffer", "No");

      data.append("pSizes", JSON.stringify(formData.pSizes));

      // IMPORTANT

      // OLD IMAGES
      data.append("pImages", product.pImages);

      // NEW IMAGES
      formData.pImages.forEach((img) => {
        data.append("pImages", img);
      });

      const response = await updateProduct(data);

      console.log(response);

      if (response.success) {
        toast.success("Product Updated");

        navigate("/admin/manage-products");
      } else {
        toast.error("Update Failed");
      }
    } catch (error) {
      console.log(error);

      toast.error("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8">
        <h1 className="text-5xl font-black mb-10">Edit Product</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl">
          {/* EXISTING IMAGES */}

          <div className="flex gap-4 flex-wrap mb-6">
            {product?.pImages?.map((img, index) => (
              <img
                key={index}
                src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${img}`}
                alt=""
                className="w-28 h-28 object-cover rounded-2xl"
              />
            ))}
          </div>

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
                  {category.cName || category.name}
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

            <select
              name="pStatus"
              value={formData.pStatus}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4"
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>

              <option value="Out Of Stock">Out Of Stock</option>
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
              multiple
              name="pImages"
              onChange={handleChange}
              className="w-full"
            />

            <button
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
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
