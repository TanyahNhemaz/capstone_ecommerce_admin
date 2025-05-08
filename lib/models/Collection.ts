import mongoose from "mongoose";
import { getDBConnection } from "../mongoDB";

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }
  ],
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

const Collection = adminConnection.models.Collection || adminConnection.model("Collection", collectionSchema);

export default Collection;
