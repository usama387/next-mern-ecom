"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../CustomUi/Delete";
import Link from "next/link";

export const columns: ColumnDef<productType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-[#533fd7]"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    // collections will be mapped and shown with comma 
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) =>
      row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price (PKR)",
  },
  {
    accessorKey: "expense",
    header: "Expense (PKR)",
  },
  {
    // it uses a id to delete a product from fetch api function 
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];
