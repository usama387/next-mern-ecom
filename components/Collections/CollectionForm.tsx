"use client";
// Global import
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// local import
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "../CustomUi/ImageUpload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Delete from "../CustomUi/Delete";

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface Props {
  initialData?: collectionType | null;
}

const CollectionForm = ({ initialData }: Props) => {
  // to direct the user on collections page after pressing discard button
  const router = useRouter();

  // to manage loading state to submit function
  const [loading, setLoading] = useState(false);

  // 1. defining my form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  //preventing reload or data loss on enter
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  // 2. Define a submit handler which takes values as input from the downward form fields passes it to the POST rest api to create a new collection.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";

      // fetching POST api of collections
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setLoading(false);

        // if the initial data updated otherwise created
        toast.success(`Collection ${initialData ? "updated" : "created"}`);
        window.location.href = "/collections";
        router.push("/collections");
      }
    } catch (error) {
      console.log("[collections_POST]", error);
      toast.error("Api failed or something went wrong");
    }
  };

  return (
    <div className="p-10">
      {/* Ternary operator for deciding update or add product and initialData represent the singleCollection page details coming from there as prop*/}
      {initialData ? (
        <div className="flex justify-between items-center">
          <p className="text-heading2-bold">Edit Collection</p>

          {/* item helps delete component to decide fire delete api on either products or collections in */}
          <Delete id={initialData._id} item="collection" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Collection</p>
      )}

      <Separator className="mt-4 mb-7 bg-grey-1" />

      {/* Form component has 3 fields for uploading title, description and images using cloudinary package */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button
              type="submit"
              className="bg-blue-1 text-white"
              onClick={() => router.push("/collections")}
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/collections")}
              className="bg-primary"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
