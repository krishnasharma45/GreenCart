import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { wishlist } = useAppContext();

  return (
    <div className="relative mt-20 md:mt-24">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase cursor-pointer">
          My Wishlist
        </p>
        <div className="w-16 h-0.5 bg-orange-500 rounded-full"></div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">Your wishlist is empty.</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
