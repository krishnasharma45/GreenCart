import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-16">
      <div className="flex justify-between items-center">
        <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
        <Link
          to="/products"
          className="text-orange-500 font-bold cursor-pointer hover:underline pr-2"
        >
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
