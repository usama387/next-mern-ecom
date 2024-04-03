"use client";
// global import
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// local import
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteProps {
  id: string;
  item: string;
}

const Delete = ({ item, id }: DeleteProps) => {
  // managing state for api loading
  const [loading, setLoading] = useState(false);

  // function that fetches api and deletes the collection
  const onDelete = async () => {
    try {
      setLoading(true);

      // if the delete prop has item from product or category then we need to send a different api request and this method is used because this component is a reusable component used by both product and collections to perform deletion
      const itemType = item === "product" ? "products" : "collections";

      // awaiting the api response taking itemType to decide which model to perform delete operation on
      const response = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      });

      // page will be refreshed when the response is ok based on itmType
      if (response.ok) {
        setLoading(false);
        window.location.href = `/${itemType}`;
        toast.success(`${item} deleted`);
      }
    } catch (error) {
      toast.error("An error occurred please try again");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-blue-900 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you sure to delete this {item} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this{item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white text-blue-900">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
