import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>

    <BrowserRouter>

      <WishlistProvider>

        <CartProvider>

          <Toaster
            position="top-right"
            reverseOrder={false}
          />

          <App />

        </CartProvider>

      </WishlistProvider>

    </BrowserRouter>

  </StrictMode>
);