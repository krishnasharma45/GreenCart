import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white transition-all z-50">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      <div className="hidden sm:flex items-center gap-8">
        <NavLink
          to="/"
          className="relative inline-block 
           text-gray-700 hover:text-gray-900 
           pb-1 
           transition-colors duration-300 
           after:content-[''] after:absolute 
           after:bottom-0 after:left-0 
           after:w-0 after:h-0.5 
           after:bg-orange-500 
           after:transition-width after:duration-300 after:ease-in-out
           hover:after:w-full"
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className="relative inline-block 
           text-gray-700 hover:text-gray-900 
           pb-1 
           transition-colors duration-300 
           after:content-[''] after:absolute 
           after:bottom-0 after:left-0 
           after:w-0 after:h-0.5 
           after:bg-orange-500 
           after:transition-width after:duration-300 after:ease-in-out
           hover:after:w-full"
        >
          All Product
        </NavLink>
        <NavLink
          to="/wishlist"
          className="relative inline-block 
           text-gray-700 hover:text-gray-900 
           pb-1 
           transition-colors duration-300 
           after:content-[''] after:absolute 
           after:bottom-0 after:left-0 
           after:w-0 after:h-0.5 
           after:bg-orange-500 
           after:transition-width after:duration-300 after:ease-in-out
           hover:after:w-full"
        >
          Wishlist
        </NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-400 px-3 rounded-full active:border-gray-900 transition-colors duration-200">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-orange-500 hover:bg-orange-600 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-orange-500 hover:bg-orange-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={user.profileImage || assets.profile_icon}
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />

            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/profile")}
                className="p-1.5 pl-3 hover:bg-orange-500/10 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={() => navigate("my-orders")}
                className="p-1.5 pl-3 hover:bg-orange-500/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-orange-500/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-orange-500 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className=""
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-40`}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Product
          </NavLink>
          {user && (
            <NavLink to="/products" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          {/* <NavLink to="/" onClick={() => setOpen(false)}>
            Contact
          </NavLink> */}

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-orange-500 hover:bg-orange-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-orange-500 hover:bg-orange-600 transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
