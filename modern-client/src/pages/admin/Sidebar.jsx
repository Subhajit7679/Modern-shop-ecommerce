import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
    },

    {
      name: "Add Product",
      path: "/admin/add-product",
    },

    /*
    {
      name: "Add Category",
      path: "/admin/add-category",
    },
    */

    {
      name: "Manage Products",
      path: "/admin/manage-products",
    },

    {
      name: "Manage Orders",
      path: "/admin/orders",
    },

    {
      name: "Manage Coupons",
      path: "/admin/manage-coupons",
    },
  ];

  return (
    <div
      className="
w-[250px]
fixed
left-0
top-20
h-[calc(100vh-80px)]
bg-zinc-950
border-r
border-zinc-800
p-8
z-50
"
    >
      <h1
        className="
        text-3xl
        font-black
        text-white
        mb-10
      "
      >
        ModernShop
      </h1>

      <div
        className="
        flex
        flex-col
        gap-5
      "
      >
        {menu.map((item) => (
          <Link key={item.path} to={item.path}>
            <button
              className={`
                w-full
                text-left
                px-6
                py-5
                rounded-2xl
                transition
                text-lg
                font-medium

                ${
                  location.pathname === item.path
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }
              `}
            >
              {item.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
