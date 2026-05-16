import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

import { useEffect, useState } from "react";

import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await getDashboardData();

      setDashboard(response);
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[250px] p-10 pt-8">
        <h1 className="text-5xl font-black mb-10">Admin Dashboard</h1>

        {/* STATS */}

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Products</p>

            <h2 className="text-5xl font-bold">{dashboard.totalProducts}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Orders</p>

            <h2 className="text-5xl font-bold">{dashboard.totalOrders}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Delivered</p>

            <h2 className="text-5xl font-bold">{dashboard.deliveredOrders}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Shipped</p>

            <h2 className="text-5xl font-bold">{dashboard.shippedOrders}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Processing</p>

            <h2 className="text-5xl font-bold">{dashboard.processingOrders}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Cancelled</p>

            <h2 className="text-5xl font-bold">{dashboard.cancelledOrders}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-500 mb-3">Revenue</p>

            <h2 className="text-5xl font-bold">₹ {dashboard.totalRevenue}</h2>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-12 flex gap-5">
          <Link
            to="/admin/add-product"
            className="bg-white text-black px-8 py-4 rounded-2xl font-semibold"
          >
            Add Product
          </Link>

          <Link
            to="/admin/manage-products"
            className="border border-zinc-700 px-8 py-4 rounded-2xl"
          >
            Manage Products
          </Link>
        </div>

        {/* RECENT ORDERS */}

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Recent Orders</h2>

          <div className="space-y-4">
            {dashboard.recentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{order.user?.name}</h3>

                  <p className="text-zinc-500">{order.user?.email}</p>
                </div>

                <div>
                  <p className="font-bold text-xl">₹ {order.amount}</p>

                  <p className="text-sm text-zinc-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
