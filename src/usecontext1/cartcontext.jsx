import React, { createContext, useState } from "react";


// Create the context
export const ProductContext = createContext(); // Renamed for clarity



// Provide the context
export const ProductProvider = ({ children }) => {
  // Vacant array in state to hold products
  const [products, setProducts] = useState([]);




  // Function to add a product
  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  // Context value to share
  const contextValue = { products, addProduct };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider; // Default export
