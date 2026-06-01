import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

export const CartContext = createContext();

function CartProvider({ children }) {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // GET PRODUCT QUANTITY
  const getProductQuantity = (id, selectedSize) => {
    const product = cart.find(
      (item) => item._id === id && item.selectedSize === selectedSize,
    );

    return product ? product.quantity : 0;
  };

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");

      return;
    }

    const existingProduct = cart.find(
      (item) =>
        item._id === product._id && item.selectedSize === product.selectedSize,
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item._id === product._id && item.selectedSize === product.selectedSize
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );

      setCart(updatedCart);

      toast.success("Cart updated");
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

      toast.success("Added to cart");
    }
  };

  // REMOVE FROM CART
  const removeFromCart = (id, selectedSize) => {
    const filtered = cart.filter(
      (item) => !(item._id === id && item.selectedSize === selectedSize),
    );

    setCart(filtered);
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id, selectedSize) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id && item.selectedSize === selectedSize) {
        const currentSize = item.pSizes.find(
          (sizeItem) => sizeItem.size === selectedSize,
        );

        if (item.quantity >= currentSize.quantity) {
          toast.error("Stock limit reached");

          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    setCart(updatedCart);
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id, selectedSize) => {
    const updatedCart = cart

      .map((item) =>
        item._id === id && item.selectedSize === selectedSize
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      )

      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getProductQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
