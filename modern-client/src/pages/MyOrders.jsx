import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));

        const response = await axios.post(
          "http://localhost:8000/api/order/order-by-user",
          {
            uId: localUser.user._id,
          },
        );

        setOrders(response.data.Order || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        md:px-8
        py-10
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-12">
          <p
            className="
              uppercase
              tracking-[6px]
              text-zinc-500
              text-sm
              mb-3
            "
          >
            Purchase History
          </p>

          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
            "
          >
            My Orders
          </h1>
        </div>

        {/* EMPTY */}

        {orders.length === 0 && (
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-[32px]
              p-20
              text-center
            "
          >
            <div className="text-8xl mb-6">📦</div>

            <h2
              className="
                text-4xl
                font-black
                mb-4
              "
            >
              No Orders Yet
            </h2>

            <p
              className="
                text-zinc-500
                text-lg
              "
            >
              Your placed orders will appear here
            </p>
          </div>
        )}

        {/* ORDERS */}

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-[32px]
                overflow-hidden
              "
            >
              {/* TOP */}

              <div
                className="
                  border-b
                  border-zinc-800
                  p-6
                   grid
                  lg:grid-cols-[2fr_120px_140px_180px]
                  
                  gap-15
                  items-center
                "
              >
                {/* ORDER INFO */}

                <div className="min-w-[400px]">
                  <p className="text-zinc-500 mb-2">Order ID</p>

                  <h2
                    className="
                      font-semibold
                      text-lg
                      break-all
                    "
                  >
                    {order.orderId}
                  </h2>

                  {order.estimatedDelivery && (
                    <p className="text-green-400 mt-4">
                      Estimated Delivery :{" "}
                      {new Date(order.estimatedDelivery).toDateString()}
                    </p>
                  )}
                </div>

                {/* PAYMENT */}

               <div className="w-[120px]">
                  <p className="text-zinc-500 mb-2">Payment</p>

                  <h2 className="font-semibold mb-4">{order.paymentMethod}</h2>

                  <span
                    className={`
      inline-block
      px-5
      py-2
      rounded-full
      text-sm
      font-semibold

      ${
        order.paymentStatus === "Paid"
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-400"
      }
    `}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* STATUS */}

                <div className="w-[140px]">
                  <p className="text-zinc-500 mb-2">Status</p>

                  <span
                    className={`
      inline-block
      px-5
      py-2
      rounded-full
      text-sm
      font-semibold

      ${
        order.status === "Delivered"
          ? "bg-green-500/20 text-green-400"
          : order.status === "Cancelled"
            ? "bg-red-500/20 text-red-400"
            : order.status === "Shipped"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-yellow-500/20 text-yellow-400"
      }
    `}
                  >
                    {order.status}
                  </span>
                </div>

                {/* BUTTON */}

                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="
                    bg-white
                    text-black
                    px-6
                    py-3
                    rounded-2xl
                    font-semibold
                    hover:scale-105
                    transition
                    whitespace-nowrap
                  "
                >
                  View Details
                </button>
              </div>

              {/* PRODUCTS */}

              <div className="p-6 space-y-5">
                {order.allProduct?.map((item, index) => (
                  <div
                    key={index}
                    className="
                        bg-black
                        border
                        border-zinc-800
                        rounded-3xl
                        p-4
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        gap-5
                      "
                  >
                    {/* IMAGE */}

                    <img
                      src={`http://localhost:8000/uploads/products/${item.id?.pImages?.[0]}`}
                      alt=""
                      className="
                          w-28
                          h-28
                          object-cover
                          rounded-2xl
                        "
                    />

                    {/* INFO */}

                    <div className="flex-1">
                      <h2
                        className="
                            text-2xl
                            font-bold
                            mb-2
                          "
                      >
                        {item.id?.pName}
                      </h2>

                      <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                            mt-3
                          "
                      >
                        <span
                          className="
                              bg-zinc-900
                              border
                              border-zinc-700
                              px-4
                              py-2
                              rounded-xl
                              text-sm
                            "
                        >
                          Qty : {item.quantity}
                        </span>

                        <span
                          className="
                              bg-zinc-900
                              border
                              border-zinc-700
                              px-4
                              py-2
                              rounded-xl
                              text-sm
                            "
                        >
                          Size : {item.selectedSize || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* PRICE */}

                    <div
                      className="
                          text-left
                          md:text-right
                        "
                    >
                      <p className="text-zinc-500">Price</p>

                      <h2
                        className="
                            text-3xl
                            font-black
                            mt-2
                          "
                      >
                        ₹ {item.id?.pPrice}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}

              <div
                className="
                  border-t
                  border-zinc-800
                  p-6
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-4
                "
              >
                <div>
                  <p className="text-zinc-500">
                    {order.allProduct.length} Items
                  </p>

                  <p className="text-zinc-500 mt-3">Payment</p>

                  <h2 className="font-semibold mt-1">{order.paymentMethod}</h2>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-zinc-500">Total Amount</p>

                  <h2
                    className="
                      text-4xl
                      font-black
                      mt-2
                    "
                  >
                    ₹ {order.amount}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
