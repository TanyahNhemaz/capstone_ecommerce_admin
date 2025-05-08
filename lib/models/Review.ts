import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: String, required: true }, // ✅ use userId instead of clerkId
  text: { type: String, required: true },
  emoji: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  sentiment: { type: String, required: true },
}, {
  timestamps: true,
});

const Review = models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
