import { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const localUser = JSON.parse(
          localStorage.getItem("user")
        );

        const response = await axios.post(
          "http://localhost:8000/api/order/order-by-user",
          {
            uId: localUser.user._id,
          }
        );

        console.log(response.data);

        setOrders(response.data.Order);

      } catch (error) {

        console.log(error);

      }

    };

    fetchOrders();
    

  }, []);

    console.log(orders);

  return (

    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-12">

      <h1 className="text-5xl font-black mb-12">
        My Orders
      </h1>

      <div className="space-y-8">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >

            {/* TOP */}

            <div className="flex justify-between items-center mb-6">

              <div>

                <p className="text-zinc-500">
                  Order ID
                </p>

                <h2 className="font-semibold">
                  {order._id}
                </h2>

              </div>

              <div className="text-right">

                <p className="text-zinc-500">
                  Status
                </p>

                <h2 className="font-semibold">
                  {order.status}
                </h2>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="space-y-4">

              {order.allProduct?.map((item) => (

               
                   
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-black rounded-2xl p-4"
                >

                  <img
                    src={`http://localhost:8000/uploads/products/${item.id?.pImages[0]}`}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1">

                    <h2 className="font-semibold text-lg">
                      {item.id?.pName}
                    </h2>

                    <p className="text-zinc-500">
                      Qty : {item.quantity || item.quantitiy}
                    </p>

                  </div>

                  <h2 className="font-bold text-xl">
                    ₹ {item.id?.pPrice}
                  </h2>

                </div>

              ))}

            </div>

            {/* TOTAL */}

            <div className="mt-6 text-right">

              <h2 className="text-3xl font-bold">
                ₹ {order.amount}
              </h2>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default MyOrders;