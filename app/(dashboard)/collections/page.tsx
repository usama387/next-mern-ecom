"use client";
import { columns } from "@/components/Collections/CollectionColumns";
import { DataTable } from "@/components/CustomUi/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CollectionsPage = () => {
  // managing state for api loading
  const [loading, setLoading] = useState(true);

  // managing state for collections array
  const [collections, setCollections] = useState([]);

  // function that fetches collections from GET api/collections
  const getCollections = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "GET",
        cache: "no-store", // Disable caching
      });

      //converting response in JSON
      const data = await response.json();

      // managing state
      setCollections(data);

      // after receiving the response
      setLoading(false);
    } catch (error) {
      console.log("collections_GET]", error);
    }
  };

  useEffect(() => {
    getCollections();
  });

  return (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Collections</p>
        <Link href={'/collections/new'}>
        <Button className="bg-blue-1 text-white">
          <Plus className="h-4 w-4 mr-2" /> Create Collection
        </Button>
        </Link>
      </div>
      <Separator className=" bg-grey-1 my-4" />
      <DataTable columns={columns} data={collections} searchKey="title"/>
    </div>
  );
};

export default CollectionsPage;
