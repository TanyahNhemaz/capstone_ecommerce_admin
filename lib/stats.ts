// /lib/stats.ts
import { getDBConnection } from "@/lib/mongoDB";

export const getLiveStats = async (dbType: 'admin' | 'store') => {
    const conn = getDBConnection(dbType);
    if (!conn.db) throw new Error(`${dbType} database not connected`); // Critical safety check
    
    const db = conn.db; // Now TypeScript won't complain
    
    return {
        // Basic database metrics
        dbStats: await db.command({ dbStats: 1 }),
        
        // Collection-level metrics
        collections: await db.listCollections().toArray(),
        
        // Custom aggregations (example for store)
        productStats: dbType === 'store' ? await db.collection('products').aggregate([
        { $group: { 
            _id: null, 
            totalProducts: { $sum: 1 },
            avgPrice: { $avg: "$price" }
        }}
        ]).toArray() : null,
        
        // Connection health
        connectionStatus: {
        admin: getDBConnection('admin').readyState,
        store: getDBConnection('store').readyState
        }
    };
};
