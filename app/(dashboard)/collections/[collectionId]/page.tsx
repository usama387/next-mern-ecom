"use client";
import CollectionForm from "@/components/Collections/CollectionForm";
import Loader from "@/components/CustomUi/Loader";
import React, { useEffect, useState } from "react";

const SingleCollectionPage = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  // managing state for api calling
  const [loading, setLoading] = useState(true);

  const [collectionDetails, setCollectionDetails] =
    useState<collectionType | null>(null);

  const getCollectionDetails = async () => {
    try {
      const response = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET",
      });

      const data = await response.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("collectionId_GET", error);
    }
  };

  useEffect(() => {
    getCollectionDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <CollectionForm initialData={collectionDetails} />
    </div>
  );
};

export default SingleCollectionPage;
