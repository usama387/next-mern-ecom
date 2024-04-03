"use client";
// Global import
import React, { useEffect, useState } from "react";
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
import MultiText from "../CustomUi/MultiText";
import MultiSelect from "../CustomUi/MultiSelect";
import Loader from "../CustomUi/Loader";

// schema the form will handle
const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
  initialData?: productType | null;
}

const ProductForm = ({ initialData }: ProductFormProps) => {
  // to direct the user on collections page after pressing discard button
  const router = useRouter();

  // to manage loading state to submit function
  const [loading, setLoading] = useState(true);

  // managing state for collections to be selected
  const [collections, setCollections] = useState<collectionType[]>([]) as any;

  const getCollections = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "GET",
      });

      const data = await response.json();

      // passing data in the useState
      setCollections(data);

      // api loading to false once data is received
      setLoading(false);
    } catch (error) {
      console.log("[collections_GET]", error);
      toast.error("Something went wrong");
    }
  };

  // for triggering above getCollections
  useEffect(() => {
    getCollections();
  }, []);

  // 1. defining my form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections?.map(
            (collection) => collection._id
          ),
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
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
        ? `/api/products/${initialData._id}`
        : "/api/products";

      // fetching POST api of collections
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setLoading(false);

        // if the initial data updated otherwise created
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (error) {
      console.log("[products_POST]", error);
      toast.error("Api failed or something went wrong");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {/* Ternary operator for deciding update or add product and initialData represent the singleProduct page details coming from there as prop*/}
      {initialData ? (
        <div className="flex justify-between items-center">
          <p className="text-heading2-bold">Edit Products</p>

          {/* item helps delete component to decide fire delete api on either products or collections */}
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Add Product</p>
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
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (PKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
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
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense (PKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category"
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* This form field will only be rendered when */}
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Colors"
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Sizes"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (size) => size !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* SUBMIT & DISCARD BUTTON */}
          <div className="flex gap-10">
            <Button
              type="submit"
              className="bg-blue-1 text-white"
              onClick={() => router.push("/products")}
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
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

export default ProductForm;
