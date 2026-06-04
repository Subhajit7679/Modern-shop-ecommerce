import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ADD TO WISHLIST
  const addToWishlist = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
        },
      });

      return;
    }
    const exists = wishlist.find((item) => item._id === product._id);

    if (!exists) {
      setWishlist([...wishlist, product]);

      toast.success("Added to wishlist");
    } else {
      toast.error("Already in wishlist");
    }
  };

  // REMOVE FROM WISHLIST
  const removeFromWishlist = (id) => {
    const filtered = wishlist.filter((item) => item._id !== id);

    setWishlist(filtered);

    toast.success("Removed from wishlist");
  };

  // CLEAR WISHLIST
  const clearWishlist = () => {
    setWishlist([]);
  };

  // CHECK PRODUCT IN WISHLIST
  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
