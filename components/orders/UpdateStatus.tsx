"use client";

import { useState } from "react";

interface UpdateStatusProps {
  orderId: string;
  currentStatus: string;
}

const UpdateStatus = ({ orderId, currentStatus }: UpdateStatusProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      alert("Order status updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 my-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="paid">Paid</option>
        <option value="delivered">Delivered</option>
      </select>
      <button
        onClick={handleStatusUpdate}
        className="bg-black text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};

export default UpdateStatus;
