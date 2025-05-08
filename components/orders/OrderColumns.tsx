"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original._id}`}
        prefetch={false}
        className="hover:text-red-1 underline"
      >
        {row.original._id}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalAmount",
    header: "Total ($)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "status", // ✅ NEW COLUMN
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.original.status || "";
      const formatted = status.charAt(0).toUpperCase() + status.slice(1);
      return <span>{formatted}</span>;
    },
  },
];
