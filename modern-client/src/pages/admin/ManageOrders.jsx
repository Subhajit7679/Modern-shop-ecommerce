import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/adminOrderService";

import toast from "react-hot-toast";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getAllOrders();

    if (data.Orders) {
      setOrders(data.Orders);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatus = async (oId, status) => {
    const response = await updateOrderStatus(oId, status);
    console.log(response);

    if (response.success) {
      toast.success("Order Updated");

      fetchOrders();
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-black
      text-white
      flex
    "
    >
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8">
        <p
          className="
          uppercase
          tracking-[8px]
          text-zinc-500
          text-sm
          mb-4
        "
        >
          Orders Management
        </p>

        <h1
          className="
          text-6xl
          font-black
          mb-10
        "
        >
          Manage Orders
        </h1>

        <div
          className="
          space-y-6
        "
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-3xl
                p-6
              "
            >
              <div
                className="
                flex
                justify-between
                items-start
                flex-wrap
                gap-5
              "
              >
                <div>
                  <h2
                    className="
                    text-2xl
                    font-bold
                    mb-2
                  "
                  >
                    {order.user?.name}
                  </h2>

                  <p
                    className="
                    text-zinc-400
                  "
                  >
                    {order.user?.email}
                  </p>

                  <p
                    className="
                    text-zinc-500
                    mt-3
                  "
                  >
                    {order.address}
                  </p>

                  <p
                    className="
                    text-zinc-500
                  "
                  >
                    {order.phone}
                  </p>
                </div>

                <div
                  className="
                  text-right
                "
                >
                  <h2
                    className="
                    text-3xl
                    font-bold
                  "
                  >
                    ₹ {order.amount}
                  </h2>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatus(order._id, e.target.value)}
                    className="
                      mt-4
                      bg-black
                      border
                      border-zinc-700
                      px-4
                      py-3
                      rounded-xl
                    "
                  >
                    <option>Not processed</option>

                    <option>Processing</option>

                    <option>Shipped</option>

                    <option>Delivered</option>

                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <div
                className="
                mt-6
                grid
                md:grid-cols-2
                gap-5
              "
              >
                {order.allProduct.map((item) => (
                  <div
                    key={item._id}
                    className="
                      bg-black
                      border
                      border-zinc-800
                      rounded-2xl
                      p-4
                      flex
                      gap-4
                      items-center
                    "
                  >
                    <img
                      src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${item.id?.pImages?.[0]}`}
                      alt=""
                      className="
                        w-20
                        h-20
                        rounded-xl
                        object-cover
                      "
                    />

                    <div>
                      <h2 className="  font-bold  text-lg ">
                        {item.id?.pName}
                      </h2>

                      <p className=" text-zinc-500 ">Qty : {item.quantity}</p>

                      <p className=" text-zinc-500 ">
                        Size : {item.selectedSize}
                      </p>

                      <p className=" text-zinc-400">₹ {item.id?.pPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
