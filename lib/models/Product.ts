import mongoose from "mongoose";
import { getDBConnection } from "../mongoDB";

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  media: [String],
  category: String,
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String],
  sizes: [String],
  colors: [String],
  price: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString())
  },
  expense: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString())
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { toJSON: { getters: true } });

// ✅ Use the admin DB connection
const adminConnection = getDBConnection("admin");

const Product = adminConnection.models.Product || adminConnection.model("Product", ProductSchema);

export default Product;
