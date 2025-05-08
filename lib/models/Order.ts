import { getDBConnection } from "../mongoDB";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      color: String,
      size: String,
      quantity: Number,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  shippingRate: String,
  totalAmount: Number,

  status: {
    type: String,
    enum: [ "paid",  "delivered"],
    default: "paid",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Use admin connection explicitly
const adminConnection = getDBConnection("admin");

// Register with correct connection
const Order = adminConnection.models.Order || adminConnection.model("Order", orderSchema);

export default Order;
