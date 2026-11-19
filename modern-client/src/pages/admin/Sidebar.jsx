
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingBag,
  TicketPercent,
  Menu,
  X,
  ChevronRight,
  Store,
  PanelLeftClose,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: PlusCircle,
    },
    {
      name: "Manage Products",
      path: "/admin/manage-products",
      icon: Package,
    },
    {
      name: "Manage Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Manage Coupons",
      path: "/admin/manage-coupons",
      icon: TicketPercent,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname === path;
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex h-full flex-col bg-[#171715]">
      {/* BRAND */}
      <div className="border-b border-white/[0.07] px-6 py-7">
        <Link
          to="/admin"
          onClick={mobile ? closeMobile : undefined}
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center border border-[#c7b99d]/30 bg-[#c7b99d]/10 text-[#c7b99d] transition group-hover:bg-[#c7b99d] group-hover:text-[#171715]">
            <Store size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Modern<span className="text-[#c7b99d]">Shop</span>
            </h1>

            <p className="mt-1 text-[8px] font-semibold uppercase tracking-[2.5px] text-zinc-600">
              Administration
            </p>
          </div>
        </Link>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-5 px-3 text-[9px] font-semibold uppercase tracking-[2.5px] text-zinc-600">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={mobile ? closeMobile : undefined}
                className={`group relative flex items-center justify-between gap-3 border px-4 py-3.5 transition-all duration-300 ${
                  active
                    ? "border-[#c7b99d]/20 bg-[#c7b99d]/10 text-[#c7b99d]"
                    : "border-transparent text-zinc-500 hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-zinc-200"
                }`}
              >
                <span
                  className={`absolute bottom-2 left-0 top-2 w-[2px] transition ${
                    active ? "bg-[#c7b99d]" : "bg-transparent"
                  }`}
                />

                <div className="flex min-w-0 items-center gap-3">
                  <Icon
                    size={17}
                    className={`shrink-0 transition ${
                      active
                        ? "text-[#c7b99d]"
                        : "text-zinc-600 group-hover:text-zinc-300"
                    }`}
                  />

                  <span className="truncate text-xs font-semibold tracking-wide">
                    {item.name}
                  </span>
                </div>

                <ChevronRight
                  size={14}
                  className={`shrink-0 transition ${
                    active
                      ? "translate-x-0 text-[#c7b99d] opacity-100"
                      : "-translate-x-1 text-zinc-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM BRAND PANEL */}
      <div className="border-t border-white/[0.07] p-5">
        <div className="border border-white/[0.06] bg-[#20201d] p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-[9px] font-semibold uppercase tracking-[1.5px] text-zinc-400">
              Admin Workspace
            </p>
          </div>

          <p className="text-[10px] leading-5 text-zinc-600">
            Manage your store, products, orders and promotions from one place.
          </p>
        </div>

        <p className="mt-4 text-center text-[8px] uppercase tracking-[2px] text-zinc-700">
          ModernShop © 2026
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-20 z-40 hidden h-[calc(100vh-80px)] w-[250px] border-r border-white/[0.07] lg:block">
        <SidebarContent />
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="fixed left-0 right-0 top-20 z-50 flex items-center justify-between border-b border-white/[0.07] bg-[#171715] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <PanelLeftClose size={17} className="text-[#c7b99d]" />

          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-white">
            Admin Panel
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-[#c7b99d] transition hover:bg-[#c7b99d] hover:text-black"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 top-20 z-[70] w-[280px] border-r border-white/10 shadow-2xl lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
