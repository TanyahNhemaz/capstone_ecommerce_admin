import { getDBConnection } from "@/lib/mongoDB";
import { NextResponse } from 'next/server';

export async function GET() {  // Explicitly handle GET requests
  try {
    const conn = getDBConnection('store');
    if (!conn.db) throw new Error('Database not connected');
    
    const reviewsCollection = conn.db.collection('reviews');
    
    const [count, avgResult, sentiment] = await Promise.all([
      reviewsCollection.countDocuments(),
      reviewsCollection.aggregate([{ 
        $group: { _id: null, avg: { $avg: "$rating" } } 
      }]).toArray(),
      reviewsCollection.aggregate([
        { $match: { sentimentScore: { $gt: 0.7 } } },
        { $count: "positive" }
      ]).toArray()
    ]);

    return NextResponse.json({
      documents: count,
      avgRating: avgResult[0]?.avg || 0,
      positiveSentiment: sentiment[0]?.positive / count || 0,
      documentGrowth: 12,
      ratingTrend: 0.3,
      sentimentTrend: 0.05
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
