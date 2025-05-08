"use client";

import { useState, useEffect } from "react";
import UpdateStatus from "@/components/orders/UpdateStatus";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";
const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const res = await fetch(`/api/orders/${params.orderId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setOrderData(data);
    };

    fetchOrderDetails();
  }, [params.orderId]);

  if (!orderData) {
    return <p>Loading...</p>;
  }

  const { orderDetails, customer } = orderData;
  const { street, city, state, postalCode, country } = orderDetails.shippingAddress;

  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base-bold">
        Order ID: <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        Customer name: <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        Shipping address: <span className="text-base-medium">{street}, {city}, {state}, {postalCode}, {country}</span>
      </p>
      <p className="text-base-bold">
        Total Paid: <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>
      <p className="text-base-bold">
        Shipping rate ID: <span className="text-base-medium">{orderDetails.shippingRate}</span>
      </p>

      {/* ✅ Update Order Status Section */}
      <UpdateStatus orderId={orderDetails._id} currentStatus={orderDetails.status} />

      <DataTable columns={columns} data={orderDetails.products} searchKey="product" />
    </div>
  );
};

export default OrderDetails;
