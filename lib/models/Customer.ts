import mongoose from "mongoose";
import { getDBConnection } from "../mongoDB";

const customerSchema = new mongoose.Schema({
  clerkId: String,
  name: String,
  email: String,
  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// ✅ Use the admin DB connection
const adminConnection = getDBConnection("admin");

const Customer = adminConnection.models.Customer || adminConnection.model("Customer", customerSchema);

export default Customer;
