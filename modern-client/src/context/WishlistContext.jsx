import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {


const [wishlist, setWishlist] = useState(() => {
  const savedWishlist = localStorage.getItem("wishlist");

  return savedWishlist ? JSON.parse(savedWishlist) : [];
});

  // LOAD FROM LOCAL STORAGE
  useEffect(() => {

    const savedWishlist =
      localStorage.getItem("wishlist");

    if (savedWishlist) {

      setWishlist(JSON.parse(savedWishlist));

    }

  }, []);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);

  // ADD TO WISHLIST
  const addToWishlist = (product) => {

    const exists = wishlist.find(
      (item) => item._id === product._id
    );

    if (!exists) {

      setWishlist([
        ...wishlist,
        product,
      ]);

    }

  };

  // REMOVE FROM WISHLIST
  const removeFromWishlist = (id) => {

    const filtered = wishlist.filter(
      (item) => item._id !== id
    );

    setWishlist(filtered);

  };

  // CHECK PRODUCT IN WISHLIST
  const isInWishlist = (id) => {

    return wishlist.some(
      (item) => item._id === id
    );

  };

  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >

      {children}

    </WishlistContext.Provider>

  );
}

export default WishlistProvider;