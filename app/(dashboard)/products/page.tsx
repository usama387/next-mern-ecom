"use client";
import { DataTable } from "@/components/CustomUi/DataTable";
import Loader from "@/components/CustomUi/Loader";
import { columns } from "@/components/products/ProductColumn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<productType[]>([]);

  // fetching GET api for products
  const getAllProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
      });

      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log("[products_GET]", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Products</p>
        <Link href={"/products/new"}>
          <Button className="bg-blue-1 text-white">
            <Plus className="h-4 w-4 mr-2" /> Create Product
          </Button>
        </Link>
      </div>
      <Separator className=" bg-grey-1 my-4" />
      {/* The products from api are sent to this component as prop */}
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  );
};

export default ProductsPage;
