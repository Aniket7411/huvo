import React from "react";
import ProductsShowingComponent from "../../filterproductComponent";

const SimilarProducts = ({ recommended = {} }) => {
  const { recommendProduct = [] } = recommended; // Destructure to access recommendProduct array

  // Log the data for debugging
  console.log("recommendProduct:", recommendProduct);

  if (!recommendProduct.length) {
    return <p>No recommended products available.</p>;
  }

  return (
    <div>

      <ProductsShowingComponent allProducts={recommendProduct}  />
    
    </div>
  );
};

export default SimilarProducts;
