import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Sidebar from "./Sidebar";

import { getAllProducts, deleteProduct } from "../../services/productService";

import { useNavigate } from "react-router-dom";

function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();

      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Delete this product?");

      if (!confirmDelete) return;

      const response = await deleteProduct(id);

      console.log(response);

      if (response.success) {
        toast.success("Product Deleted");

        // REMOVE PRODUCT FROM UI
        setProducts(products.filter((item) => item._id !== id));
      } else {
        toast.error(response.error || "Delete Failed");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="uppercase tracking-[6px] text-zinc-500 mb-3">
              Product Management
            </p>

            <h1 className="text-5xl font-black">Manage Products</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-950">
              <tr className="text-left">
                <th className="p-6">Image</th>

                <th className="p-6">Product</th>

                <th className="p-6">Price</th>

                <th className="p-6">Category</th>

                <th className="p-6">Status</th>

                <th className="p-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-zinc-800">
                  {/* IMAGE */}
                  <td className="p-6">
                    <img
                      src={`http://localhost:8000/uploads/products/${product.pImages?.[0]}`}
                      alt={product.pName}
                      className="w-20 h-20 object-cover rounded-2xl"
                    />
                  </td>

                  {/* NAME */}
                  <td className="p-6">
                    <h2 className="font-bold text-lg">{product.pName}</h2>

                    <p className="text-zinc-500 text-sm line-clamp-1 mt-1">
                      {product.pDescription}
                    </p>
                  </td>

                  {/* PRICE */}
                  <td className="p-6 font-semibold">₹ {product.pPrice}</td>

                  {/* CATEGORY */}
                  <td className="p-6">{product.pCategory?.cName}</td>

                  {/* STATUS */}
                  <td className="p-6">
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                      {product.pStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-6">
                    <div className="flex gap-3">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/edit-product/${product._id}`)
                        }
                        className="
                          bg-white
                          text-black
                          px-5
                          py-2
                          rounded-xl
                          hover:scale-105
                          transition
                        "
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="
                          bg-red-500
                          hover:bg-red-600
                          transition
                          px-5
                          py-2
                          rounded-xl
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;
