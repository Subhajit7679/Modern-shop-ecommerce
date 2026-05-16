import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");

  return savedCart ? JSON.parse(savedCart) : [];
});

  // GET PRODUCT QUANTITY
  const getProductQuantity = (id) => {

    const product = cart.find(
      (item) => item._id === id
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

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {

    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {

      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

    }
  };

  // REMOVE FROM CART
  const removeFromCart = (id) => {

    const filtered = cart.filter(
      (item) => item._id !== id
    );

    setCart(filtered);
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCart(updatedCart);
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;