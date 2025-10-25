import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// --- Global Axios Configuration ---
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (error) {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error("Failed to fetch products.");
    }
  };

  const fetchWishlist = async () => {
    if (user) {
      try {
        const { data } = await axios.get("/api/user/wishlist");
        if (data.success) {
          setWishlist(data.wishlist);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist");
      }
    }
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success("Added to Cart");
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cartItems[item];
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const handleWishlist = async (productId) => {
    try {
      const isWishlisted = wishlist.some((item) => item._id === productId);
      const endpoint = isWishlisted
        ? "/api/user/wishlist/remove"
        : "/api/user/wishlist/add";
      const { data } = await axios.post(endpoint, { productId });
      if (data.success) {
        toast.success(data.message);
        fetchWishlist();
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();
      await fetchSeller();
      await fetchProducts();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    const updateCartInDB = async () => {
      if (user) {
        try {
          await axios.post("/api/cart/update", { cartItems });
        } catch (error) {
          console.error("Failed to sync cart with DB");
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      updateCartInDB();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    setCartItems,
    wishlist,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    updateCartItem,
    getCartCount,
    getCartAmount,
    handleWishlist,
    fetchProducts,
    fetchUser,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
