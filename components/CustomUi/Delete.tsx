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
}

const Delete = ({ id }: DeleteProps) => {
  // managing state for api loading
  const [loading, setLoading] = useState(false);

  // function that fetches api and deletes the collection
  const onDelete = async () => {
    try {
      setLoading(true);

      // awaiting the api response
      const response = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });

      // page will be refreshed when the response is ok
      if (response.ok) {
        setLoading(false);
        window.location.href = "/collections";
        toast.success("Collection deleted");
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
            Are you sure to delete this collection ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            collection from the database.
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
