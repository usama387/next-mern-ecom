"use client";
import Loader from "@/components/CustomUi/Loader";
import ProductForm from "@/components/products/ProductForm";
import React, { useEffect, useState } from "react";

const SingleProductPage = ({ params }: { params: { productId: string } }) => {
  // managing state for api loading
  const [isLoading, setIsLoading] = useState(true);

  // managing state for passing api data into products
  const [productDetails, setProductDetails] = useState<productType | null>(
    null
  );

  const getProductDetails = async () => {
    try {
      const response = await fetch(`/api/products/${params.productId}`, {
        method: "GET",
      });

      const data = await response.json();
      setProductDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.log("[productId_GET]", error);
    }
  };

  useEffect(() => {
    getProductDetails();
  });

  return isLoading ? <Loader /> : <div>
    <ProductForm initialData={productDetails} />
  </div>;
};

export default SingleProductPage;
