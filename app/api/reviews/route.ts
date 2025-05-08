import { NextResponse } from "next/server";
import { getDBConnection } from "@/lib/mongoDB";

export async function GET() {
  try {
    // Get the store connection
    const storeConn = getDBConnection('store');
    
    // Access reviews directly
    if (!storeConn.db) {
      throw new Error("Database connection is undefined");
    }
    const reviews = await storeConn.db.collection('reviews')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      reviews: reviews.map(r => ({
        ...r,
        _id: r._id.toString(),
        productId: r.productId.toString(),
        createdAt: r.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}