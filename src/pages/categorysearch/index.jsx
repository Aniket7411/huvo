import React, { useEffect, useState } from "react";
import { HttpClient } from "../../server/client/http";
import { toast } from "react-toastify";
import { PiCurrencyInr } from "react-icons/pi";
import { CiDeliveryTruck, CiDiscount1 } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


const CategoryPage = () => {
  const { category, gender } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    sort: "",
    rating: "",
  });
  const { group, categoryId } = useParams();
  const location = useLocation();
  const state = location.state || {};

  console.log("Params:", { group, categoryId }); 


  const getProducts = async () => {
      const response = await HttpClient.get("/product", {group,category:  categoryId})

      console.log(response)
  }

  useEffect(() => {
    getProducts()
  }, [])


  return (

    <div>
      <h1>annanan</h1>
    </div>
  );
};

export default CategoryPage;
